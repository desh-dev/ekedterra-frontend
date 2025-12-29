"use client";

import React, { useState } from "react";
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
import { CREATE_PRODUCT, ADD_PRODUCT_IMAGES } from "@/lib/graphql/mutations";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { SingleImageDropzone } from "@/components/upload/single-image";
import { ImageUploader } from "@/components/upload/multi-image";
import { UploaderProvider } from "@/components/upload/uploader-provider";
import { useEdgeStore } from "@/lib/edgestore";
import { ProductCategory } from "@/lib/graphql/types";
import { useAuth } from "@/providers/auth-provider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CreateProductSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface FormData {
  name: string | undefined;
  description: string | undefined;
  category: ProductCategory;
  price: string | undefined;
  stock: string | undefined;
  mainImage: string | undefined;
  salePrice: string | undefined;
  bulkPrice: string | undefined;
  bulkQty: string | undefined;
  additionalImages: string[];
}

export default function CreateProductSheet({
  open,
  onOpenChange,
  onSuccess,
}: CreateProductSheetProps) {
  const { user } = useAuth();
  const { edgestore } = useEdgeStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    name: undefined,
    description: undefined,
    category: "" as ProductCategory,
    price: undefined,
    stock: undefined,
    mainImage: undefined,
    salePrice: undefined,
    bulkPrice: undefined,
    bulkQty: undefined,
    additionalImages: [] as string[],
  });

  const resetForm = () => {
    setFormData({
      name: undefined,
      description: undefined,
      category: "" as ProductCategory,
      price: undefined,
      stock: undefined,
      mainImage: undefined,
      salePrice: undefined,
      bulkPrice: undefined,
      bulkQty: undefined,
      additionalImages: [],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("You must be logged in to create a product");
      return;
    }

    if (
      !formData.name ||
      !formData.category ||
      !formData.price ||
      !formData.stock
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create product
      const { data } = await apolloClient.mutate({
        mutation: CREATE_PRODUCT,
        variables: {
          product: {
            name: formData.name || undefined,
            description: formData.description || undefined,
            category: formData.category,
            price: formData.price ? Number(formData.price) : undefined,
            stock: formData.stock ? Number(formData.stock) : undefined,
            mainImage: formData.mainImage || undefined,
            salePrice: formData.salePrice
              ? Number(formData.salePrice)
              : undefined,
            bulkPrice: formData.bulkPrice
              ? Number(formData.bulkPrice)
              : undefined,
            bulkQty: formData.bulkQty ? Number(formData.bulkQty) : undefined,
            userId: user.userId,
          },
        },
      });

      //@ts-expect-error Object is possibly 'null'.
      const createdProduct = data?.createProduct;

      if (!createdProduct) {
        throw new Error("Failed to create product");
      }

      const promises = [];

      // Add additional images if any
      if (formData.additionalImages.length > 0) {
        promises.push(
          apolloClient.mutate({
            mutation: ADD_PRODUCT_IMAGES,
            variables: {
              productId: createdProduct.id,
              productImages: formData.additionalImages.map((url) => ({
                imageUrl: url,
              })),
            },
          })
        );

        // Confirm uploads with EdgeStore
        formData.additionalImages.forEach((url) => {
          promises.push(edgestore.products.confirmUpload({ url }));
        });
      }

      // Confirm main image
      if (formData.mainImage) {
        promises.push(
          edgestore.products.confirmUpload({ url: formData.mainImage })
        );
      }

      await Promise.all(promises);
      toast.success("Product created successfully");
      resetForm();
      onSuccess();
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("Failed to create product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="px-8 max-h-[80vh] max-w-[100vw] md:max-w-7xl mx-auto overflow-y-auto overflow-x-hidden"
      >
        <SheetHeader className="w-[100vw] sticky top-0 left-0 right-0 z-10 bg-background rounded-lg pb-4">
          <SheetTitle>Create new product</SheetTitle>
          <SheetDescription>
            Add a new product to your inventory
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Basic information</h3>

            <div>
              <Label htmlFor="name">Product name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Product name"
                className="mt-2"
                required
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
                placeholder="Product description"
                className="mt-2 w-full min-h-[100px] px-3 py-2 border rounded-md"
              />
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    category: value as ProductCategory,
                  })
                }
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="transport">Transport</SelectItem>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="furniture">Furniture</SelectItem>
                  <SelectItem value="home">Home</SelectItem>
                  <SelectItem value="health">Health</SelectItem>
                  <SelectItem value="food">Food</SelectItem>
                  <SelectItem value="travel">Travel</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="clothing">Clothing</SelectItem>
                  <SelectItem value="toys">Toys</SelectItem>
                  <SelectItem value="fashion">Fashion</SelectItem>
                  <SelectItem value="beauty">Beauty</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                  <SelectItem value="service">Service</SelectItem>
                  <SelectItem value="music">Music</SelectItem>
                  <SelectItem value="gaming">Gaming</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  placeholder="0.00"
                  className="mt-2"
                  required
                />
              </div>

              <div>
                <Label htmlFor="stock">Stock *</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: e.target.value })
                  }
                  placeholder="0"
                  className="mt-2"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="salePrice">Sale price</Label>
                <Input
                  id="salePrice"
                  type="number"
                  step="0.01"
                  value={formData.salePrice}
                  onChange={(e) =>
                    setFormData({ ...formData, salePrice: e.target.value })
                  }
                  placeholder="0.00"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="bulkPrice">Bulk price</Label>
                <Input
                  id="bulkPrice"
                  type="number"
                  step="0.01"
                  value={formData.bulkPrice}
                  onChange={(e) =>
                    setFormData({ ...formData, bulkPrice: e.target.value })
                  }
                  placeholder="0.00"
                  className="mt-2"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="bulkQty">Bulk quantity</Label>
              <Input
                id="bulkQty"
                type="number"
                value={formData.bulkQty}
                onChange={(e) =>
                  setFormData({ ...formData, bulkQty: e.target.value })
                }
                placeholder="0"
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Minimum quantity required for bulk pricing
              </p>
            </div>
          </div>

          {/* Main Image */}
          <div>
            <h3 className="font-semibold text-lg mb-2">Main image</h3>
            <div className="flex justify-center">
              <UploaderProvider
                autoUpload
                uploadFn={async ({ file, onProgressChange, signal }) => {
                  const res = await edgestore.products.upload({
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
                const res = await edgestore.products.upload({
                  file,
                  signal,
                  onProgressChange,
                  options: { temporary: true },
                });
                return { url: res.url };
              }}
              onUploadCompleted={({ url }) =>
                setFormData((prevData) => ({
                  ...prevData,
                  additionalImages: [...prevData.additionalImages, url],
                }))
              }
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
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create product"
              )}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
