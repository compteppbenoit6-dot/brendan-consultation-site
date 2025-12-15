// File: app/admin/services/page.tsx

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Loader2, CheckCircle, XCircle } from "lucide-react"
import { AdminActions } from "@/components/admin/admin-actions"
import { ServiceForm } from "./service-form"
import { deleteService, getServices } from "./actions"
import type { Service } from "@prisma/client"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const fetchServices = async () => {
    const result = await getServices();
    if (result.error) {
      toast.error(result.error);
    } else if (result.services) {
      setServices(result.services);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleUpdate = () => {
    fetchServices();
    setIsCreateDialogOpen(false);
    setEditingService(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="ml-2">Loading services...</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Services Management</h1>
          <p className="text-muted-foreground">Add, edit, or remove consultation services.</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild><Button><PlusCircle className="mr-2 h-4 w-4" /> Add New Service</Button></DialogTrigger>
          <DialogContent><DialogHeader><DialogTitle>Add New Service</DialogTitle></DialogHeader><ServiceForm onSuccess={handleUpdate} /></DialogContent>
        </Dialog>
      </div>

      <Dialog open={!!editingService} onOpenChange={(isOpen) => !isOpen && setEditingService(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Service</DialogTitle></DialogHeader>
          {/* --- MODIFICATION: Conditionally render the form to ensure clean unmounting --- */}
          {editingService && <ServiceForm service={editingService} onSuccess={handleUpdate} />}
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader><CardTitle>All Services</CardTitle><CardDescription>A list of all consultation services offered.</CardDescription></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Active</TableHead>
                <TableHead>Popular</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium">{service.name}</TableCell>
                  <TableCell>${service.price}</TableCell>
                  <TableCell>{service.duration}</TableCell>
                  <TableCell>{service.active ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-destructive" />}</TableCell>
                  <TableCell>{service.popular && <Badge variant="secondary">Popular</Badge>}</TableCell>
                  <TableCell><AdminActions itemId={service.id} deleteAction={deleteService} onEdit={() => setEditingService(service)} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {services.length === 0 && (<div className="text-center p-8 text-muted-foreground">No services found. Click "Add New Service" to get started.</div>)}
        </CardContent>
      </Card>
    </div>
  )
}