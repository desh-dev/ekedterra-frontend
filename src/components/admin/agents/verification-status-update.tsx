"use client";

import { useState } from "react";
import { User } from "@/lib/graphql/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { apolloClient } from "@/lib/apollo/client";
import { UPDATE_USER_VERIFICATION } from "@/lib/graphql/mutations";
import toast from "react-hot-toast";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface VerificationStatusUpdateProps {
  agent: User;
  isVerified: boolean;
  onUpdate: () => void;
}

export default function VerificationStatusUpdate({
  agent,
  isVerified,
  onUpdate,
}: VerificationStatusUpdateProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newVerifiedStatus, setNewVerifiedStatus] = useState(isVerified);

  const handleUpdateVerification = async () => {
    setIsUpdating(true);
    try {
      const agentRole = agent.roles?.find((r) => r.role === "agent");
      if (!agentRole) {
        toast.error("Agent role not found");
        return;
      }

      const { data } = await apolloClient.mutate({
        mutation: UPDATE_USER_VERIFICATION,
        variables: {
          id: agent.userId,
          verified: newVerifiedStatus,
          email: agent.email,
        },
      });

      toast.success(
        `Agent verification ${
          newVerifiedStatus ? "approved" : "rejected"
        } successfully`
      );
      console.log(data);
      setIsDialogOpen(false);
      onUpdate();
    } catch (error: any) {
      console.error("Error updating verification:", error);
      toast.error(error?.message || "Failed to update verification status");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg mb-1">Verification Status</h3>
            <p className="text-sm text-muted-foreground">
              Current status:{" "}
              <span className="font-medium">
                {isVerified ? "Verified" : "Pending"}
              </span>
            </p>
          </div>
          <Button
            onClick={() => {
              setNewVerifiedStatus(!isVerified);
              setIsDialogOpen(true);
            }}
            variant={isVerified ? "destructive" : "default"}
          >
            {isVerified ? (
              <>
                <XCircle className="h-4 w-4 mr-2" />
                Revoke Verification
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Approve Verification
              </>
            )}
          </Button>
        </div>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {newVerifiedStatus ? "Approve" : "Revoke"} Verification
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to{" "}
              {newVerifiedStatus
                ? "approve verification for"
                : "revoke verification from"}{" "}
              <strong>{agent.fullName}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateVerification}
              disabled={isUpdating}
              variant={newVerifiedStatus ? "default" : "destructive"}
            >
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
