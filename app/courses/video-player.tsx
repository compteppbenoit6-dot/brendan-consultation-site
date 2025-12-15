// File: app/courses/video-player.tsx

"use client"

export function VideoPlayer({ src }: { src: string }) {
  return (
    <div className="aspect-video w-full bg-black rounded-lg overflow-hidden">
      <video
        controls
        src={src}
        className="w-full h-full"
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
}