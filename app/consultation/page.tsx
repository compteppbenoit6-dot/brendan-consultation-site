// File: app/consultation/page.tsx

"use client"

import { useState, useTransition, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Heart, Clock, CheckCircle, Star, Shield, Zap, Copy, Calendar, User, Loader2, Globe } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { getBookedSlots, createAppointment } from "./actions"
import { format } from "date-fns"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import type { Service } from "@prisma/client"

// Helper to map icon names to components
const iconMap: { [key: string]: React.ElementType } = {
  Heart,
  Zap,
  Shield,
  Star,
};

const timeSlots = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

// New component to fetch and render services
function ServiceSelector({ onServiceSelect }: { onServiceSelect: (service: Service) => void }) {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetch('/api/services');
        if (!res.ok) throw new Error('Failed to fetch services');
        const data = await res.json();
        setServices(data.services);
      } catch (error) {
        toast.error("Could not load services.");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchServices();
  }, []);

  const handleSelect = (service: Service) => {
    setSelectedService(service);
    onServiceSelect(service);
  }

  if (isLoading) {
    return <div className="text-center p-8"><Loader2 className="h-8 w-8 animate-spin mx-auto" /></div>
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {services.map((service) => {
        const Icon = iconMap[service.icon] || Heart;
        return (
          <Card 
            key={service.id} 
            onClick={() => handleSelect(service)} 
            className={cn(
              "cursor-pointer transition-all hover:shadow-lg",
              selectedService?.id === service.id 
                ? "border-2 border-secondary bg-secondary/5" 
                : "hover:border-secondary/50"
            )}
          >
            <CardContent className="p-4 text-center space-y-3">
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto">
                <Icon className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-bold text-sm">{service.name}</h3>
                <p className="text-xs text-muted-foreground">{service.description}</p>
              </div>
              <div className="space-y-1">
                <div className="text-lg font-bold text-secondary">${service.price}</div>
                <div className="text-xs text-muted-foreground">{service.duration}</div>
                {service.popular && <Badge className="text-xs">Popular</Badge>}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}


// Common timezones grouped by region
const TIMEZONES = [
  { group: "North America", zones: [
    { value: "America/New_York", label: "Eastern Time (ET)" },
    { value: "America/Chicago", label: "Central Time (CT)" },
    { value: "America/Denver", label: "Mountain Time (MT)" },
    { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
    { value: "America/Anchorage", label: "Alaska Time (AKT)" },
    { value: "Pacific/Honolulu", label: "Hawaii Time (HT)" },
    { value: "America/Toronto", label: "Toronto (ET)" },
    { value: "America/Vancouver", label: "Vancouver (PT)" },
    { value: "America/Mexico_City", label: "Mexico City (CST)" },
  ]},
  { group: "Europe", zones: [
    { value: "Europe/London", label: "London (GMT/BST)" },
    { value: "Europe/Paris", label: "Paris (CET)" },
    { value: "Europe/Berlin", label: "Berlin (CET)" },
    { value: "Europe/Madrid", label: "Madrid (CET)" },
    { value: "Europe/Rome", label: "Rome (CET)" },
    { value: "Europe/Amsterdam", label: "Amsterdam (CET)" },
    { value: "Europe/Brussels", label: "Brussels (CET)" },
    { value: "Europe/Zurich", label: "Zurich (CET)" },
    { value: "Europe/Vienna", label: "Vienna (CET)" },
    { value: "Europe/Stockholm", label: "Stockholm (CET)" },
    { value: "Europe/Oslo", label: "Oslo (CET)" },
    { value: "Europe/Copenhagen", label: "Copenhagen (CET)" },
    { value: "Europe/Helsinki", label: "Helsinki (EET)" },
    { value: "Europe/Warsaw", label: "Warsaw (CET)" },
    { value: "Europe/Prague", label: "Prague (CET)" },
    { value: "Europe/Budapest", label: "Budapest (CET)" },
    { value: "Europe/Athens", label: "Athens (EET)" },
    { value: "Europe/Moscow", label: "Moscow (MSK)" },
    { value: "Europe/Istanbul", label: "Istanbul (TRT)" },
  ]},
  { group: "Asia", zones: [
    { value: "Asia/Dubai", label: "Dubai (GST)" },
    { value: "Asia/Kolkata", label: "India (IST)" },
    { value: "Asia/Bangkok", label: "Bangkok (ICT)" },
    { value: "Asia/Singapore", label: "Singapore (SGT)" },
    { value: "Asia/Hong_Kong", label: "Hong Kong (HKT)" },
    { value: "Asia/Shanghai", label: "Shanghai (CST)" },
    { value: "Asia/Tokyo", label: "Tokyo (JST)" },
    { value: "Asia/Seoul", label: "Seoul (KST)" },
    { value: "Asia/Manila", label: "Manila (PHT)" },
    { value: "Asia/Jakarta", label: "Jakarta (WIB)" },
    { value: "Asia/Karachi", label: "Karachi (PKT)" },
    { value: "Asia/Tehran", label: "Tehran (IRST)" },
    { value: "Asia/Jerusalem", label: "Jerusalem (IST)" },
    { value: "Asia/Riyadh", label: "Riyadh (AST)" },
  ]},
  { group: "Oceania", zones: [
    { value: "Australia/Sydney", label: "Sydney (AEST)" },
    { value: "Australia/Melbourne", label: "Melbourne (AEST)" },
    { value: "Australia/Brisbane", label: "Brisbane (AEST)" },
    { value: "Australia/Perth", label: "Perth (AWST)" },
    { value: "Australia/Adelaide", label: "Adelaide (ACST)" },
    { value: "Pacific/Auckland", label: "Auckland (NZST)" },
    { value: "Pacific/Fiji", label: "Fiji (FJT)" },
  ]},
  { group: "South America", zones: [
    { value: "America/Sao_Paulo", label: "São Paulo (BRT)" },
    { value: "America/Buenos_Aires", label: "Buenos Aires (ART)" },
    { value: "America/Santiago", label: "Santiago (CLT)" },
    { value: "America/Lima", label: "Lima (PET)" },
    { value: "America/Bogota", label: "Bogotá (COT)" },
    { value: "America/Caracas", label: "Caracas (VET)" },
  ]},
  { group: "Africa", zones: [
    { value: "Africa/Cairo", label: "Cairo (EET)" },
    { value: "Africa/Johannesburg", label: "Johannesburg (SAST)" },
    { value: "Africa/Lagos", label: "Lagos (WAT)" },
    { value: "Africa/Nairobi", label: "Nairobi (EAT)" },
    { value: "Africa/Casablanca", label: "Casablanca (WET)" },
  ]},
];

export default function ConsultationPage() {
  const [step, setStep] = useState(1)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  // Initialize with today's date
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return today
  })
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [selectedTimezone, setSelectedTimezone] = useState<string>("America/New_York")
  const [bookedSlots, setBookedSlots] = useState<string[]>([])
  const [isPending, startTransition] = useTransition()
  const [isLoadingSlots, setIsLoadingSlots] = useState(false)

  // Try to detect user's timezone on mount
  useEffect(() => {
    try {
      const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      // Check if it's in our list
      const found = TIMEZONES.some(group => 
        group.zones.some(z => z.value === userTimezone)
      );
      if (found) {
        setSelectedTimezone(userTimezone);
      }
    } catch (e) {
      // Keep default
    }
  }, []);

  useEffect(() => {
    if (selectedDate) {
      setIsLoadingSlots(true);
      setSelectedTime(null);
      
      const fetchSlots = async () => {
        try {
          const slots = await getBookedSlots(selectedDate);
          setBookedSlots(slots);
        } catch (error) {
          toast.error("Failed to load available times");
        } finally {
          setIsLoadingSlots(false);
        }
      };
      
      fetchSlots();
    } else {
      setBookedSlots([]);
      setSelectedTime(null);
      setIsLoadingSlots(false);
    }
  }, [selectedDate]);

  const handleFormSubmit = async (formEvent: React.FormEvent<HTMLFormElement>) => {
    formEvent.preventDefault();
    if (!selectedService || !selectedDate || !selectedTime) {
      toast.error("Please complete all steps.");
      return;
    }
    const currentFormData = new FormData(formEvent.currentTarget);
    currentFormData.append("serviceId", selectedService.id);
    currentFormData.append("serviceName", selectedService.name);
    currentFormData.append("servicePrice", selectedService.price.toString());
    currentFormData.append("date", selectedDate.toISOString().split('T')[0]);
    currentFormData.append("time", selectedTime);
    currentFormData.append("timezone", selectedTimezone);

    startTransition(async () => {
      const result = await createAppointment(currentFormData);
      if (result.error) {
        toast.error(result.error);
      } else if (result.success) {
        toast.success(result.success);
        setStep(4);
      }
    });
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background/80 to-muted/20 p-4 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" asChild><Link href="/"><ArrowLeft className="h-4 w-4 mr-2" />Home</Link></Button>
          <div className="text-center">
            <h1 className="font-serif font-black text-3xl text-foreground flex items-center justify-center"><Heart className="h-8 w-8 mr-3 text-secondary" />Spiritual Sessions</h1>
            <p className="text-muted-foreground">One-on-one guidance with Fiz</p>
          </div>
          <div className="w-20" />
        </div>

        {step < 4 && (
          <div className="flex items-center justify-center space-x-4 mb-8">
            {[{ number: 1, label: "Service" }, { number: 2, label: "Time" }, { number: 3, label: "Details" }].map(({ number, label }, index) => (
              <div key={number} className="flex items-center">
                <div className="flex items-center space-x-2">
                  <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium", step >= number ? "bg-secondary text-secondary-foreground" : "bg-muted text-muted-foreground")}>
                    {step > number ? <CheckCircle className="h-4 w-4" /> : number}
                  </div>
                  <span className="text-sm font-medium">{label}</span>
                </div>
                {index < 2 && <div className={cn("w-12 h-1 mx-3", step > number ? "bg-secondary" : "bg-muted")} />}
              </div>
            ))}
          </div>
        )}

        <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border">
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="font-serif font-bold text-2xl text-center">Choose Your Session</h2>
              <ServiceSelector onServiceSelect={(service) => setSelectedService(service)} />
              <div className="flex justify-center">
                <Button onClick={() => setStep(2)} disabled={!selectedService}>Continue to Time Selection</Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="font-serif font-bold text-2xl text-center">Select Date & Time</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-4">
                  <h3 className="font-semibold mb-4 text-center">Choose Date</h3>
                  <div className="flex justify-center">
                    <CalendarComponent mode="single" selected={selectedDate} onSelect={setSelectedDate} disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))} />
                  </div>
                </Card>
                <Card className="p-4">
                  <h3 className="font-semibold mb-4 text-center">Available Times</h3>
                  <div className="text-sm text-center text-muted-foreground mb-3">{selectedDate ? format(selectedDate, "MMM do, yyyy") : "Select a date first"}</div>
                  {isLoadingSlots && selectedDate ? (
                    <div className="flex items-center justify-center py-8"><Loader2 className="h-6 w-6 animate-spin" /><span className="ml-2 text-sm text-muted-foreground">Loading...</span></div>
                  ) : selectedDate ? (
                    <div className="grid grid-cols-3 gap-2">
                      {timeSlots.map((time) => {
                        const isBooked = bookedSlots.includes(time);
                        return <Button key={time} size="sm" variant={selectedTime === time ? "default" : "outline"} onClick={() => setSelectedTime(time)} disabled={isBooked} className={cn("h-8 text-xs", isBooked && "opacity-50", selectedTime === time && "bg-secondary hover:bg-secondary/90")}>{time}</Button>
                      })}
                    </div>
                  ) : <div className="text-center text-sm text-muted-foreground py-8">Please select a date</div>}
                </Card>
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                <Button onClick={() => setStep(3)} disabled={!selectedDate || !selectedTime}>Continue to Details</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="font-serif font-bold text-2xl text-center">Complete Booking</h2>
              <form onSubmit={handleFormSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-4">
                  <h3 className="font-semibold mb-4">Booking Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span>Session:</span><span className="font-medium">{selectedService?.name}</span></div>
                    <div className="flex justify-between"><span>Date:</span><span className="font-medium">{selectedDate ? format(selectedDate, "MMM do, yyyy") : ""}</span></div>
                    <div className="flex justify-between"><span>Time:</span><span className="font-medium">{selectedTime}</span></div>
                    <div className="flex justify-between"><span>Timezone:</span><span className="font-medium text-xs">{TIMEZONES.flatMap(g => g.zones).find(z => z.value === selectedTimezone)?.label || selectedTimezone}</span></div>
                    <div className="flex justify-between text-lg font-bold pt-2 border-t"><span>Total:</span><span className="text-secondary">${selectedService?.price}</span></div>
                  </div>
                </Card>
                <Card className="p-4">
                  <h3 className="font-semibold mb-4">Your Information</h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div><Label htmlFor="firstName" className="text-xs">First Name</Label><Input id="firstName" name="firstName" required className="h-8 text-sm" /></div>
                      <div><Label htmlFor="lastName" className="text-xs">Last Name</Label><Input id="lastName" name="lastName" required className="h-8 text-sm" /></div>
                    </div>
                    <div><Label htmlFor="email" className="text-xs">Email</Label><Input id="email" name="email" type="email" required className="h-8 text-sm" /></div>
                    <div>
                      <Label className="text-xs flex items-center gap-1"><Globe className="h-3 w-3" />Your Timezone</Label>
                      <Select value={selectedTimezone} onValueChange={setSelectedTimezone}>
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                          {TIMEZONES.map((group) => (
                            <div key={group.group}>
                              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground bg-muted/50">{group.group}</div>
                              {group.zones.map((tz) => (
                                <SelectItem key={tz.value} value={tz.value} className="text-sm">
                                  {tz.label}
                                </SelectItem>
                              ))}
                            </div>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div><Label htmlFor="message" className="text-xs">Notes (optional)</Label><Textarea id="message" name="message" className="h-16 text-sm resize-none" placeholder="Anything you'd like to share?" /></div>
                  </div>
                </Card>
                <div className="lg:col-span-2 flex justify-between">
                  <Button variant="outline" onClick={() => setStep(2)} type="button">Back</Button>
                  <Button type="submit" disabled={isPending}>{isPending ? "Booking..." : "Book Session"}</Button>
                </div>
              </form>
            </div>
          )}

          {step === 4 && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-8 w-8 text-secondary" />
              </div>
              <div>
                <h2 className="font-serif font-bold text-2xl text-foreground mb-2">Session Booked!</h2>
                <p className="text-muted-foreground">
                  Complete payment of <strong>${selectedService?.price}</strong> to confirm your appointment.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                <a href="https://paypal.me/brendanfinizio" target="_blank" rel="noopener noreferrer">
                  <Card className="p-4 bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-bold">PayPal</h4>
                        <p className="text-xs text-muted-foreground">paypal.me/brendanfinizio</p>
                      </div>
                      <Button size="sm" variant="ghost" onClick={(e) => { e.preventDefault(); copyToClipboard('https://paypal.me/brendanfinizio', 'PayPal link')}}>
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </Card>
                </a>
                
                <a href="https://cash.app/$Snapcracklefizzle" target="_blank" rel="noopener noreferrer">
                  <Card className="p-4 bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-800 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-bold">Cash App</h4>
                        <p className="text-xs text-muted-foreground">$Snapcracklefizzle</p>
                      </div>
                      <Button size="sm" variant="ghost" onClick={(e) => { e.preventDefault(); copyToClipboard('$Snapcracklefizzle', 'Cash App')}}>
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </Card>
                </a>
              </div>

              <Button size="lg" asChild>
                <Link href="/">Return Home</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}