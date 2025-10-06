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
import { apolloClient } from "@/lib/apollo/client";
import {
  UPDATE_PROPERTY,
  ADD_PROPERTY_ADDRESS,
  UPDATE_PROPERTY_ADDRESS,
  ADD_PROPERTY_IMAGES,
  DELETE_PROPERTY_IMAGE,
  DELETE_PROPERTY,
} from "@/lib/graphql/mutations";
import toast from "react-hot-toast";
import { Loader2, Trash2 } from "lucide-react";
import { SingleImageDropzone } from "@/components/upload/single-image";
import { ImageUploader } from "@/components/upload/multi-image";
import { UploaderProvider } from "@/components/upload/uploader-provider";
import { useEdgeStore } from "@/lib/edgestore";
import {
  Property,
  PropertyType,
  PropertyCategory,
  RentDuration,
} from "@/lib/graphql/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EditPropertySheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  property: Property;
  onSuccess: () => void;
}

interface FormData {
  title: string | undefined;
  buildingName: string | undefined;
  type: PropertyType | undefined;
  category: PropertyCategory | undefined;
  rent: string | undefined;
  rentDuration: RentDuration | undefined;
  price: string | undefined;
  vacant: boolean;
  mainImage: string | undefined;
  contactInfo: string | undefined;
  description: string | undefined;
  address: {
    country: string | undefined;
    region: string | undefined;
    city: string | undefined;
    street: string | undefined;
    zip: string | undefined;
    longitude: string | undefined;
    latitude: string | undefined;
  };
  newImages: string[];
}

