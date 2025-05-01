import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Client } from "npm:@notionhq/client"
import OpenAI from "https://esm.sh/openai@4.20.1"
import { Resend } from "npm:resend@2.0.0"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const openai = new OpenAI({
  apiKey: Deno.env.get('OPENAI_API_KEY')
})

const notion = new Client({
  auth: Deno.env.get('NOTION_API_KEY')
})

const resend = new Resend(Deno.env.get('RESEND_API_KEY'))
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const databaseId = Deno.env.get('NOTION_DATABASE_ID') as string

const siteGuidelines = {
  "Authentic Sacrifice": "Compassionate, contemplative, and purposeful. Write in a warm yet reverent tone, balancing spiritual depth with practical guidance. Use measured pacing with occasional powerful statements that resonate emotionally. Use accessible yet meaningful vocabulary, avoiding overly technical theological terms while maintaining spiritual authenticity.",
  "Authority Maximizer": "Confident, decisive, and strategic. Write as a seasoned expert who has 'been there, done that.' Use direct, action-oriented language with powerful verbs and minimal qualifiers. Include occasional bold statements and challenges to the reader. Mix concise, punchy sentences with deeper insights that demonstrate thought leadership.",
  "Booked Impact": "Results-driven, energetic, and practical. Write like a focused conversation with a high-performance coach. Use metric-driven language, success stories, and clear frameworks. Balance professional expertise with approachable enthusiasm. Include industry terminology but explain it clearly for newcomers.",
  "Live Love Hobby": "Enthusiastic, supportive, and community-oriented. Write like a passionate friend sharing their joy. Use warm, inviting language with personal touches and relatable anecdotes. Include encouraging phrases and celebrate small wins. Keep technical information accessible and emphasize emotional benefits.",
  "MDB Consultancy": "Polished, analytical, and solution-focused. Write with seasoned expertise, clarity, and precision. Use well-structured sentences with evidence-based assertions. Balance professional terminology with clear explanations. Include subtle confidence markers that demonstrate industry experience without appearing boastful.",
  "MDBRAND": "Innovative, dynamic, and trend-aware. Write like digital natives who are ahead of the curve. Use contemporary marketing language, reference current digital trends, and incorporate data-driven insights. Balance technical expertise with creative energy. Vary between punchy statements and detailed explanations.",
  "New York Post Daily": "Fast-paced, engaging, and slightly provocative. Write with the vibrant energy of New York, mixing urban sophistication and street-smart directness. Use attention-grabbing statements. Balance entertainment value with informative content. Include cultural references and playful language that feels distinctly New York.",
  "Seismic Sports": "High-energy, passionate, and authoritative. Write to convey the excitement and drama of sports competition. Use dynamic language with vivid descriptions that put readers in the moment. Balance statistical analysis with emotional storytelling. Include sports terminology and fan-perspective comments.",
  "The LA Note": "Trendsetting, culturally aware, and casually sophisticated. Write to capture LA's blend of laid-back attitude and cultural influence. Use smooth, flowing language with contemporary references. Balance entertainment reporting with cultural analysis. Use current but not overly trendy vocabulary.",
  "Thought Leaders Ethos": "Insightful, visionary, and intellectually stimulating. Write like forward-thinkers shaping the future. Use thought-provoking questions and conceptual frameworks. Balance abstract ideas with practical applications. Vary between concise wisdom and expanded explorations of complex concepts.",
  "Trending Consumerism": "Informative, current, and discerning. Write like a savvy consumer advocate who understands market forces and personal needs. Use balanced evaluations with clear recommendations. Balance trend analysis with practical consumer advice. Include current product terminology with accessible explanations.",
  "HKlub Fitness": "Motivational, empowering, and knowledgeable. Write like a supportive personal trainer combining expertise with encouragement. Use direct, energetic language that inspires action. Balance scientific fitness information with accessible explanations. Include goal-oriented language and celebrate progress."
}

function truncateContent(content: string, maxLength: number = 2000): string {
  return content.length > maxLength 
    ? content.substring(0, maxLength) + '... (content truncated)' 
    : content;
}

async function generateUniqueArticle(originalContent: string, siteName: string) {
  try {
    const siteGuideline = siteGuidelines[siteName as keyof typeof siteGuidelines] || "";
    console.log(`Generating unique article for site: ${siteName}`);
    
    const prompt = `You are a professional content writer specializing in adapting articles for different websites while maintaining their core message.

Voice and Tone Guidelines for ${siteName}:
${siteGuideline}

Please rewrite the following article according to these specific voice and tone guidelines, while keeping the core message and key points intact:

${originalContent}

Make sure the rewritten article:
1. Perfectly matches the specified voice and tone
2. Maintains the original article's key points and message
3. Has a similar length to the original
4. Reads naturally and engagingly
5. Is unique and different from other versions`

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { 
          role: "system", 
          content: "You are an expert content writer who adapts articles for different websites while maintaining their core message." 
        },
        { role: "user", content: prompt }
      ],
    })

    console.log(`Successfully generated content for ${siteName}`);
    return completion.choices[0].message.content;
  } catch (error) {
    console.error(`Error generating article for ${siteName}:`, error);
    throw error;
  }
}

