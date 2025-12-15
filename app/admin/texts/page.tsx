// File: app/admin/texts/page.tsx

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Loader2 } from "lucide-react"
import { AdminActions } from "@/components/admin/admin-actions"
import { TextForm } from "./text-form"
import { deleteTextPost, getPosts } from "./actions"
import type { TextPost } from "@prisma/client"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function AdminTextsPage() {
  const [posts, setPosts] = useState<TextPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<TextPost | null>(null);

  const fetchPosts = async () => {
    const result = await getPosts();
    if (result.error) {
      toast.error(result.error);
    } else if (result.posts) {
      setPosts(result.posts);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleUpdate = () => {
    fetchPosts();
    setIsCreateDialogOpen(false);
    setEditingPost(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="ml-2">Loading posts...</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Text Posts Management</h1>
          <p className="text-muted-foreground">Create, edit, or remove text posts.</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild><Button><PlusCircle className="mr-2 h-4 w-4" /> Add New Post</Button></DialogTrigger>
          <DialogContent className="sm:max-w-2xl"><DialogHeader><DialogTitle>Add New Post</DialogTitle></DialogHeader><TextForm onSuccess={handleUpdate} /></DialogContent>
        </Dialog>
      </div>

      <Dialog open={!!editingPost} onOpenChange={(isOpen) => !isOpen && setEditingPost(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader><DialogTitle>Edit Post</DialogTitle></DialogHeader>
          {editingPost && <TextForm post={editingPost} onSuccess={handleUpdate} />}
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader><CardTitle>All Posts</CardTitle><CardDescription>A list of all your text posts.</CardDescription></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="hidden md:table-cell">Published at</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell><Badge variant="outline">{post.category}</Badge></TableCell>
                  <TableCell className="hidden md:table-cell">{new Date(post.publishedAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <AdminActions 
                      itemId={post.id} 
                      deleteAction={deleteTextPost} 
                      onEdit={() => setEditingPost(post)} 
                      onDeleteSuccess={handleUpdate} 
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {posts.length === 0 && (<div className="text-center p-8 text-muted-foreground">No posts found. Click "Add New Post" to get started.</div>)}
        </CardContent>
      </Card>
    </div>
  )
}