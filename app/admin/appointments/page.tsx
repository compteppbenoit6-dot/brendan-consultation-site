// File: app/admin/appointments/page.tsx

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"
import { getAppointments, deleteAppointment } from "./actions"
import type { Appointment } from "@prisma/client"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { AdminActions } from "@/components/admin/admin-actions"

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAppointments = async () => {
    const result = await getAppointments();
    if (result.error) {
      toast.error(result.error);
    } else if (result.appointments) {
      setAppointments(result.appointments);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="ml-2">Loading appointments...</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Appointments</h1>
          <p className="text-muted-foreground">View all booked spiritual sessions.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Booked Sessions</CardTitle>
          <CardDescription>A list of all upcoming and past appointments.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Time</TableHead>
                <TableHead>Client Name</TableHead>
                <TableHead>Client Email</TableHead>
                <TableHead className="hidden md:table-cell">Service</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appt) => (
                <TableRow key={appt.id}>
                  <TableCell className="font-medium">
                    {format(new Date(appt.dateTime), "PPP 'at' h:mm a")}
                  </TableCell>
                  <TableCell>{appt.clientName}</TableCell>
                  <TableCell>{appt.clientEmail}</TableCell>
                  <TableCell className="hidden md:table-cell">{appt.serviceName}</TableCell>
                  <TableCell className="text-right">${appt.servicePrice}</TableCell>
                  <TableCell>
                    <AdminActions 
                      itemId={appt.id}
                      deleteAction={deleteAppointment}
                      onDeleteSuccess={fetchAppointments}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {appointments.length === 0 && (
            <div className="text-center p-8 text-muted-foreground">
              No appointments have been booked yet.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}