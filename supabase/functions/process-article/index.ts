
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

async function generateUniqueArticle(originalContent: string, siteName: string) {
  const prompt = `Rewrite the following article in the style and tone appropriate for ${siteName}, 
                 making it unique while maintaining the core message: ${originalContent}`

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { 
        role: "system", 
        content: "You are an expert content writer who adapts articles for different websites while maintaining their core message but making them unique." 
      },
      { role: "user", content: prompt }
    ],
  })

  return completion.choices[0].message.content
}

async function createNotionPage(title: string, content: string, siteName: string) {
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
          rich_text: [{ text: { content } }]
        }
      }
    ]
  })
  
  return response.url
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { title, content, selectedSites, userEmail } = await req.json()
    
    console.log("Processing article for sites:", selectedSites)
    
    const articleVersions = await Promise.all(
      selectedSites.map(async (site: string) => {
        const uniqueContent = await generateUniqueArticle(content, site)
        const notionUrl = await createNotionPage(title, uniqueContent, site)
        return { site, url: notionUrl }
      })
    )

    // Send email with Notion links
    await resend.emails.send({
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
    })

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
