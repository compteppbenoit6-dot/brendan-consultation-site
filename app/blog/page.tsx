import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, Calendar, Clock, User } from "lucide-react"

// Sample blog posts data - in a real app this would come from a CMS or API
const blogPosts = [
  {
    id: 1,
    slug: "sustainable-growth",
    title: "5 Strategies for Sustainable Business Growth",
    excerpt:
      "Discover proven methods to scale your business while maintaining quality and customer satisfaction. Learn how to build systems that support long-term success.",
    content: "Full article content would go here...",
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
    content: "Full article content would go here...",
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
    content: "Full article content would go here...",
    author: "Brendan",
    publishedAt: "2024-01-05",
    readTime: "5 min read",
    category: "Relationships",
    featured: false,
    image: "/blog-building-trust.png",
  },
  {
    id: 4,
    slug: "leadership-transformation",
    title: "Leadership Transformation in the Digital Age",
    excerpt:
      "How modern leaders can adapt their management style to thrive in an increasingly digital and remote work environment.",
    content: "Full article content would go here...",
    author: "Brendan",
    publishedAt: "2024-01-01",
    readTime: "7 min read",
    category: "Leadership",
    featured: true,
    image: "/blog-leadership-transformation.png",
  },
  {
    id: 5,
    slug: "data-driven-decisions",
    title: "Making Data-Driven Business Decisions",
    excerpt:
      "Learn how to leverage analytics and data insights to make informed strategic decisions that drive business growth and efficiency.",
    content: "Full article content would go here...",
    author: "Brendan",
    publishedAt: "2023-12-28",
    readTime: "9 min read",
    category: "Analytics",
    featured: false,
    image: "/blog-data-driven.png",
  },
  {
    id: 6,
    slug: "team-collaboration",
    title: "Enhancing Team Collaboration and Productivity",
    excerpt:
      "Practical strategies for improving team dynamics, communication, and overall productivity in both remote and in-person work environments.",
    content: "Full article content would go here...",
    author: "Brendan",
    publishedAt: "2023-12-20",
    readTime: "6 min read",
    category: "Team Building",
    featured: false,
    image: "/blog-team-collaboration.png",
  },
]

export default function BlogPage() {
  const featuredPosts = blogPosts.filter((post) => post.featured)
  const regularPosts = blogPosts.filter((post) => !post.featured)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                  <span className="text-primary-foreground text-xs font-bold">B</span>
                </div>
                <h1 className="font-serif font-bold text-2xl text-foreground">Blog</h1>
              </div>
            </div>
            <Button asChild>
              <Link href="/consultation">Book Consultation</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 px-4 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="font-serif font-black text-3xl md:text-5xl text-foreground mb-4">Insights & Expertise</h2>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Discover actionable strategies, industry insights, and expert guidance to help you navigate the challenges
            of modern business.
          </p>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-6xl">
            <h3 className="font-serif font-bold text-2xl text-foreground mb-8">Featured Articles</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredPosts.map((post) => (
                <Card
                  key={post.id}
                  className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20"
                >
                  <div className="aspect-[16/9] overflow-hidden bg-gradient-to-br from-primary/5 to-secondary/5">
                    <img
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                        {post.category}
                      </Badge>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                    </div>
                    <CardTitle className="font-serif font-bold text-xl leading-tight group-hover:text-primary transition-colors">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </CardTitle>
                    <CardDescription className="text-base leading-relaxed">{post.excerpt}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{post.author}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                      >
                        <Link href={`/blog/${post.slug}`}>
                          Read More
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Posts */}
      <section className="py-12 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h3 className="font-serif font-bold text-2xl text-foreground mb-8">All Articles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularPosts.map((post) => (
              <Card
                key={post.id}
                className="group hover:shadow-lg transition-all duration-300 border hover:border-primary/20"
              >
                <div className="aspect-[16/9] overflow-hidden bg-gradient-to-br from-primary/5 to-secondary/5">
                  <img
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-xs">
                      {post.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{post.readTime}</span>
                  </div>
                  <CardTitle className="font-serif font-bold text-lg leading-tight group-hover:text-primary transition-colors">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed line-clamp-3">{post.excerpt}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {new Date(post.publishedAt).toLocaleDateString()}
                    </span>
                    <Button variant="ghost" size="sm" asChild className="text-xs group-hover:text-primary">
                      <Link href={`/blog/${post.slug}`}>
                        Read More
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 px-4 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto text-center max-w-2xl">
          <h3 className="font-serif font-bold text-2xl md:text-3xl text-foreground mb-4">Stay Updated</h3>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Get the latest insights and strategies delivered directly to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <Button className="px-6 py-3">Subscribe</Button>
          </div>
        </div>
      </section>
    </div>
  )
}
