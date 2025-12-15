"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User } from "@/lib/graphql/types";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import VerificationStatusUpdate from "./verification-status-update";
import { CheckCircle2, XCircle } from "lucide-react";

interface AgentDetailModalProps {
  agent: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

export default function AgentDetailModal({
  agent,
  open,
  onOpenChange,
  onUpdate,
}: AgentDetailModalProps) {
  const agentRole = agent.roles?.find((r) => r.role === "agent");
  const isVerified = agentRole?.verified || false;
  const verificationDocs = agent.verificationDocs;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Agent Details: {agent.fullName}
            <Badge variant={isVerified ? "default" : "secondary"}>
              {isVerified ? "Verified" : "Pending Verification"}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Agent Information */}
          <Card className="p-4">
            <h3 className="font-semibold text-lg mb-4">Agent Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Full Name</p>
                <p className="font-medium">{agent.fullName}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Email</p>
                <p className="font-medium">{agent.email}</p>
              </div>
              {agent.phone && (
                <div>
                  <p className="text-muted-foreground">Phone</p>
                  <p className="font-medium">{agent.phone}</p>
                </div>
              )}
              {agent.address && (
                <div>
                  <p className="text-muted-foreground">Address</p>
                  <p className="font-medium">
                    {agent.address.street && `${agent.address.street}, `}
                    {agent.address.city}, {agent.address.region},{" "}
                    {agent.address.country}
                    {agent.address.zip && ` ${agent.address.zip}`}
                  </p>
                </div>
              )}
              <div>
                <p className="text-muted-foreground">Member Since</p>
                <p className="font-medium">
                  {new Date(agent.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Verification Status</p>
                <div className="flex items-center gap-2 mt-1">
                  {isVerified ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="font-medium text-green-500">
                        Verified
                      </span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 text-orange-500" />
                      <span className="font-medium text-orange-500">
                        Pending
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Verification Documents */}
          {verificationDocs && (
            <Card className="p-4">
              <h3 className="font-semibold text-lg mb-4">
                Verification Documents
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {verificationDocs.frontId && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Front ID
                    </p>
                    <div className="relative w-full h-48 border rounded-lg overflow-hidden">
                      <Image
                        src={verificationDocs.frontId}
                        alt="Front ID"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                )}
                {verificationDocs.backId && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Back ID
                    </p>
                    <div className="relative w-full h-48 border rounded-lg overflow-hidden">
                      <Image
                        src={verificationDocs.backId}
                        alt="Back ID"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                )}
                {verificationDocs.selfie && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Selfie</p>
                    <div className="relative w-full h-48 border rounded-lg overflow-hidden">
                      <Image
                        src={verificationDocs.selfie}
                        alt="Selfie"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                )}
                {verificationDocs.selfieWithId && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Selfie with ID
                    </p>
                    <div className="relative w-full h-48 border rounded-lg overflow-hidden">
                      <Image
                        src={verificationDocs.selfieWithId}
                        alt="Selfie with ID"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}

          {!verificationDocs && (
            <Card className="p-4">
              <p className="text-muted-foreground text-center py-4">
                No verification documents submitted yet.
              </p>
            </Card>
          )}

          <div className="border-t my-4" />

          {/* Verification Status Update */}
          <VerificationStatusUpdate
            agent={agent}
            isVerified={isVerified}
            onUpdate={onUpdate}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
