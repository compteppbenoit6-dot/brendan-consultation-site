import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Clock, User, Share2 } from "lucide-react"

// Sample blog posts data - same as in the listing page
const blogPosts = [
  {
    id: 1,
    slug: "sustainable-growth",
    title: "5 Strategies for Sustainable Business Growth",
    excerpt:
      "Discover proven methods to scale your business while maintaining quality and customer satisfaction. Learn how to build systems that support long-term success.",
    content: `
      <p>In today's competitive business landscape, sustainable growth isn't just about increasing revenue—it's about building a foundation that can support long-term success while maintaining quality and customer satisfaction.</p>
      
      <h2>1. Focus on Customer Retention</h2>
      <p>Acquiring new customers costs 5-25 times more than retaining existing ones. Invest in customer success programs, regular check-ins, and continuous value delivery to keep your current customers engaged and satisfied.</p>
      
      <h2>2. Build Scalable Systems and Processes</h2>
      <p>Document your key processes and create systems that can handle increased volume without proportional increases in resources. This includes everything from customer onboarding to quality control measures.</p>
      
      <h2>3. Invest in Your Team</h2>
      <p>Your people are your most valuable asset. Provide ongoing training, clear career paths, and a positive work environment. A skilled, motivated team is essential for sustainable growth.</p>
      
      <h2>4. Maintain Financial Discipline</h2>
      <p>Growth should be profitable growth. Monitor your cash flow carefully, maintain healthy margins, and avoid overextending your resources in pursuit of rapid expansion.</p>
      
      <h2>5. Stay Close to Your Market</h2>
      <p>Regular market research and customer feedback help you stay ahead of trends and adapt your offerings to meet evolving needs. This prevents you from growing in the wrong direction.</p>
      
      <p>Remember, sustainable growth is a marathon, not a sprint. By focusing on these fundamental strategies, you'll build a business that can thrive for years to come.</p>
    `,
    author: "Brendan",
    publishedAt: "2024-01-15",
    readTime: "8 min read",
    category: "Strategy",
    featured: true,
    image: "/blog-sustainable-growth.png",
  },
  {
    id: 2,
    slug: "remote-consulting",
    title: "The Future of Remote Consulting",
    excerpt:
      "How digital transformation is reshaping the consultation industry and what it means for both consultants and clients in the modern business landscape.",
    content: `
      <p>The consulting industry has undergone a dramatic transformation in recent years, with remote consulting becoming not just an option, but often the preferred method of service delivery.</p>
      
      <h2>The Digital Shift</h2>
      <p>Technology has made it possible to deliver high-quality consulting services without being physically present. Video conferencing, collaborative tools, and cloud-based platforms have created new possibilities for consultant-client relationships.</p>
      
      <h2>Benefits for Clients</h2>
      <p>Remote consulting offers clients greater flexibility, reduced costs, and access to a global pool of expertise. Clients can now work with the best consultants regardless of geographic location.</p>
      
      <h2>Challenges and Solutions</h2>
      <p>While remote consulting offers many advantages, it also presents challenges such as building trust, maintaining engagement, and ensuring effective communication. Successful remote consultants have developed strategies to overcome these obstacles.</p>
      
      <p>The future of consulting is hybrid—combining the best of remote and in-person interactions to deliver maximum value to clients.</p>
    `,
    author: "Brendan",
    publishedAt: "2024-01-10",
    readTime: "6 min read",
    category: "Digital",
    featured: false,
    image: "/blog-remote-consulting.png",
  },
  {
    id: 3,
    slug: "building-trust",
    title: "Building Trust in Professional Relationships",
    excerpt:
      "Essential elements for creating lasting client partnerships that drive mutual success and long-term business growth.",
    content: `
      <p>Trust is the foundation of any successful professional relationship. Without it, even the most skilled consultant will struggle to deliver meaningful results.</p>
      
      <h2>Transparency is Key</h2>
      <p>Be open about your processes, methodologies, and potential challenges. Clients appreciate honesty and are more likely to trust consultants who are transparent about both opportunities and risks.</p>
      
      <h2>Deliver on Your Promises</h2>
      <p>Consistency in delivery builds credibility over time. Set realistic expectations and then exceed them whenever possible. This creates a positive cycle of trust and confidence.</p>
      
      <h2>Listen Actively</h2>
      <p>Trust is built through understanding. Take the time to truly listen to your clients' concerns, goals, and constraints. This demonstrates that you value their perspective and are committed to their success.</p>
      
      <p>Building trust takes time, but it's the most valuable investment you can make in your professional relationships.</p>
    `,
    author: "Brendan",
    publishedAt: "2024-01-05",
    readTime: "5 min read",
    category: "Relationships",
    featured: false,
    image: "/blog-building-trust.png",
  },
]

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug)

  if (!post) {
    notFound()
  }

  // Get related posts (excluding current post)
  const relatedPosts = blogPosts.filter((p) => p.id !== post.id && p.category === post.category).slice(0, 2)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/blog">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blog
              </Link>
            </Button>
            <Button asChild>
              <Link href="/consultation">Book Consultation</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Article Header */}
      <article className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">{post.category}</Badge>
            <h1 className="font-serif font-black text-3xl md:text-5xl text-foreground mb-6 leading-tight">
              {post.title}
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">{post.excerpt}</p>

            {/* Article Meta */}
            <div className="flex items-center justify-between py-6 border-y border-border">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{post.author}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {new Date(post.publishedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{post.readTime}</span>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          {/* Featured Image */}
          <div className="aspect-[16/9] mb-12 overflow-hidden rounded-lg bg-gradient-to-br from-primary/5 to-secondary/5">
            <img src={post.image || "/placeholder.svg"} alt={post.title} className="w-full h-full object-cover" />
          </div>

          {/* Article Content */}
          <div
            className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:font-bold prose-headings:text-foreground prose-p:text-foreground prose-p:leading-relaxed prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Call to Action */}
          <div className="mt-16 p-8 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg text-center">
            <h3 className="font-serif font-bold text-2xl text-foreground mb-4">Ready to Apply These Strategies?</h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Get personalized guidance on implementing these concepts in your business.
            </p>
            <Button size="lg" asChild>
              <Link href="/consultation">Schedule a Consultation</Link>
            </Button>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <h3 className="font-serif font-bold text-2xl text-foreground mb-8">Related Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.map((relatedPost) => (
                <div key={relatedPost.id} className="group">
                  <Link href={`/blog/${relatedPost.slug}`} className="block">
                    <div className="aspect-[16/9] mb-4 overflow-hidden rounded-lg bg-gradient-to-br from-primary/5 to-secondary/5">
                      <img
                        src={relatedPost.image || "/placeholder.svg"}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <Badge variant="outline" className="mb-2 text-xs">
                      {relatedPost.category}
                    </Badge>
                    <h4 className="font-serif font-bold text-lg leading-tight group-hover:text-primary transition-colors mb-2">
                      {relatedPost.title}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{relatedPost.excerpt}</p>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
