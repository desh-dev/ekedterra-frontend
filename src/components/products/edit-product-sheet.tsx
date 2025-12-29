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
  UPDATE_PRODUCT,
  ADD_PRODUCT_IMAGES,
  DELETE_PRODUCT_IMAGE,
  DELETE_PRODUCT,
} from "@/lib/graphql/mutations";
import toast from "react-hot-toast";
import { Loader2, Trash2 } from "lucide-react";
import { SingleImageDropzone } from "@/components/upload/single-image";
import { ImageUploader } from "@/components/upload/multi-image";
import { UploaderProvider } from "@/components/upload/uploader-provider";
import { useEdgeStore } from "@/lib/edgestore";
import { Product, ProductCategory } from "@/lib/graphql/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";

interface EditProductSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product;
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
  newImages: string[];
}

export default function EditProductSheet({
  open,
  onOpenChange,
  product,
  onSuccess,
}: EditProductSheetProps) {
  const { edgestore } = useEdgeStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [existingImages, setExistingImages] = useState<
    Array<{ id: string; imageUrl: string }>
  >([]);

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
    newImages: [] as string[],
  });

  // Pre-populate form when product or sheet opens
  useEffect(() => {
    if (product && open) {
      setFormData({
        name: product.name || undefined,
        description: product.description || undefined,
        category: product.category || ("" as ProductCategory),
        price: product.price?.toString() || undefined,
        stock: product.stock?.toString() || undefined,
        mainImage: product.mainImage || undefined,
        salePrice: product.salePrice?.toString() || undefined,
        bulkPrice: product.bulkPrice?.toString() || undefined,
        bulkQty: product.bulkQty?.toString() || undefined,
        newImages: [],
      });
      setExistingImages(product.images || []);
    }
  }, [product, open]);

  const handleDeleteImage = async (imageId: string, imageUrl: string) => {
    try {
      await Promise.all([
        apolloClient.mutate({
          mutation: DELETE_PRODUCT_IMAGE,
          variables: { id: imageId },
        }),
        edgestore.products.delete({ url: imageUrl }),
      ]);
      setExistingImages(existingImages.filter((img) => img.id !== imageId));
      toast.success("Image deleted successfully");
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Failed to delete image");
    }
  };

  const handleDeleteProduct = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this product? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      await Promise.all([
        apolloClient.mutate({
          mutation: DELETE_PRODUCT,
          variables: { id: product.id },
        }),
        ...existingImages.map((img) =>
          edgestore.products.delete({
            url: img.imageUrl,
          })
        ),
        edgestore.products.delete({
          url: product.mainImage,
        }),
      ]);
      toast.success("Product deleted successfully");
      onSuccess();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const promises = [];

      // Update product basic info
      promises.push(
        apolloClient.mutate({
          mutation: UPDATE_PRODUCT,
          variables: {
            id: product.id,
            product: {
              name: formData.name || undefined,
              description: formData.description || undefined,
              category: formData.category || undefined,
              price: formData.price ? parseFloat(formData.price) : undefined,
              stock: formData.stock ? parseInt(formData.stock) : undefined,
              mainImage: formData.mainImage || undefined,
              salePrice: formData.salePrice
                ? parseFloat(formData.salePrice)
                : undefined,
              bulkPrice: formData.bulkPrice
                ? parseFloat(formData.bulkPrice)
                : undefined,
              bulkQty: formData.bulkQty
                ? parseInt(formData.bulkQty)
                : undefined,
            },
          },
        })
      );

      // Add new images if any
      if (formData.newImages.length > 0) {
        promises.push(
          apolloClient.mutate({
            mutation: ADD_PRODUCT_IMAGES,
            variables: {
              productId: product.id,
              productImages: formData.newImages.map((url) => ({
                imageUrl: url,
              })),
            },
          })
        );

        // Confirm uploads with EdgeStore
        formData.newImages.forEach((url) => {
          promises.push(edgestore.products.confirmUpload({ url }));
        });
      }

      // Confirm main image if changed
      if (formData.mainImage && formData.mainImage !== product.mainImage) {
        promises.push(
          edgestore.products.confirmUpload({ url: formData.mainImage })
        );
      }

      await Promise.all(promises);
      toast.success("Product updated successfully");
      onSuccess();
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product");
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
          <SheetTitle>Edit product</SheetTitle>
          <SheetDescription>
            Update your product information and images
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

          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-2">Existing images</h3>
              <div className="grid grid-cols-3 gap-2">
                {existingImages.map((image) => (
                  <div key={image.id} className="relative aspect-square">
                    <Image
                      src={image.imageUrl}
                      alt="Product"
                      fill
                      className="w-full h-full object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteImage(image.id, image.imageUrl)
                      }
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
                  newImages: [...prevData.newImages, url],
                }))
              }
            >
              <ImageUploader maxFiles={10} maxSize={1024 * 1024 * 5} />
            </UploaderProvider>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 pb-8 justify-between">
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteProduct}
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
                  Delete product
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
