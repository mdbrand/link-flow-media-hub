
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Client } from "npm:@notionhq/client"
import OpenAI from "https://esm.sh/openai@4.20.1"
import { Resend } from "npm:resend@2.0.0"

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

async function createNotionPage(title: string, content: string, siteName: string) {
  try {
    console.log(`Creating Notion page for site: ${siteName}`);
    const truncatedContent = truncateContent(content);

    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        title: {
          title: [{ text: { content: `${title} - ${siteName}` } }]
        }
      },
      children: [
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [{ text: { content: truncatedContent } }]
          }
        }
      ]
    })
    
    console.log(`Successfully created Notion page for ${siteName}`);
    return response.url;
  } catch (error) {
    console.error(`Error creating Notion page for ${siteName}:`, error);
    throw error;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { title, content, selectedSites, userEmail } = await req.json()
    
    console.log("Starting article processing for sites:", selectedSites)
    
    const articleVersions = await Promise.all(
      selectedSites.map(async (site: string) => {
        const uniqueContent = await generateUniqueArticle(content, site)
        const notionUrl = await createNotionPage(title, uniqueContent, site)
        return { site, url: notionUrl }
      })
    )

    console.log("Successfully generated all article versions, sending notifications...")

    // Send email to user
    const userEmailResult = await resend.emails.send({
      from: 'Article Generator <onboarding@resend.dev>',
      to: userEmail,
      subject: `Your Article Versions Are Ready - ${title}`,
      html: `
        <h1>Your AI-Generated Article Versions Are Ready</h1>
        <p>Here are the Notion pages for each version of your article "${title}":</p>
        <ul>
          ${articleVersions.map(v => `
            <li><strong>${v.site}</strong>: <a href="${v.url}">View Article</a></li>
          `).join('')}
        </ul>
      `
    });

    // Send email to admin
    const adminEmailResult = await resend.emails.send({
      from: 'Article Generator <onboarding@resend.dev>',
      to: 'admin@lovable.ai', // Replace with your admin email
      subject: `New Article Submission - ${title}`,
      html: `
        <h1>New Article Submission</h1>
        <p><strong>Title:</strong> ${title}</p>
        <p><strong>From:</strong> ${userEmail}</p>
        <p><strong>Selected Sites:</strong></p>
        <ul>
          ${articleVersions.map(v => `
            <li><strong>${v.site}</strong>: <a href="${v.url}">View Version</a></li>
          `).join('')}
        </ul>
        <hr>
        <h2>Article Content Preview:</h2>
        <p>${content.substring(0, 300)}...</p>
      `
    });

    console.log("Email notifications sent:", {
      userEmail: userEmailResult,
      adminEmail: adminEmailResult
    });

    return new Response(
      JSON.stringify({ success: true, versions: articleVersions }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error processing article:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
