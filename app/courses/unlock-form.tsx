// File: app/courses/unlock-form.tsx

"use client"

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface UnlockFormProps {
  correctCode: string;
  children: React.ReactNode; // The content to show when unlocked (the video player)
}

export function UnlockForm({ correctCode, children }: UnlockFormProps) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [inputCode, setInputCode] = useState("");
  const [error, setError] = useState("");

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode.trim().toUpperCase() === correctCode.toUpperCase()) {
      setIsUnlocked(true);
      setError("");
    } else {
      setError("Incorrect code. Please try again.");
    }
  };

  if (isUnlocked) {
    return <>{children}</>;
  }

  return (
    <div className="mt-6 p-6 border-2 border-dashed rounded-lg text-center">
      <h3 className="font-bold text-lg mb-4">This is a premium course</h3>
      <form onSubmit={handleUnlock} className="max-w-sm mx-auto space-y-4">
        <div>
          <Label htmlFor="unlockCode">Enter Unlock Code</Label>
          <Input
            id="unlockCode"
            type="text"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            placeholder="Enter code here"
            className="text-center"
          />
          {error && <p className="text-destructive text-sm mt-2">{error}</p>}
        </div>
        <Button type="submit">Unlock Course</Button>
      </form>
    </div>
  );
}