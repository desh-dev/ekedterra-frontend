"use client";

import React, { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/providers/auth-provider";
import { apolloClient } from "@/lib/apollo/client";
import {
  UPDATE_USER,
  ADD_USER_ADDRESS,
  UPDATE_USER_ADDRESS,
  UPDATE_VERIFICATION_DOCS,
  ADD_VERIFICATION_DOCS,
} from "@/lib/graphql/mutations";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { SingleImageDropzone } from "@/components/upload/single-image";
import { UploaderProvider } from "@/components/upload/uploader-provider";
import { useEdgeStore } from "@/lib/edgestore";

interface PersonalInformationSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface PersonalInformation {
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
}

export function PersonalInformationSheet({
  open,
  onOpenChange,
}: PersonalInformationSheetProps) {
  const { user, setUser } = useAuth();
  const { edgestore } = useEdgeStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<PersonalInformation>({
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
  });

  // Pre-populate form with user data when the sheet opens
  useEffect(() => {
    if (user && open) {
      setFormData({
        fullName: user.fullName || undefined,
        phone: user.phone || undefined,
        address: {
          country: user.address?.country || undefined,
          region: user.address?.region || undefined,
          city: user.address?.city || undefined,
          street: user.address?.street || undefined,
          zip: user.address?.zip || undefined,
        },
        frontId: user.verificationDocs?.frontId || undefined,
      });
    }
  }, [user, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please log in to update your information");
      return;
    }

    setIsSubmitting(true);
    try {
      const userId = user.userId;
      const promises = [];

      // Update user info
      promises.push(
        apolloClient.mutate({
          mutation: UPDATE_USER,
          variables: {
            id: userId,
            user: {
              fullName: formData.fullName?.toLowerCase(),
              phone: formData.phone?.toLowerCase(),
            },
          },
        })
      );

      // Add or update user address if any field is filled
      if (
        formData.address.country ||
        formData.address.region ||
        formData.address.city ||
        formData.address.street ||
        formData.address.zip
      ) {
        promises.push(
          apolloClient.mutate({
            mutation: user.address ? UPDATE_USER_ADDRESS : ADD_USER_ADDRESS,
            variables: {
              userId,
              userAddress: {
                country: formData.address.country?.toLowerCase() || undefined,
                region: formData.address.region?.toLowerCase() || undefined,
                city: formData.address.city?.toLowerCase() || undefined,
                street: formData.address.street?.toLowerCase() || undefined,
                zip: formData.address.zip?.toLowerCase() || undefined,
              },
            },
          })
        );
      }

      // Update verification docs if frontId is uploaded
      if (
        formData.frontId &&
        formData.frontId !== user.verificationDocs?.frontId
      ) {
        const verificationDocsPromise = apolloClient.mutate({
          mutation: user.verificationDocs
            ? UPDATE_VERIFICATION_DOCS
            : ADD_VERIFICATION_DOCS,
          variables: {
            userId,
            verificationDocs: {
              frontId: formData.frontId,
              backId: user.verificationDocs?.backId || undefined,
              selfie: user.verificationDocs?.selfie || undefined,
              selfieWithId: user.verificationDocs?.selfieWithId || undefined,
            },
          },
        });
        promises.push(verificationDocsPromise);

        // Confirm upload with EdgeStore
        promises.push(
          edgestore.verificationDocs.confirmUpload({
            url: formData.frontId,
          })
        );
      }

      await Promise.all(promises);

      // Refresh user data
      const updatedUser = {
        ...user,
        fullName: formData.fullName,
        phone: formData.phone,
        address: {
          ...user.address,
          ...formData.address,
          id: user.address?.id || undefined,
          createdAt: user.address?.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        verificationDocs: formData.frontId
          ? {
              ...user.verificationDocs,
              frontId: formData.frontId,
              id: user.verificationDocs?.id || undefined,
              backId: user.verificationDocs?.backId || undefined,
              selfie: user.verificationDocs?.selfie || undefined,
              selfieWithId: user.verificationDocs?.selfieWithId || undefined,
            }
          : user.verificationDocs,
      };
      //@ts-expect-error Object is possibly 'null'.
      setUser(updatedUser);
      toast.success("Personal information updated successfully!");
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating personal information:", error);
      toast.error("Failed to update personal information");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="px-8 max-h-[80vh] max-w-[100vw] md:max-w-7xl mx-auto overflow-y-auto overflow-x-hidden rounded-lg"
      >
        <SheetHeader className="w-[100vw] sticky top-0 left-0 right-0 z-10 bg-background">
          <SheetTitle>Personal information</SheetTitle>
          <SheetDescription>
            Update your personal information and identity verification
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Full Name */}
          <div>
            <Label htmlFor="fullName">Legal name</Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              placeholder="Enter your full name"
              className="mt-2 capitalize"
            />
          </div>

          {/* Phone Number */}
          <div>
            <Label htmlFor="phone">Phone number</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder="Enter your phone number"
              className="mt-2 capitalize"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Add a number so confirmed guests and Ekedterra can get in touch.
              You can add other numbers and choose how they&apos;re used.
            </p>
          </div>

          {/* Address Section */}
          <div className="space-y-4">
            <h3 className="font-semibold">Residential address</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={formData.address.country}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, country: e.target.value },
                    })
                  }
                  placeholder="Country"
                  className="mt-2 capitalize"
                />
              </div>
              <div>
                <Label htmlFor="region">Region</Label>
                <Input
                  id="region"
                  value={formData.address.region}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, region: e.target.value },
                    })
                  }
                  placeholder="Region/State"
                  className="mt-2 capitalize"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.address.city}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: { ...formData.address, city: e.target.value },
                  })
                }
                placeholder="City"
                className="mt-2 capitalize"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="street">Street address</Label>
                <Input
                  id="street"
                  value={formData.address.street}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, street: e.target.value },
                    })
                  }
                  placeholder="Street"
                  className="mt-2 capitalize"
                />
              </div>
              <div>
                <Label htmlFor="zip">ZIP code</Label>
                <Input
                  id="zip"
                  value={formData.address.zip}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, zip: e.target.value },
                    })
                  }
                  placeholder="ZIP"
                  className="mt-2 capitalize"
                />
              </div>
            </div>
          </div>

          {/* Identity Verification */}
          <div>
            <h3 className="font-semibold mb-2">Identity verification</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Upload a photo of your ID (front side) for secure bookings. This
              helps verify your identity and protect your account.
            </p>
            <div className="flex justify-center">
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
                  setFormData({ ...formData, frontId: res.url });
                  return { url: res.url };
                }}
              >
                <SingleImageDropzone
                  width={300}
                  height={200}
                  dropzoneOptions={{ maxSize: 1024 * 1024 * 5 }}
                  uploadedUrl={formData.frontId}
                />
              </UploaderProvider>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex py-4 justify-between">
            <div>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
            <div>
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
