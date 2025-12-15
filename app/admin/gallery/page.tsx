// File: app/admin/gallery/page.tsx

"use client"

import { useState, useEffect, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Loader2, Trash2 } from "lucide-react"
import { AdminActions } from "@/components/admin/admin-actions"
import { ImageForm } from "./image-form"
import { MultiImageForm } from "./multi-image-form"
import { deleteImage, getImages, deleteMultipleImages } from "./actions"
import type { Image } from "@prisma/client"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

export default function AdminGalleryPage() {
  const [images, setImages] = useState<Image[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<Image | null>(null);
  const [selectedImageIds, setSelectedImageIds] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  const fetchImages = async () => {
    const result = await getImages();
    if (result.error) {
      toast.error(result.error);
    } else if (result.images) {
      setImages(result.images);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleUpdate = () => {
    fetchImages();
    setIsCreateDialogOpen(false);
    setEditingImage(null);
    setSelectedImageIds([]);
  };

  const handleSelectImage = (id: string, checked: boolean) => {
    setSelectedImageIds(prev => 
      checked ? [...prev, id] : prev.filter(imageId => imageId !== id)
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedImageIds(checked ? images.map(img => img.id) : []);
  };

  const handleBulkDelete = () => {
    startTransition(async () => {
      const result = await deleteMultipleImages(selectedImageIds);
      if (result.success) {
        toast.success(result.success);
        handleUpdate();
      } else if (result.error) {
        toast.error(result.error);
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="ml-2">Loading images...</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Gallery Management</h1>
          <p className="text-muted-foreground">Add, edit, or remove gallery images.</p>
        </div>
        <div className="flex items-center gap-2">
          {selectedImageIds.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={isPending}>
                  <Trash2 className="mr-2 h-4 w-4" /> Delete ({selectedImageIds.length})
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete {selectedImageIds.length} image(s). This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleBulkDelete} className="bg-destructive hover:bg-destructive/90">
                    Yes, delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button><PlusCircle className="mr-2 h-4 w-4" /> Add New Image(s)</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl"><DialogHeader><DialogTitle>Add New Images</DialogTitle></DialogHeader><MultiImageForm onSuccess={handleUpdate} /></DialogContent>
          </Dialog>
        </div>
      </div>

      <Dialog open={!!editingImage} onOpenChange={(isOpen) => !isOpen && setEditingImage(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Image</DialogTitle></DialogHeader>
          {editingImage && <ImageForm image={editingImage} onSuccess={handleUpdate} />}
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader><CardTitle>All Images</CardTitle><CardDescription>A list of all images currently in your gallery.</CardDescription></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox onCheckedChange={handleSelectAll} checked={selectedImageIds.length === images.length && images.length > 0} />
                </TableHead>
                <TableHead className="hidden w-[100px] sm:table-cell">Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="hidden md:table-cell">Created at</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {images.map((image) => (
                <TableRow key={image.id} data-state={selectedImageIds.includes(image.id) && "selected"}>
                  <TableCell><Checkbox onCheckedChange={(checked) => handleSelectImage(image.id, !!checked)} checked={selectedImageIds.includes(image.id)} /></TableCell>
                  <TableCell className="hidden sm:table-cell"><img alt={image.alt} className="aspect-square rounded-md object-cover" height="64" src={image.src} width="64" /></TableCell>
                  <TableCell className="font-medium">{image.title}</TableCell>
                  <TableCell><Badge variant="outline">{image.category}</Badge></TableCell>
                  <TableCell className="hidden md:table-cell">{new Date(image.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <AdminActions 
                      itemId={image.id} 
                      deleteAction={deleteImage} 
                      onEdit={() => setEditingImage(image)} 
                      onDeleteSuccess={handleUpdate} 
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {images.length === 0 && (<div className="text-center p-8 text-muted-foreground">No images found. Click "Add New Image(s)" to get started.</div>)}
        </CardContent>
      </Card>
    </div>
  )
}