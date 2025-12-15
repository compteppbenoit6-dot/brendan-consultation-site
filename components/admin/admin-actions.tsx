// File: components/admin/admin-actions.tsx

"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash } from "lucide-react"
import { DeleteButton } from "@/components/admin/delete-button"

interface AdminActionsProps {
  onEdit?: () => void; // --- MODIFICATION: Made onEdit optional ---
  deleteAction: (id: string) => Promise<{ success?: string; error?: string }>;
  itemId: string;
  onDeleteSuccess?: () => void;
}

export function AdminActions({ onEdit, deleteAction, itemId, onDeleteSuccess }: AdminActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button aria-haspopup="true" size="icon" variant="ghost">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        
        {/* --- MODIFICATION: Conditionally render the Edit button --- */}
        {onEdit && (
          <DropdownMenuItem onSelect={onEdit} className="cursor-pointer">
            <Edit className="mr-2 h-4 w-4" /> Edit
          </DropdownMenuItem>
        )}

        <DeleteButton id={itemId} deleteAction={deleteAction} onSuccess={onDeleteSuccess}>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive w-full cursor-pointer">
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DeleteButton>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}