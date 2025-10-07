"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { CheckCircle2, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { SingleImageDropzone } from "@/components/upload/single-image";
import { UploaderProvider } from "@/components/upload/uploader-provider";
import { useEdgeStore } from "@/lib/edgestore";
import { apolloClient } from "@/lib/apollo/client";
import {
  UPDATE_USER,
  ADD_USER_ADDRESS,
  ADD_ROLE,
  ADD_VERIFICATION_DOCS,
  UPDATE_VERIFICATION_DOCS,
  UPDATE_USER_ADDRESS,
} from "@/lib/graphql/mutations";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import toast from "react-hot-toast";

// Step types
type Step =
  | "agreement"
  | "profile"
  | "frontId"
  | "backId"
  | "selfie"
  | "selfieWithId"
  | "complete";

interface AgentFormData {
  fullName: string | undefined;
  phone: string | undefined;
  address: {
    country: string | undefined;
    region: string | undefined;
    city: string | undefined;
    street: string | undefined;
    zip: string | undefined;
  };
  frontId: string | undefined;
  backId: string | undefined;
  selfie: string | undefined;
  selfieWithId: string | undefined;
}

const BecomeAgentPage = () => {
  const router = useRouter();
  const { edgestore } = useEdgeStore();
  const { user, loading } = useAuth();
  const [currentStep, setCurrentStep] = useState<Step>("agreement");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<AgentFormData>({
    fullName: undefined,
    phone: undefined,
    address: {
      country: undefined,
      region: undefined,
      city: undefined,
      street: undefined,
      zip: undefined,
    },
    frontId: undefined,
    backId: undefined,
    selfie: undefined,
    selfieWithId: undefined,
  });

  // Pre-populate form with user data if available
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.fullName || undefined,
        phone: user.phone || undefined,
        address: user.address
          ? {
              country: user.address.country || undefined,
              region: user.address.region || undefined,
              city: user.address.city || undefined,
              street: user.address.street || undefined,
              zip: user.address.zip || undefined,
            }
          : prev.address,
      }));
    }
  }, [user]);

  // Step navigation
  const steps: Step[] = [
    "agreement",
    "profile",
    "frontId",
    "backId",
    "selfie",
    "selfieWithId",
    "complete",
  ];
  const currentStepIndex = steps.indexOf(currentStep);

  const handleNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex]);
    }
  };

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex]);
    }
  };

  const handleAgree = () => {
    setCurrentStep("profile");
  };

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateAddress = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value,
      },
    }));
  };

  const handleFinish = async () => {
    if (!user) {
      toast.error("Please log in to continue");
      return;
    }

    setIsSubmitting(true);
    try {
      const userId = user.userId;
      const promises = [
        // Always update user info
        apolloClient.mutate({
          mutation: UPDATE_USER,
          variables: {
            id: userId,
            user: {
              fullName: formData.fullName?.toLowerCase(),
              phone: formData.phone?.toLowerCase(),
            },
          },
        }),
        // Always use ADD_USER_ADDRESS since we don't have an update mutation
        apolloClient.mutate({
          mutation: user.address ? UPDATE_USER_ADDRESS : ADD_USER_ADDRESS,
          variables: {
            userId,
            userAddress: {
              ...formData.address,
              country: formData.address.country?.toLowerCase(),
              city: formData.address.city?.toLowerCase(),
              region: formData.address.region?.toLowerCase(),
              street: formData.address.street?.toLowerCase(),
              zip: formData.address.zip?.toLowerCase(),
            },
          },
        }),
        // Add agent role if not already present
        !user.roles?.some((role) => role.role === "agent") &&
          apolloClient.mutate({
            mutation: ADD_ROLE,
            variables: {
              userId,
              role: { role: "agent" },
            },
          }),
        // Add or update verification docs
        apolloClient.mutate({
          mutation: user.verificationDocs
            ? UPDATE_VERIFICATION_DOCS
            : ADD_VERIFICATION_DOCS,
          variables: {
            userId,
            verificationDocs: {
              frontId: formData.frontId,
              backId: formData.backId,
              selfie: formData.selfie,
              selfieWithId: formData.selfieWithId,
            },
          },
        }),
        // Confirm all uploads with EdgeStore
        edgestore.verificationDocs.confirmUpload({
          url: formData.frontId as string,
        }),
        edgestore.verificationDocs.confirmUpload({
          url: formData.backId as string,
        }),
        edgestore.verificationDocs.confirmUpload({
          url: formData.selfie as string,
        }),
        edgestore.verificationDocs.confirmUpload({
          url: formData.selfieWithId as string,
        }),
      ].filter(Boolean); // Remove any falsy values (like the conditional role addition)

      await Promise.all(promises);
      toast.success("Application submitted successfully!");
      setCurrentStep("complete");
    } catch (error) {
      console.error("Error becoming agent:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isProfileComplete =
    formData.fullName &&
    formData.phone &&
    formData.address.country &&
    formData.address.city;
  const canProceedToFinish =
    formData.frontId &&
    formData.backId &&
    formData.selfie &&
    formData.selfieWithId;

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect if not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4">
        <Card className="p-8 shadow-2xl text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="text-muted-foreground mb-6">
            Please log in to continue with the agent registration process.
          </p>
          <Button onClick={() => router.push("/auth/login")} className="w-full">
            Go to Login
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Agreement Step */}
        {currentStep === "agreement" && (
          <Card className="p-8 shadow-2xl">
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">Become an Agent</h1>
              <p className="text-muted-foreground">
                Join our community of trusted agents
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-3">
                  Our Community Commitment
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  To ensure this, we&apos;re asking you to commit to the
                  following:
                </p>
                <p className="text-sm leading-relaxed mb-4">
                  I agree to treat everyone in the community—regardless of their
                  race, religion, national origin, ethnicity, disability, sex,
                  gender identity, sexual orientation, or age—with respect, and
                  without judgment or bias.
                </p>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">
                  As an agent, you will be able to:
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span>Post and manage properties and products</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span>Manage bookings and customer inquiries</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span>Access advanced analytics and insights</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span>Build your professional reputation</span>
                  </li>
                </ul>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg border-l-4 border-destructive">
                <h3 className="font-semibold mb-2 text-destructive">
                  Important Notice
                </h3>
                <p className="text-sm text-muted-foreground">
                  Switching to an agent account is <strong>irreversible</strong>
                  . Once you become an agent, you cannot revert to a regular
                  user account.
                </p>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">What to Expect:</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center mr-3 font-semibold">
                      1
                    </div>
                    <span>Complete your profile information</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center mr-3 font-semibold">
                      2
                    </div>
                    <span>Upload front side of ID card</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center mr-3 font-semibold">
                      3
                    </div>
                    <span>Upload back side of ID card</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center mr-3 font-semibold">
                      4
                    </div>
                    <span>Upload a selfie photo</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center mr-3 font-semibold">
                      5
                    </div>
                    <span>Upload a selfie with your ID card</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-between gap-4">
              <Button variant="outline" onClick={() => router.back()}>
                Decline
              </Button>
              <Button onClick={handleAgree} className="bg-primary">
                Agree and Continue
              </Button>
            </div>
          </Card>
        )}

        {/* Profile Step */}
        {currentStep === "profile" && (
          <Card className="p-8 shadow-2xl">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold">
                  Step 1: Complete Your Profile
                </h2>
                <span className="text-sm text-muted-foreground">1 of 5</span>
              </div>
              <p className="text-muted-foreground">
                Please provide your contact and address information
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => updateFormData("fullName", e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => updateFormData("phone", e.target.value)}
                  placeholder="678 888 888"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="country">Country *</Label>
                  <Input
                    id="country"
                    value={formData.address.country}
                    onChange={(e) => updateAddress("country", e.target.value)}
                    placeholder="Country"
                  />
                </div>
                <div>
                  <Label htmlFor="region">Region</Label>
                  <Input
                    id="region"
                    value={formData.address.region}
                    onChange={(e) => updateAddress("region", e.target.value)}
                    placeholder="Region/State"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.address.city}
                  onChange={(e) => updateAddress("city", e.target.value)}
                  placeholder="City"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="street">Street Address</Label>
                  <Input
                    id="street"
                    value={formData.address.street}
                    onChange={(e) => updateAddress("street", e.target.value)}
                    placeholder="Street"
                  />
                </div>
                <div>
                  <Label htmlFor="zip">ZIP Code</Label>
                  <Input
                    id="zip"
                    value={formData.address.zip}
                    onChange={(e) => updateAddress("zip", e.target.value)}
                    placeholder="ZIP"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button onClick={handleNext} disabled={!isProfileComplete}>
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Card>
        )}

        {/* Front ID Step */}
        {currentStep === "frontId" && (
          <Card className="p-8 shadow-2xl">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold">Step 2: Front ID Photo</h2>
                <span className="text-sm text-muted-foreground">2 of 5</span>
              </div>
              <p className="text-muted-foreground">
                Upload a clear photo of the front side of your ID card
              </p>
            </div>

            <div className="flex justify-center py-8">
              <UploaderProvider
                autoUpload
                uploadFn={async ({ file, onProgressChange, signal }) => {
                  const res = await edgestore.verificationDocs.upload({
                    file,
                    signal,
                    onProgressChange,
                    options: {
                      temporary: true,
                    },
                  });
                  updateFormData("frontId", res.url);
                  return { url: res.url };
                }}
              >
                <SingleImageDropzone
                  width={340}
                  height={300}
                  dropzoneOptions={{ maxSize: 1024 * 1024 * 5 }}
                  uploadedUrl={formData.frontId}
                />
              </UploaderProvider>
            </div>

            <div className="mt-8 flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button onClick={handleNext} disabled={!formData.frontId}>
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Card>
        )}

        {/* Back ID Step */}
        {currentStep === "backId" && (
          <Card className="p-8 shadow-2xl">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold">Step 3: Back ID Photo</h2>
                <span className="text-sm text-muted-foreground">3 of 5</span>
              </div>
              <p className="text-muted-foreground">
                Upload a clear photo of the back side of your ID card
              </p>
            </div>

            <div className="flex justify-center py-8">
              <UploaderProvider
                autoUpload
                uploadFn={async ({ file, onProgressChange, signal }) => {
                  const res = await edgestore.verificationDocs.upload({
                    file,
                    signal,
                    onProgressChange,
                    options: {
                      temporary: true,
                    },
                  });
                  updateFormData("backId", res.url);
                  return { url: res.url };
                }}
              >
                <SingleImageDropzone
                  width={340}
                  height={300}
                  dropzoneOptions={{ maxSize: 1024 * 1024 * 5 }}
                  uploadedUrl={formData.backId}
                />
              </UploaderProvider>
            </div>

            <div className="mt-8 flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button onClick={handleNext} disabled={!formData.backId}>
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Card>
        )}

        {/* Selfie Step */}
        {currentStep === "selfie" && (
          <Card className="p-8 shadow-2xl">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold">Step 4: Selfie Photo</h2>
                <span className="text-sm text-muted-foreground">4 of 5</span>
              </div>
              <p className="text-muted-foreground">
                Upload a clear selfie photo of yourself
              </p>
            </div>

            <div className="flex justify-center py-8">
              <UploaderProvider
                autoUpload
                uploadFn={async ({ file, onProgressChange, signal }) => {
                  const res = await edgestore.verificationDocs.upload({
                    file,
                    signal,
                    onProgressChange,
                    options: {
                      temporary: true,
                    },
                  });
                  updateFormData("selfie", res.url);
                  return { url: res.url };
                }}
              >
                <SingleImageDropzone
                  width={340}
                  height={300}
                  dropzoneOptions={{ maxSize: 1024 * 1024 * 5 }}
                  uploadedUrl={formData.selfie}
                />
              </UploaderProvider>
            </div>

            <div className="mt-8 flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button onClick={handleNext} disabled={!formData.selfie}>
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Card>
        )}

        {/* Selfie with ID Step */}
        {currentStep === "selfieWithId" && (
          <Card className="p-8 shadow-2xl">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold">Step 5: Selfie with ID</h2>
                <span className="text-sm text-muted-foreground">5 of 5</span>
              </div>
              <p className="text-muted-foreground">
                Upload a selfie holding your ID card next to your face
              </p>
            </div>

            <div className="flex justify-center py-8">
              <UploaderProvider
                autoUpload
                uploadFn={async ({ file, onProgressChange, signal }) => {
                  const res = await edgestore.verificationDocs.upload({
                    file,
                    signal,
                    onProgressChange,
                    options: {
                      temporary: true,
                    },
                  });
                  updateFormData("selfieWithId", res.url);
                  return { url: res.url };
                }}
              >
                <SingleImageDropzone
                  width={340}
                  height={300}
                  dropzoneOptions={{ maxSize: 1024 * 1024 * 5 }}
                  uploadedUrl={formData.selfieWithId}
                />
              </UploaderProvider>
            </div>

            <div className="mt-8 flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button
                onClick={handleFinish}
                disabled={!canProceedToFinish || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Finish"
                )}
              </Button>
            </div>
          </Card>
        )}

        {/* Complete Step */}
        {currentStep === "complete" && (
          <Card className="p-8 shadow-2xl text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="h-12 w-12 text-primary" />
              </div>
            </div>

            <h2 className="text-3xl font-bold mb-4">Application Submitted!</h2>
            <p className="text-muted-foreground mb-8">
              Your agent application has been successfully submitted. Our team
              will review your information and get back to you within 2-3
              business days.
            </p>

            <Button
              onClick={() => router.push("/profile")}
              className="w-full sm:w-auto"
            >
              Go to Profile
            </Button>
          </Card>
        )}

        {/* Progress Indicator */}
        {currentStep !== "agreement" && currentStep !== "complete" && (
          <div className="mt-6 flex justify-center">
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((step) => {
                const stepIndex = step + 1; // +1 because agreement is index 0
                const isActive = stepIndex <= currentStepIndex;
                return (
                  <div
                    key={step}
                    className={`h-2 w-12 rounded-full transition-colors ${
                      isActive ? "bg-primary" : "bg-muted"
                    }`}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BecomeAgentPage;
