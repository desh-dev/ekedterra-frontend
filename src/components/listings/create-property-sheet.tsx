"use client";

import React, { useEffect, useState } from "react";
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
import { CREATE_PROPERTY, ADD_PROPERTY_IMAGES } from "@/lib/graphql/mutations";
import toast from "react-hot-toast";
import { Loader2, MapPin } from "lucide-react";
import { SingleImageDropzone } from "@/components/upload/single-image";
import { ImageUploader } from "@/components/upload/multi-image";
import { UploaderProvider } from "@/components/upload/uploader-provider";
import { useEdgeStore } from "@/lib/edgestore";
import {
  PropertyType,
  PropertyCategory,
  RentDuration,
} from "@/lib/graphql/types";
import { useAuth } from "@/providers/auth-provider";
import { formatNumber } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CreatePropertySheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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
  additionalImages: string[];
}
export default function CreatePropertySheet({
  open,
  onOpenChange,
  onSuccess,
}: CreatePropertySheetProps) {
  const { user, isVerified } = useAuth();
  const { edgestore } = useEdgeStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

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
      zip: "00000",
      longitude: undefined,
      latitude: undefined,
    },
    additionalImages: [] as string[],
  });

  const getCurrentLocation = () => {
    // setIsGettingLocation(true);
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      // setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          address: {
            ...prev.address,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString(),
          },
        }));
        toast.success("Location updated successfully");
        // setIsGettingLocation(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        toast.error("Unable to retrieve your location");
        // setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  };

  const resetForm = () => {
    setFormData({
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
        country: "Cameroon",
        region: "South West",
        city: "Buea",
        street: undefined,
        zip: "00000",
        longitude: undefined,
        latitude: undefined,
      },
      additionalImages: [],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !isVerified) {
      toast.error("You must be logged in and verified to create a property");
      return;
    }

    if (!formData.title || !formData.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create property with address included
      const { data } = await apolloClient.mutate({
        mutation: CREATE_PROPERTY,
        variables: {
          property: {
            title: formData.title.toLowerCase(),
            buildingName: formData.buildingName?.toLowerCase() || undefined,
            type: formData.type || undefined,
            category: formData.category,
            rent: formData.rent ? parseFloat(formData.rent) : undefined,
            rentDuration: formData.rentDuration || undefined,
            price: formData.price ? parseFloat(formData.price) : undefined,
            vacant: formData.vacant,
            mainImage: formData.mainImage || undefined,
            contactInfo: formData.contactInfo?.toLowerCase() || undefined,
            description: formData.description || undefined,
            userId: user.userId,
            address: {
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
        },
      });

      // @ts-expect-error Object is possibly 'null'.
      const createdProperty = data?.createProperty;

      if (!createdProperty) {
        throw new Error("Failed to create property");
      }

      const promises = [];

      // Add additional images if any
      if (formData.additionalImages.length > 0) {
        promises.push(
          apolloClient.mutate({
            mutation: ADD_PROPERTY_IMAGES,
            variables: {
              propertyId: createdProperty.id,
              propertyImages: formData.additionalImages.map((url) => ({
                imageUrl: url,
              })),
            },
          })
        );

        // Confirm uploads with EdgeStore
        formData.additionalImages.forEach((url) => {
          promises.push(edgestore.properties.confirmUpload({ url }));
        });
      }

      // Confirm main image
      if (formData.mainImage) {
        promises.push(
          edgestore.properties.confirmUpload({ url: formData.mainImage })
        );
      }

      await Promise.all(promises);
      toast.success("Property created successfully");
      resetForm();
      onSuccess();
    } catch (error) {
      console.error("Error creating property:", error);
      toast.error("Failed to create property");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (open) {
      getCurrentLocation();
    }
  }, [open]);
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="px-8 max-h-[80vh] max-w-[100vw] md:max-w-7xl mx-auto overflow-y-auto overflow-x-hidden"
      >
        <SheetHeader className="w-[100vw] sticky top-0 left-0 right-0 z-10 bg-background rounded-lg pb-4">
          <SheetTitle>Create new property</SheetTitle>
          <SheetDescription>
            Add a new property listing to your portfolio
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
                <Label htmlFor="type">Type *</Label>
                <Select
                  value={formData.type}
                  required
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
                  type="text"
                  inputMode="numeric"
                  value={formData.rent ? formatNumber(formData.rent) : ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Only update if the value is a valid number or empty
                    if (value === "" || /^\d{1,3}(,\d{3})*$/.test(value)) {
                      setFormData({
                        ...formData,
                        rent: value.replace(/\D/g, ""),
                      });
                    } else if (/^\d+$/.test(value.replace(/,/g, ""))) {
                      // If user is typing a number, format it
                      setFormData({
                        ...formData,
                        rent: value.replace(/\D/g, ""),
                      });
                    }
                  }}
                  placeholder="50,000"
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
                type="text"
                inputMode="numeric"
                value={formData.price ? formatNumber(formData.price) : ""}
                onChange={(e) => {
                  const value = e.target.value;
                  // Only update if the value is a valid number or empty
                  if (value === "" || /^\d{1,3}(,\d{3})*$/.test(value)) {
                    setFormData({
                      ...formData,
                      price: value.replace(/\D/g, ""),
                    });
                  } else if (/^\d+$/.test(value.replace(/,/g, ""))) {
                    // If user is typing a number, format it
                    setFormData({
                      ...formData,
                      price: value.replace(/\D/g, ""),
                    });
                  }
                }}
                placeholder="50,000"
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
              <Label htmlFor="description">Description *</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Property description"
                className="mt-2 w-full min-h-[100px] px-3 py-2 border rounded-md"
                required
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
                <Label htmlFor="country">Country *</Label>
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
                  required
                />
              </div>
              <div>
                <Label htmlFor="region">Region *</Label>
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
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="city">City *</Label>
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
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="street">Street/Quarter *</Label>
                <Input
                  id="street"
                  value={formData.address.street}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, street: e.target.value },
                    })
                  }
                  placeholder="Sand Pit"
                  className="mt-2 capitalize"
                  required
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
                  placeholder="00000"
                  className="mt-2 capitalize"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="longitude">Longitude</Label>
                <div className="flex gap-2">
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    value={formData.address.longitude || ""}
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
                    className="mt-2 flex-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  value={formData.address.latitude || ""}
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
              <div className="col-span-2 place-self-end">
                {formData.address.longitude || formData.address.latitude ? (
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        address: {
                          ...formData.address,
                          longitude: undefined,
                          latitude: undefined,
                        },
                      })
                    }
                    className="text-xs text-muted-foreground hover:underline"
                  >
                    Clear location
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    disabled={isGettingLocation}
                    className="text-xs text-muted-foreground hover:underline flex items-center gap-1"
                  >
                    <MapPin className="h-3 w-3" />
                    Add location
                  </button>
                )}
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

          {/* Additional Images */}
          <div>
            <h3 className="font-semibold text-lg mb-2">Additional images</h3>
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
                  additionalImages: [...formData.additionalImages, res.url],
                });
                return { url: res.url };
              }}
            >
              <ImageUploader maxFiles={10} maxSize={1024 * 1024 * 5} />
            </UploaderProvider>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 pb-8 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                onOpenChange(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !isVerified}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create property"
              )}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
