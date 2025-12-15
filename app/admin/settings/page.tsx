// File: app/admin/settings/page.tsx

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getSiteSettings } from "./actions"
import { SettingsForm } from "./settings-form" // Import the new client component

export default async function AdminSettingsPage() {
  const { settings, error } = await getSiteSettings();

  if (error || !settings) {
    return <p className="text-destructive">Error loading settings: {error}</p>
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Site Settings</h1>
        <p className="text-muted-foreground">Manage global settings for your website.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Homepage Sections</CardTitle>
          <CardDescription>Control which content sections are visible on the main page.</CardDescription>
        </CardHeader>
        {/* Render the client component and pass the server-fetched data as a prop */}
        <SettingsForm settings={settings} />
      </Card>
    </div>
  )
}