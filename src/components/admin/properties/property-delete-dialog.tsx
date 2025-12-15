"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Property } from "@/lib/graphql/types";
import { apolloClient } from "@/lib/apollo/client";
import { DELETE_PROPERTY } from "@/lib/graphql/mutations";
import toast from "react-hot-toast";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface PropertyDeleteDialogProps {
  property: Property;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function PropertyDeleteDialog({
  property,
  open,
  onOpenChange,
  onSuccess,
}: PropertyDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await apolloClient.mutate({
        mutation: DELETE_PROPERTY,
        variables: {
          id: property.id,
        },
      });

      toast.success("Property deleted successfully");
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error deleting property:", error);
      toast.error(error?.message || "Failed to delete property");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Property</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the property &quot;{property.title}
            &quot;? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
