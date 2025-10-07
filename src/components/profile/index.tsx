"use client";

import React, { useState } from "react";
import { useAuth } from "@/providers/auth-provider";
import { Card } from "@/components/ui/card";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { CheckCircle2, ChevronRight, User, AlertCircle } from "lucide-react";
import { PersonalInformationSheet } from "./personal-information-sheet";
import Loading from "../loading";

const ProfilePage = () => {
  const { user, loading, isAgent } = useAuth();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">
          Please log in to view your profile
        </p>
      </div>
    );
  }

  // Check verification docs status
  const hasVerificationDocs = user.verificationDocs;
  const hasAllDocs =
    hasVerificationDocs &&
    hasVerificationDocs.frontId &&
    hasVerificationDocs.backId &&
    hasVerificationDocs.selfie &&
    hasVerificationDocs.selfieWithId;
  const isVerified = user.verified;

  // Get user's initials for avatar
  const getInitials = (name: string) => {
    const names = name.split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name?.substring(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <h1 className="text-3xl font-bold mb-6">Profile</h1>

        {/* User Info Card */}
        <Card className="p-6 mb-4">
          <div className="flex flex-col items-center">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-gray-900 text-white flex items-center justify-center text-3xl font-bold mb-4">
              {user.avatarUrl ? (
                <Image
                  src={user.avatarUrl}
                  alt={user.fullName}
                  width={96}
                  height={96}
                  className="rounded-full object-cover"
                />
              ) : (
                getInitials(user.fullName || user.email)
              )}
            </div>

            {/* Name */}
            <h2 className="text-2xl font-bold mb-1">{user.fullName}</h2>

            {/* Email/Status */}
            <p className="text-muted-foreground text-sm">{user.email}</p>
          </div>
        </Card>

        {/* Agent Status Card */}
        <Card className="p-6 mb-4">
          {!isAgent ? (
            // Not an agent - show "Become an agent" card
            <Link href="/agent" className="block">
              <div className="flex items-center gap-4 hover:bg-muted/50 rounded-lg p-2 transition-colors">
                <Image
                  src="/become-agent.webp"
                  alt="Become an agent"
                  width={60}
                  height={60}
                  className="flex-shrink-0"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">
                    Become an agent
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    It&apos;s easy to become an Ekedterra agent and earn extra
                    income
                  </p>
                </div>
                <ChevronRight className="text-muted-foreground flex-shrink-0" />
              </div>
            </Link>
          ) : (
            // Is an agent - show status
            <div>
              {!hasAllDocs ? (
                // Incomplete verification docs
                <Link href="/agent" className="block">
                  <div className="flex items-center gap-4 hover:bg-muted/50 rounded-lg p-2 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                      <AlertCircle className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">
                        Complete your verification
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Please complete your verification documents to start
                        listing properties
                      </p>
                    </div>
                    <ChevronRight className="text-muted-foreground flex-shrink-0" />
                  </div>
                </Link>
              ) : !isVerified ? (
                // Has all docs but not verified yet
                <div className="flex items-center gap-4 p-2">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">
                      Verification pending
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Your documents are under review. We&apos;ll notify you
                      once verification is complete.
                    </p>
                  </div>
                </div>
              ) : (
                // Verified agent
                <div className="flex items-center gap-4 p-2">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">
                      Verified agent
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      You&apos;re all set! Start listing and managing your
                      properties.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Account Settings Section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Account settings</h2>

          <button
            onClick={() => setIsSheetOpen(true)}
            className="w-full flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <User className="w-5 h-5 text-muted-foreground" />
            <span className="flex-1 text-left font-medium">
              Personal information
            </span>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Personal Information Sheet */}
      <PersonalInformationSheet
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
      />
    </div>
  );
};

export default ProfilePage;
