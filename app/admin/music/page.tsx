// File: app/admin/music/page.tsx

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Loader2 } from "lucide-react"
import { AdminActions } from "@/components/admin/admin-actions"
import { MusicForm } from "./music-form"
import { MultiMusicForm } from "./multi-music-form"
import { deleteMusicTrack, getTracks } from "./actions"
import type { MusicTrack } from "@prisma/client"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function AdminMusicPage() {
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingTrack, setEditingTrack] = useState<MusicTrack | null>(null);

  const fetchTracks = async () => {
    const result = await getTracks();
    if (result.error) {
      toast.error(result.error);
    } else if (result.tracks) {
      setTracks(result.tracks);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTracks();
  }, []);

  const handleUpdate = () => {
    fetchTracks();
    setIsCreateDialogOpen(false);
    setEditingTrack(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="ml-2">Loading tracks...</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Music Management</h1>
          <p className="text-muted-foreground">Upload, edit, or remove music tracks.</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild><Button><PlusCircle className="mr-2 h-4 w-4" /> Add New Track(s)</Button></DialogTrigger>
          <DialogContent className="sm:max-w-3xl"><DialogHeader><DialogTitle>Add New Music Tracks</DialogTitle></DialogHeader><MultiMusicForm onSuccess={handleUpdate} /></DialogContent>
        </Dialog>
      </div>

      <Dialog open={!!editingTrack} onOpenChange={(isOpen) => !isOpen && setEditingTrack(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Track</DialogTitle></DialogHeader>
          {editingTrack && <MusicForm track={editingTrack} onSuccess={handleUpdate} />}
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader><CardTitle>All Tracks</CardTitle><CardDescription>A list of all your beats, freestyles, and tracks.</CardDescription></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead className="hidden md:table-cell">Uploaded at</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tracks.map((track) => (
                <TableRow key={track.id}>
                  <TableCell className="font-medium">{track.title}</TableCell>
                  <TableCell><Badge variant="secondary">{track.type}</Badge></TableCell>
                  <TableCell>{track.duration}</TableCell>
                  <TableCell className="hidden md:table-cell">{new Date(track.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <AdminActions 
                      itemId={track.id} 
                      deleteAction={deleteMusicTrack} 
                      onEdit={() => setEditingTrack(track)} 
                      onDeleteSuccess={handleUpdate} 
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {tracks.length === 0 && (<div className="text-center p-8 text-muted-foreground">No tracks found. Click "Add New Track(s)" to get started.</div>)}
        </CardContent>
      </Card>
    </div>
  )
}