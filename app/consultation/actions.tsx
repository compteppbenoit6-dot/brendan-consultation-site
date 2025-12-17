// File: app/consultation/actions.tsx

"use server"

import prisma from "@/lib/prisma"
import { z } from "zod"
import { revalidatePath } from "next/cache"
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const BookingSchema = z.object({
  serviceId: z.string(),
  serviceName: z.string(),
  servicePrice: z.number(),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
  time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: "Invalid time format" }),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().optional(),
  timezone: z.string().default("America/New_York"),
})

export async function getBookedSlots(date: Date) {
  try {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const appointments = await prisma.appointment.findMany({
      where: { dateTime: { gte: startOfDay, lte: endOfDay } },
      select: { dateTime: true },
    });

    const bookedTimes = appointments.map(app => {
      const appointmentDate = new Date(app.dateTime);
      const hours = appointmentDate.getHours().toString().padStart(2, '0');
      const minutes = appointmentDate.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    });

    return bookedTimes;
  } catch (error) {
    console.error("Error fetching booked slots:", error);
    return [];
  }
}

export async function createAppointment(formData: FormData) {
  try {
    const rawData = Object.fromEntries(formData.entries());
    const validatedFields = BookingSchema.safeParse({
      ...rawData,
      servicePrice: Number(rawData.servicePrice)
    });

    if (!validatedFields.success) {
      return {
        error: "Invalid data provided.",
        fieldErrors: validatedFields.error.flatten().fieldErrors,
      }
    }

    const { serviceName, servicePrice, date, time, firstName, lastName, email, message, timezone } = validatedFields.data;

    const [hours, minutes] = time.split(':').map(Number);
    const appointmentDate = new Date(date);
    appointmentDate.setHours(hours, minutes, 0, 0);

    const existingAppointment = await prisma.appointment.findFirst({
      where: { dateTime: appointmentDate },
    });

    if (existingAppointment) {
      return { error: "This time slot has just been booked. Please select another." };
    }

    await prisma.appointment.create({
      data: {
        dateTime: appointmentDate,
        serviceName: serviceName,
        servicePrice: servicePrice,
        clientName: `${firstName} ${lastName}`,
        clientEmail: email,
        clientNotes: message || "",
        clientTimezone: timezone,
      },
    });

    // This is a pre-rendered HTML string. To update the design,
    // run `pnpm email`, edit the component in `emails/AppointmentNotification.tsx`,
    // then copy the HTML from the "Markup" tab in the preview and paste it here.
    const emailTemplate = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html lang="en"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /><link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" /><link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@900&amp;family=Source+Sans+3:wght@400;600&amp;display=swap" rel="stylesheet" /></head><body style="background-color:#f0fdf4;font-family:&quot;Source Sans 3&quot;, &quot;Helvetica Neue&quot;, sans-serif"><table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:37.5em;margin:0 auto;padding:20px 0 48px"><tbody style="width:100%"><tr style="width:100%"><td><table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="margin:0 auto;padding:0;width:580px;max-width:100%;background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.05)"><tbody style="width:100%"><tr style="width:100%"><td><table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="background-color:#059669;padding:24px;text-align:center"><tbody><tr style="width:100%"><td><h1 style="font-family:&#x27;Playfair Display&#x27;, serif;color:#ffffff;margin:0;font-size:36px;font-weight:900;letter-spacing:2px">FIZ</h1></td></tr></tbody></table><table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="padding:32px 40px"><tbody><tr style="width:100%"><td><h2 style="font-family:&#x27;Playfair Display&#x27;, serif;font-size:24px;color:#065f46;margin:0 0 16px">New Spiritual Session</h2><p style="color:#374151;font-size:16px;line-height:26px">You have a new appointment! Here are the details:</p><table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="margin-top:24px;border-top:1px solid #e5e7eb"><tbody><tr style="width:100%"><td style="padding:12px 0;border-bottom:1px solid #e5e7eb"><p style="color:#475569;font-size:16px;line-height:26px">Service:</p></td><td style="padding:12px 0;border-bottom:1px solid #e5e7eb"><p style="color:#374151;font-size:16px;line-height:26px;text-align:right;font-weight:600">__SERVICE_NAME__</p></td></tr><tr style="width:100%"><td style="padding:12px 0;border-bottom:1px solid #e5e7eb"><p style="color:#475569;font-size:16px;line-height:26px">Price:</p></td><td style="padding:12px 0;border-bottom:1px solid #e5e7eb"><p style="color:#374151;font-size:16px;line-height:26px;text-align:right;font-weight:600">$__SERVICE_PRICE__</p></td></tr><tr style="width:100%"><td style="padding:12px 0;border-bottom:1px solid #e5e7eb"><p style="color:#475569;font-size:16px;line-height:26px">Date &amp; Time:</p></td><td style="padding:12px 0;border-bottom:1px solid #e5e7eb"><p style="color:#374151;font-size:16px;line-height:26px;text-align:right;font-weight:600">__APPOINTMENT_DATE__</p></td></tr></tbody></table><hr style="width:100%;border:none;border-top:1px solid #e5e7eb;margin:20px 0" /><table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation"><tbody><tr style="width:100%"><td style="padding:12px 0;border-bottom:1px solid #e5e7eb"><p style="color:#475569;font-size:16px;line-height:26px">Client:</p></td><td style="padding:12px 0;border-bottom:1px solid #e5e7eb"><p style="color:#374151;font-size:16px;line-height:26px;text-align:right">__CLIENT_NAME__</p></td></tr><tr style="width:100%"><td style="padding:12px 0;border-bottom:1px solid #e5e7eb"><p style="color:#475569;font-size:16px;line-height:26px">Email:</p></td><td style="padding:12px 0;border-bottom:1px solid #e5e7eb"><p style="color:#374151;font-size:16px;line-height:26px;text-align:right">__CLIENT_EMAIL__</p></td></tr>__CLIENT_NOTES_ROW__</tbody></table><hr style="width:100%;border:none;border-top:1px solid #e5e7eb;margin:30px 0" /><table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="text-align:center;margin-top:32px"><tbody><tr style="width:100%"><td><a href="https://www.fiz.guru/admin/appointments" target="_blank" style="background-color:#10b981;border-radius:5px;color:#fff;font-size:16px;font-weight:bold;text-decoration:none;text-align:center;display:block;width:100%;padding:14px">View in Admin Panel</a></td></tr></tbody></table></td></tr></tbody></table><table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="padding:20px;text-align:center;font-size:12px;color:#475569;background-color:#f1f5f9"><tbody><tr style="width:100%"><td><p style="margin:0">This is an automated notification from fiz.guru</p></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></body></html>`;

    // Format date in both server timezone (Eastern) and client's timezone
    const serverTimeStr = appointmentDate.toLocaleString('en-US', { 
      dateStyle: 'full', 
      timeStyle: 'short',
      timeZone: 'America/New_York'
    });
    const clientTimeStr = appointmentDate.toLocaleString('en-US', { 
      dateStyle: 'full', 
      timeStyle: 'short',
      timeZone: timezone
    });
    
    const dateDisplay = timezone === 'America/New_York' 
      ? `${serverTimeStr} (Eastern Time)`
      : `${serverTimeStr} (Eastern) / ${clientTimeStr} (${timezone})`;

    // Replace placeholders with actual data
    let emailHtml = emailTemplate
      .replace('__SERVICE_NAME__', serviceName)
      .replace('__SERVICE_PRICE__', String(servicePrice))
      .replace('__APPOINTMENT_DATE__', dateDisplay)
      .replace('__CLIENT_NAME__', `${firstName} ${lastName}`)
      .replace('__CLIENT_EMAIL__', email);

    if (message) {
      const notesRow = `<tr style="padding:12px 0;border-bottom:1px solid #e5e7eb"><td style="color:#475569;font-size:16px;line-height:26px;vertical-align:top">Notes:</td><td style="color:#374151;font-size:16px;line-height:26px;text-align:right">${message}</td></tr>`;
      emailHtml = emailHtml.replace('__CLIENT_NOTES_ROW__', notesRow);
    } else {
      emailHtml = emailHtml.replace('__CLIENT_NOTES_ROW__', '');
    }

    try {
      await resend.emails.send({
        from: 'Fiz Website <noreply@fiz.guru>',
        to: 'brendan89890@yahoo.com',
        subject: `New Spiritual Session Booking: ${serviceName}`,
        html: emailHtml,
      });
    } catch (emailError) {
      console.error("Failed to send email notification:", emailError);
    }

    revalidatePath("/consultation");
    revalidatePath("/admin/appointments");
    
    return { success: "Appointment booked successfully!" };

  } catch (error) {
    console.error("Booking error:", error);
    return { error: "Could not create appointment. Please try again." };
  }
}