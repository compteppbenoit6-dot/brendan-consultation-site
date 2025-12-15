// File: app/courses/course-client-page.tsx

"use client"; // This is now the ONLY thing in this file that makes it a client component

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, GraduationCap, Info, PlayCircle, Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { VideoPlayer } from "./video-player";
import { UnlockForm } from "./unlock-form";
import type { Course, CourseVideo } from "@prisma/client";

// The entire component is now cleanly defined in a client-only file
export function CourseClientPage({ course }: { course: Course & { videos: CourseVideo[] } }) {
  const [selectedVideo, setSelectedVideo] = useState<CourseVideo | null>(course.videos[0] || null);

  const CourseContent = () => (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        {selectedVideo ? (
          <VideoPlayer src={selectedVideo.videoSrc} />
        ) : (
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
            <p>Select a video to play</p>
          </div>
        )}
      </div>
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle className="text-lg">Course Playlist</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {course.videos.map((video) => (
              <li key={video.id}>
                <button
                  onClick={() => setSelectedVideo(video)}
                  className={`w-full text-left p-2 rounded-md flex items-center gap-3 text-sm transition-colors ${
                    selectedVideo?.id === video.id ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-muted'
                  }`}
                >
                  {selectedVideo?.id === video.id ? <PlayCircle className="h-4 w-4" /> : <Video className="h-4 w-4 text-muted-foreground" />}
                  <span>{video.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-background/80 backdrop-blur-sm py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" asChild className="mb-8 text-accent hover:text-accent-foreground hover:bg-accent/10">
          <Link href="/courses"><ArrowLeft className="h-4 w-4 mr-2" /> Back to All Courses</Link>
        </Button>

        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="h-8 w-8 text-primary" />
            </div>
            <Badge variant={course.isPremium ? "default" : "secondary"} className="mx-auto">
              {course.isPremium ? `Premium - $${course.price}` : "Free"}
            </Badge>
            <CardTitle className="font-serif text-4xl pt-4">{course.title}</CardTitle>
            <CardDescription className="text-lg">{course.description}</CardDescription>
          </CardHeader>
          <CardContent>
            {course.isPremium ? (
              <UnlockForm correctCode={course.unlockCode || ""}>
                <CourseContent />
              </UnlockForm>
            ) : (
              <CourseContent />
            )}

            {course.isPremium && (
              <Card className="mt-8 bg-muted/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Info className="h-5 w-5" /> How to Unlock</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>To get the unlock code for this course, please send a payment of <strong>${course.price}</strong> via one of the methods below.</p>
                  <p>After payment, you will be manually sent the unlock code to your email.</p>
                  <div className="flex gap-4 pt-4">
                    <Button asChild><a href="https://paypal.me/brendanfinizio" target="_blank" rel="noopener noreferrer">Pay with PayPal</a></Button>
                    <Button asChild variant="secondary"><a href="https://cash.app/$Snapcracklefizzle" target="_blank" rel="noopener noreferrer">Pay with Cash App</a></Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}