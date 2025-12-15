import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
            <Button asChild>
              <Link href="/consultation">Book Consultation</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="font-serif font-black text-3xl md:text-5xl text-foreground mb-8">Terms of Service</h1>

        <div className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:font-bold prose-headings:text-foreground prose-p:text-foreground prose-p:leading-relaxed">
          <p className="text-lg text-muted-foreground mb-8">Last updated: January 15, 2024</p>

          <h2>Acceptance of Terms</h2>
          <p>
            By accessing and using this website and our consultation services, you accept and agree to be bound by the
            terms and provision of this agreement. If you do not agree to abide by the above, please do not use this
            service.
          </p>

          <h2>Consultation Services</h2>
          <p>
            Our consultation services are provided for informational and advisory purposes only. While we strive to
            provide accurate and helpful guidance, we cannot guarantee specific outcomes or results from implementing
            our recommendations.
          </p>

          <h2>Booking and Payment</h2>
          <p>
            Consultation bookings require advance payment. Cancellations made at least 24 hours before the scheduled
            consultation will receive a full refund. Cancellations made less than 24 hours in advance may be subject to
            a cancellation fee.
          </p>

          <h2>Confidentiality</h2>
          <p>
            We maintain strict confidentiality regarding all information shared during consultation sessions. We will
            not disclose any confidential information without your explicit written consent, except as required by law.
          </p>

          <h2>Intellectual Property</h2>
          <p>
            All content on this website, including text, graphics, logos, and images, is the property of Brendan
            Consultation Services and is protected by copyright and other intellectual property laws.
          </p>

          <h2>Limitation of Liability</h2>
          <p>
            In no event shall Brendan Consultation Services be liable for any indirect, incidental, special,
            consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or
            other intangible losses.
          </p>

          <h2>Governing Law</h2>
          <p>
            These terms shall be interpreted and governed in accordance with the laws of the State of California,
            without regard to its conflict of law provisions.
          </p>

          <h2>Contact Information</h2>
          <p>Questions about the Terms of Service should be sent to us at:</p>
          <ul>
            <li>Email: brendan@consultation.com</li>
            <li>Phone: +1 (555) 123-4567</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
