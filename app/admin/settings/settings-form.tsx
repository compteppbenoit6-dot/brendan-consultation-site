// File: app/admin/settings/settings-form.tsx

"use client"

import { useActionState, useEffect } from "react"
import { useFormStatus } from "react-dom"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { updateSiteSettings, removeBackgroundImage } from "./actions"

function SubmitButton({ text = "Save Settings" }: { text?: string }) {
  const { pending } = useFormStatus();
  return <Button type="submit" disabled={pending}>{pending ? "Saving..." : text}</Button>
}

function RemoveBgButton() {
    const { pending } = useFormStatus();
    return <Button type="submit" variant="destructive" disabled={pending}>{pending ? "Removing..." : "Remove Background"}</Button>
}

export function SettingsForm({ settings }: { settings: any }) {
  const [updateState, updateFormAction] = useActionState(updateSiteSettings, { success: null, error: null });
  const [removeState, removeFormAction] = useActionState(removeBackgroundImage, { success: null, error: null });

  useEffect(() => {
    if (updateState.success) toast.success(updateState.success);
    if (updateState.error) toast.error(updateState.error);
  }, [updateState]);

  useEffect(() => {
    if (removeState.success) toast.success(removeState.success);
    if (removeState.error) toast.error(removeState.error);
  }, [removeState]);

  return (
    <>
      {/* Form 1: Main Settings (Switches and Image Upload) */}
      <form action={updateFormAction}>
        <Card>
          <CardHeader>
            <CardTitle>Homepage Sections</CardTitle>
            <CardDescription>Control which content sections are visible on the main page.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <Label htmlFor="showPictureSection" className="flex flex-col gap-1">
                <span>Picture Gallery Section</span>
                <span className="font-normal text-muted-foreground text-sm">Show the picture gallery card on the homepage.</span>
              </Label>
              <Switch id="showPictureSection" name="showPictureSection" defaultChecked={settings.showPictureSection} />
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <Label htmlFor="showTextSection" className="flex flex-col gap-1">
                <span>Text Gallery Section</span>
                <span className="font-normal text-muted-foreground text-sm">Show the text gallery card on the homepage.</span>
              </Label>
              <Switch id="showTextSection" name="showTextSection" defaultChecked={settings.showTextSection} />
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <Label htmlFor="showSpiritualSection" className="flex flex-col gap-1">
                <span>Spiritual Sessions Section</span>
                <span className="font-normal text-muted-foreground text-sm">Show the spiritual sessions card on the homepage.</span>
              </Label>
              <Switch id="showSpiritualSection" name="showSpiritualSection" defaultChecked={settings.showSpiritualSection} />
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <Label htmlFor="showMusicSection" className="flex flex-col gap-1">
                <span>Music Universe Section</span>
                <span className="font-normal text-muted-foreground text-sm">Show the music universe card on the homepage.</span>
              </Label>
              <Switch id="showMusicSection" name="showMusicSection" defaultChecked={settings.showMusicSection} />
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Website Background</CardTitle>
            <CardDescription>Upload an image to set as the site-wide background. Saving will apply all settings.</CardDescription>
          </CardHeader>
          <CardContent>
            <Label htmlFor="backgroundImage">Upload New Background Image</Label>
            <Input id="backgroundImage" name="backgroundImage" type="file" accept="image/*" />
            {settings.backgroundImageUrl && (
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">Current background:</p>
                <img src={settings.backgroundImageUrl} alt="Current background" className="mt-2 rounded-md border h-24 w-auto" />
              </div>
            )}
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <SubmitButton text="Save All Settings" />
          </CardFooter>
        </Card>
      </form>

      {/* Form 2: Separate Form for Removing the Background */}
      {settings.backgroundImageUrl && (
        <Card className="mt-6 border-destructive">
          <CardHeader>
            <CardTitle>Remove Background</CardTitle>
            <CardDescription>This will permanently remove the current background image and revert to the default.</CardDescription>
          </CardHeader>
          <form action={removeFormAction}>
            <CardFooter>
              <RemoveBgButton />
            </CardFooter>
          </form>
        </Card>
      )}
    </>
  );
}