function chunkText(str: string, maxLen = 2000): string[] {
  const chunks: string[] = [];
  let i = 0;
  while (i < str.length) {
    let end = Math.min(i + maxLen, str.length);
    const slice = str.slice(i, end);
    const lastSpace = Math.max(slice.lastIndexOf('\n'), slice.lastIndexOf(' '));
    if (lastSpace > 0 && end < str.length) end = i + lastSpace;
    chunks.push(str.slice(i, end));
    i = end;
  }
  return chunks;
}

async function createNotionPage(title: string, content: string, siteName: string) {
  try {
    console.log(`Creating Notion page for site: ${siteName}`);
    // const truncatedContent = truncateContent(content);

    // const response = await notion.pages.create({
    //   parent: { database_id: databaseId },
    //   properties: {
    //     title: {
    //       title: [{ text: { content: `${title} - ${siteName}` } }]
    //     }
    //   },
    //   children: [
    //     {
    //       object: 'block',
    //       type: 'paragraph',
    //       paragraph: {
    //         rich_text: [{ text: { content: truncatedContent } }]
    //       }
    //     }
    //   ]
    // })

    // Map the chunks of text into Notion block objects
    const paragraphs = chunkText(content).map(text => ({
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: [{
          text: {
            content: text
          }
        }]
      }
    })); // Added closing parenthesis for the object literal inside map

    // Create the Notion page with title and content blocks
    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        // Define the title property for the Notion page
        title: {
          title: [{
            text: {
              content: `${title} - ${siteName}` // Use the provided title and siteName
            }
          }]
        }
        // Add other properties here if needed, e.g., status, tags, etc.
        // Example:
        // 'Status': { status: { name: 'Draft' } },
      },
      children: paragraphs // Add the content paragraphs as children blocks
    });

    console.log(`Successfully created Notion page for ${siteName}`);
    // Return the URL of the newly created Notion page
    return response.url;
  } catch (error) {
    // Log any errors that occur during Notion page creation
    console.error(`Error creating Notion page for ${siteName}:`, error);
    // Return an error message string
    // Consider throwing the error instead if the caller should handle it more robustly
    return `Error creating Notion page: ${error.message}`;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { title, content, selectedSites, userEmail } = await req.json()
    
    console.log("Starting article processing with email:", userEmail);
    
    let articleVersions = [];
    
    try {
      // First, generate all the unique content
      const generatedContents = await Promise.all(
        selectedSites.map(async (site: string) => {
          const uniqueContent = await generateUniqueArticle(content, site);
          return { site, content: uniqueContent };
        })
      );
      
      // Then try to create Notion pages
      articleVersions = await Promise.all(
        generatedContents.map(async ({ site, content: uniqueContent }) => {
          try {
            const notionUrl = await createNotionPage(title, uniqueContent, site);
            return { site, url: notionUrl };
          } catch (notionError) {
            console.error(`Error with Notion for site ${site}:`, notionError);
            return { 
              site, 
              url: "Notion page creation failed. Please check your Notion API key and database ID." 
            };
          }
        })
      );
    } catch (processingError) {
      console.error("Error during article processing:", processingError);
      // We'll continue to send emails even if there was an error
    }

    // Invoke the dedicated user article confirmation email function
    console.log("Invoking send-article-confirmation for:", userEmail);
    try {
      const { error: invokeError } = await supabase.functions.invoke('send-article-confirmation', {
        body: { userEmail: userEmail, articleTitle: title },
      });
      if (invokeError) {
        console.error(`Error invoking send-article-confirmation for ${userEmail}:`, invokeError);
        // Log error but continue
      } else {
        console.log(`Successfully invoked send-article-confirmation for ${userEmail}`);
      }
    } catch (invokeCatchError) {
      console.error(`Exception invoking send-article-confirmation for ${userEmail}:`, invokeCatchError);
    }

    // --- Send Owner Notification Email ---
    console.log("Sending owner notification email with Notion links");
    try {
      // Use the configured FROM_EMAIL and owner's email
      const FROM_EMAIL = Deno.env.get('FROM_EMAIL') ?? 'Lovable <no-reply@leadtech.uk>'; 
      const OWNER_EMAIL = 'olagunjujeremiah@gmail.com'; 
      // const OWNER_EMAIL = 'missiondrivenbrand@gmail.com'; 

      
      const emailResult = await resend.emails.send({
        from: FROM_EMAIL,
        to: OWNER_EMAIL,
        subject: `New Article Submitted: ${title}`,
        html: `
          <h1>New Article Submission</h1>
          <p>User (${userEmail || 'Unknown'}) submitted an article titled "<strong>${title}</strong>".</p>
          <p>It is being processed for the following sites:</p>
          <ul>
            ${selectedSites.map(site => `<li>${site}</li>`).join('')}
          </ul>
          ${articleVersions.length > 0 ? `
            <p>Notion page links:</p>
            <ul>
              ${articleVersions.map(v => `
                <li><strong>${v.site}</strong>: <a href="${v.url}" style="color: #2563eb; text-decoration: underline;">${v.url}</a></li>
              `).join('')}
            </ul>
          ` : `
            <p>Notion page creation encountered an error or is pending.</p>
          `}
        `
      });

      console.log("Owner notification email sent successfully:", emailResult);
    } catch (emailError) {
      console.error("Error sending owner notification email:", emailError);
      // Log error but continue
    }
    // --- Owner Notification End ---

    return new Response(
      JSON.stringify({ 
        success: true, 
        versions: articleVersions,
        message: "Article submitted successfully. Check your email for confirmation." 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error processing article:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
