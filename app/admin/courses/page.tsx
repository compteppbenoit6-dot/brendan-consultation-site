// File: app/admin/courses/page.tsx

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Loader2, Video } from "lucide-react"
import { AdminActions } from "@/components/admin/admin-actions"
import { CourseForm } from "./course-form"
import { deleteCourse, getCourses } from "./actions"
import type { Course, CourseVideo } from "@prisma/client"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

type CourseWithVideos = Course & { videos: CourseVideo[] };

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<CourseWithVideos[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CourseWithVideos | null>(null);

  const fetchCourses = async () => {
    const result = await getCourses();
    if (result.error) {
      toast.error(result.error);
    } else if (result.courses) {
      setCourses(result.courses as CourseWithVideos[]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleUpdate = () => {
    fetchCourses();
    setIsCreateDialogOpen(false);
    setEditingCourse(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="ml-2">Loading courses...</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Courses Management</h1>
          <p className="text-muted-foreground">Add, edit, or remove free and premium courses.</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild><Button><PlusCircle className="mr-2 h-4 w-4" /> Add New Course</Button></DialogTrigger>
          <DialogContent className="sm:max-w-3xl"><DialogHeader><DialogTitle>Add New Course</DialogTitle></DialogHeader><CourseForm onSuccess={handleUpdate} /></DialogContent>
        </Dialog>
      </div>

      <Dialog open={!!editingCourse} onOpenChange={(isOpen) => !isOpen && setEditingCourse(null)}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader><DialogTitle>Edit Course</DialogTitle></DialogHeader>
          {editingCourse && <CourseForm course={editingCourse} onSuccess={handleUpdate} />}
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader><CardTitle>All Courses</CardTitle><CardDescription>A list of all courses offered on your site.</CardDescription></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Videos</TableHead>
                <TableHead>Price</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">{course.title}</TableCell>
                  <TableCell><Badge variant={course.isPremium ? "default" : "secondary"}>{course.isPremium ? "Premium" : "Free"}</Badge></TableCell>
                  <TableCell className="flex items-center gap-1"><Video className="h-4 w-4 text-muted-foreground" /> {course.videos.length}</TableCell>
                  <TableCell>{course.isPremium ? `$${course.price}` : "N/A"}</TableCell>
                  <TableCell>
                    <AdminActions 
                      itemId={course.id} 
                      deleteAction={deleteCourse} 
                      onEdit={() => setEditingCourse(course)} 
                      onDeleteSuccess={handleUpdate} 
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {courses.length === 0 && (<div className="text-center p-8 text-muted-foreground">No courses found. Click "Add New Course" to get started.</div>)}
        </CardContent>
      </Card>
    </div>
  )
}