export default function EditPropertySheet({
  open,
  onOpenChange,
  property,
  onSuccess,
}: EditPropertySheetProps) {
  const { edgestore } = useEdgeStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [existingImages, setExistingImages] = useState<
    Array<{ id: string; imageUrl: string }>
  >([]);

  const [formData, setFormData] = useState<FormData>({
    title: undefined,
    buildingName: undefined,
    type: undefined,
    category: undefined,
    rent: undefined,
    rentDuration: undefined,
    price: undefined,
    vacant: true,
    mainImage: undefined,
    contactInfo: undefined,
    description: undefined,
    address: {
      country: undefined,
      region: undefined,
      city: undefined,
      street: undefined,
      zip: undefined,
      longitude: undefined,
      latitude: undefined,
    },
    newImages: [] as string[],
  });

  // Pre-populate form when property or sheet opens
  useEffect(() => {
    if (property && open) {
      setFormData({
        title: property.title || undefined,
        buildingName: property.buildingName || undefined,
        type: property.type || undefined,
        category: property.category || undefined,
        rent: property.rent?.toString() || undefined,
        rentDuration: property.rentDuration || undefined,
        price: property.price?.toString() || undefined,
        vacant: property.vacant ?? true,
        mainImage: property.mainImage || undefined,
        contactInfo: property.contactInfo || undefined,
        description: property.description || undefined,
        address: {
          country: property.address?.country || undefined,
          region: property.address?.region || undefined,
          city: property.address?.city || undefined,
          street: property.address?.street || undefined,
          zip: property.address?.zip || undefined,
          longitude: property.address?.longitude?.toString() || undefined,
          latitude: property.address?.latitude?.toString() || undefined,
        },
        newImages: [],
      });
      setExistingImages(property.images || []);
    }
  }, [property, open]);

  const handleDeleteImage = async (imageId: string) => {
    try {
      await apolloClient.mutate({
        mutation: DELETE_PROPERTY_IMAGE,
        variables: { id: imageId },
      });
      setExistingImages(existingImages.filter((img) => img.id !== imageId));
      toast.success("Image deleted successfully");
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Failed to delete image");
    }
  };

  const handleDeleteProperty = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this property? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      await apolloClient.mutate({
        mutation: DELETE_PROPERTY,
        variables: { id: property.id },
      });
      toast.success("Property deleted successfully");
      onSuccess();
    } catch (error) {
      console.error("Error deleting property:", error);
      toast.error("Failed to delete property");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const promises = [];

      // Update property basic info
      promises.push(
        apolloClient.mutate({
          mutation: UPDATE_PROPERTY,
          variables: {
            id: property.id,
            property: {
              title: formData.title?.toLowerCase() || undefined,
              buildingName: formData.buildingName?.toLowerCase() || undefined,
              type: formData.type || undefined,
              category: formData.category || undefined,
              rent: formData.rent ? parseFloat(formData.rent) : undefined,
              rentDuration: formData.rentDuration || undefined,
              price: formData.price ? parseFloat(formData.price) : undefined,
              vacant: formData.vacant,
              mainImage: formData.mainImage || undefined,
              contactInfo: formData.contactInfo?.toLowerCase() || undefined,
              description: formData.description?.toLowerCase() || undefined,
            },
          },
        })
      );

      // Handle address - add if doesn't exist, update if exists
      if (
        formData.address.country ||
        formData.address.city ||
        formData.address.region ||
        formData.address.street ||
        formData.address.zip
      ) {
        const addressMutation = property.address
          ? UPDATE_PROPERTY_ADDRESS
          : ADD_PROPERTY_ADDRESS;

        promises.push(
          apolloClient.mutate({
            mutation: addressMutation,
            variables: {
              propertyId: property.id,
              propertyAddress: {
                country: formData.address.country?.toLowerCase() || undefined,
                region: formData.address.region?.toLowerCase() || undefined,
                city: formData.address.city?.toLowerCase() || undefined,
                street: formData.address.street?.toLowerCase() || undefined,
                zip: formData.address.zip?.toLowerCase() || undefined,
                longitude: formData.address.longitude
                  ? parseFloat(formData.address.longitude)
                  : undefined,
                latitude: formData.address.latitude
                  ? parseFloat(formData.address.latitude)
                  : undefined,
              },
            },
          })
        );
      }

      // Add new images if any
      if (formData.newImages.length > 0) {
        promises.push(
          apolloClient.mutate({
            mutation: ADD_PROPERTY_IMAGES,
            variables: {
              propertyId: property.id,
              propertyImages: formData.newImages.map((url) => ({
                imageUrl: url,
              })),
            },
          })
        );

        // Confirm uploads with EdgeStore
        formData.newImages.forEach((url) => {
          promises.push(edgestore.properties.confirmUpload({ url }));
        });
      }

      // Confirm main image if changed
      if (formData.mainImage && formData.mainImage !== property.mainImage) {
        promises.push(
          edgestore.properties.confirmUpload({ url: formData.mainImage })
        );
      }

      await Promise.all(promises);
      toast.success("Property updated successfully");
      onSuccess();
    } catch (error) {
      console.error("Error updating property:", error);
      toast.error("Failed to update property");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="px-8 max-h-[90vh] overflow-y-auto">
        <SheetHeader className="sticky top-0 left-0 right-0 z-10 bg-background pb-4">
          <SheetTitle>Edit property</SheetTitle>
          <SheetDescription>
            Update your property information and images
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Basic information</h3>

            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Property title"
                className="mt-2 capitalize"
                required
              />
            </div>

            <div>
              <Label htmlFor="buildingName">Building name</Label>
              <Input
                id="buildingName"
                value={formData.buildingName}
                onChange={(e) =>
                  setFormData({ ...formData, buildingName: e.target.value })
                }
                placeholder="Building name"
                className="mt-2 capitalize"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      category: value as PropertyCategory,
                    })
                  }
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="housing">Housing</SelectItem>
                    <SelectItem value="land">Land</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="type">Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type: value as PropertyType })
                  }
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="studio">Studio</SelectItem>
                    <SelectItem value="hotel">Hotel</SelectItem>
                    <SelectItem value="store">Store</SelectItem>
                    <SelectItem value="room">Room</SelectItem>
                    <SelectItem value="guesthouse">Guest House</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="rent">Rent</Label>
                <Input
                  id="rent"
                  type="number"
                  value={formData.rent}
                  onChange={(e) =>
                    setFormData({ ...formData, rent: e.target.value })
                  }
                  placeholder="0"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="rentDuration">Rent duration</Label>
                <Select
                  value={formData.rentDuration}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      rentDuration: value as RentDuration,
                    })
                  }
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                placeholder="0"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="contactInfo">Contact info</Label>
              <Input
                id="contactInfo"
                value={formData.contactInfo}
                onChange={(e) =>
                  setFormData({ ...formData, contactInfo: e.target.value })
                }
                placeholder="Contact information"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Property description"
                className="mt-2 w-full min-h-[100px] px-3 py-2 border rounded-md capitalize"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="vacant"
                checked={formData.vacant}
                onChange={(e) =>
                  setFormData({ ...formData, vacant: e.target.checked })
                }
                className="h-4 w-4"
              />
              <Label htmlFor="vacant">Property is vacant</Label>
            </div>
          </div>

          {/* Address Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Address</h3>

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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  value={formData.address.longitude}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: {
                        ...formData.address,
                        longitude: e.target.value,
                      },
                    })
                  }
                  placeholder="0.0"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  value={formData.address.latitude}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: {
                        ...formData.address,
                        latitude: e.target.value,
                      },
                    })
                  }
                  placeholder="0.0"
                  className="mt-2"
                />
              </div>
            </div>
          </div>

          {/* Main Image */}
          <div>
            <h3 className="font-semibold text-lg mb-2">Main image</h3>
            <div className="flex justify-center">
              <UploaderProvider
                autoUpload
                uploadFn={async ({ file, onProgressChange, signal }) => {
                  const res = await edgestore.properties.upload({
                    file,
                    signal,
                    onProgressChange,
                    options: { temporary: true },
                  });
                  setFormData({ ...formData, mainImage: res.url });
                  return { url: res.url };
                }}
              >
                <SingleImageDropzone
                  width={300}
                  height={200}
                  dropzoneOptions={{ maxSize: 1024 * 1024 * 5 }}
                  uploadedUrl={formData.mainImage}
                />
              </UploaderProvider>
            </div>
          </div>

          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-2">Existing images</h3>
              <div className="grid grid-cols-3 gap-2">
                {existingImages.map((image) => (
                  <div key={image.id} className="relative aspect-square">
                    <img
                      src={image.imageUrl}
                      alt="Property"
                      className="w-full h-full object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(image.id)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Images */}
          <div>
            <h3 className="font-semibold text-lg mb-2">Add more images</h3>
            <UploaderProvider
              autoUpload
              uploadFn={async ({ file, onProgressChange, signal }) => {
                const res = await edgestore.properties.upload({
                  file,
                  signal,
                  onProgressChange,
                  options: { temporary: true },
                });
                setFormData({
                  ...formData,
                  newImages: [...formData.newImages, res.url],
                });
                return { url: res.url };
              }}
            >
              <ImageUploader maxFiles={10} maxSize={1024 * 1024 * 5} />
            </UploaderProvider>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 pb-8 justify-between">
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteProperty}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete property
                </>
              )}
            </Button>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save changes"
                )}
              </Button>
            </div>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
