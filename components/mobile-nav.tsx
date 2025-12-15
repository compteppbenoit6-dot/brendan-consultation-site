"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"

const navigationItems = [
  { href: "/", label: "Home" },
  { href: "/gallery", label: "Gallery" },
  { href: "/blog", label: "Blog" },
  { href: "/consultation", label: "Consultation" },
  { href: "/contact", label: "Contact" },
]

export function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <div className="flex flex-col space-y-4 mt-8">
          <div className="flex items-center space-x-2 pb-4 border-b border-border">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-serif font-bold text-lg">B</span>
            </div>
            <span className="font-serif font-bold text-xl text-foreground">Brendan</span>
          </div>
          <nav className="flex flex-col space-y-2">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-foreground hover:text-primary transition-colors font-medium py-2 px-3 rounded-lg hover:bg-muted"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="pt-4 border-t border-border">
            <Button asChild className="w-full" onClick={() => setOpen(false)}>
              <Link href="/consultation">Book Consultation</Link>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
