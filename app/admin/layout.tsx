// File: app/admin/layout.tsx

import Link from "next/link"
import { Home, Image, FileText, Music, Calendar, LogOut, Heart, Settings, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { signOut } from "@/auth"

async function SignOut() {
  "use server"
  await signOut({ redirectTo: "/" })
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full flex bg-muted/40">
      <aside className="hidden w-64 flex-col border-r bg-background p-4 sm:flex">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-serif font-bold text-lg">F</span>
          </div>
          <span className="font-serif font-bold text-xl text-foreground">FIZ Admin</span>
        </div>
        <nav className="flex flex-col gap-2 flex-1">
          <Button variant="ghost" className="justify-start" asChild>
            <Link href="/admin"><Home className="mr-2 h-4 w-4" /> Dashboard</Link>
          </Button>
          <Button variant="ghost" className="justify-start" asChild>
            <Link href="/admin/gallery"><Image className="mr-2 h-4 w-4" /> Gallery</Link>
          </Button>
          <Button variant="ghost" className="justify-start" asChild>
            <Link href="/admin/texts"><FileText className="mr-2 h-4 w-4" /> Texts</Link>
          </Button>
          <Button variant="ghost" className="justify-start" asChild>
            <Link href="/admin/music"><Music className="mr-2 h-4 w-4" /> Music</Link>
          </Button>
          <Button variant="ghost" className="justify-start" asChild>
            <Link href="/admin/appointments"><Calendar className="mr-2 h-4 w-4" /> Appointments</Link>
          </Button>
          <Button variant="ghost" className="justify-start" asChild>
            <Link href="/admin/services"><Heart className="mr-2 h-4 w-4" /> Services</Link>
          </Button>
          {/* NEW LINK */}
          <Button variant="ghost" className="justify-start" asChild>
            <Link href="/admin/courses"><GraduationCap className="mr-2 h-4 w-4" /> Courses</Link>
          </Button>
          <Button variant="ghost" className="justify-start" asChild>
            <Link href="/admin/content"><FileText className="mr-2 h-4 w-4" /> Page Content</Link>
          </Button>
          <Button variant="ghost" className="justify-start" asChild>
            <Link href="/admin/settings"><Settings className="mr-2 h-4 w-4" /> Site Settings</Link>
          </Button>
        </nav>
        <form action={SignOut}>
          <Button variant="outline" className="w-full justify-start">
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </form>
      </aside>
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  )
}