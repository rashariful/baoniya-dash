// components/dashboard/products/ProductForm.tsx (Without Zod)
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ProductVariantManager } from "./ProductVariantManager";
import { ImageUploader } from "./ImageUploader";
import { useGetAllCategoriesQuery } from "@/redux/api/categoryApi";
import { useGetAllBrandsQuery } from "@/redux/api/brandApi";
import { useGetAllSuppliersQuery } from "@/redux/api/supplierApi";
import { Product } from "@/types/product";
import { Loader2, AlertCircle, Eye, Edit2 } from "lucide-react";

interface ProductFormProps {
  initialData?: Product;
  onSubmit: (data: any) => Promise<void>;
  isLoading: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  onSubmit,
  isLoading,
}) => {
  const [previewMode, setPreviewMode] = useState(false);
  const { data: categories } = useGetAllCategoriesQuery();
  const { data: brands } = useGetAllBrandsQuery();
  const { data: suppliers } = useGetAllSuppliersQuery();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm({
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      price: initialData?.price || 0,
      discountPrice: initialData?.discountPrice || 0,
      stock: initialData?.stock || 0,
      reorderLevel: initialData?.reorderLevel || 5,
      category: initialData?.category?._id || "",
      brand: initialData?.brand?._id || "",
      supplier: initialData?.supplier?._id || "",
      marketingTags: initialData?.marketingTags || [],
      thumbnail: initialData?.thumbnail || { url: "" },
      images: initialData?.images || [],
      variants: initialData?.variants || [],
    },
  });

  const [variants, setVariants] = useState(initialData?.variants || []);
  const [images, setImages] = useState(initialData?.images || []);
  const [thumbnail, setThumbnail] = useState(initialData?.thumbnail || { url: "" });
  const [selectedTags, setSelectedTags] = useState<string[]>(initialData?.marketingTags || []);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const marketingTagOptions = ["featured", "trending", "new", "hot"];

  // Manual validation function
  const validateForm = (data: any) => {
    const newErrors: Record<string, string> = {};

    if (!data.name || data.name.length < 3) {
      newErrors.name = "Product name must be at least 3 characters";
    } else if (data.name.length > 100) {
      newErrors.name = "Product name must not exceed 100 characters";
    }

    if (!data.description || data.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    } else if (data.description.length > 5000) {
      newErrors.description = "Description must not exceed 5000 characters";
    }

    if (!data.price || data.price <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    if (data.discountPrice && data.discountPrice > data.price) {
      newErrors.discountPrice = "Discount price cannot be greater than regular price";
    }

    if (data.stock === undefined || data.stock < 0) {
      newErrors.stock = "Stock must be at least 0";
    }

    if (images.length === 0) {
      newErrors.images = "At least one product image is required";
    }

    if (!thumbnail.url) {
      newErrors.thumbnail = "Thumbnail image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onFormSubmit = async (data: any) => {
    const finalData = {
      ...data,
      variants,
      images,
      thumbnail,
      marketingTags: selectedTags,
    };

    if (validateForm(finalData)) {
      await onSubmit(finalData);
    }
  };

  const toggleTag = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(newTags);
    setValue("marketingTags", newTags as any);
  };

  const watchedValues = watch();

  const getStockStatus = () => {
    const totalStock = variants.reduce((sum, v) => sum + v.stock, 0) + (watchedValues.stock || 0);
    if (totalStock === 0) return { status: "out of stock", color: "red", text: "Out of Stock" };
    if (totalStock < (watchedValues.reorderLevel || 5)) return { status: "low stock", color: "yellow", text: "Low Stock" };
    return { status: "in stock", color: "green", text: "In Stock" };
  };

  const stockInfo = getStockStatus();

  // Preview Mode
  if (previewMode) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center sticky top-0 bg-white z-10 pb-4 border-b">
          <h2 className="text-2xl font-bold">Product Preview</h2>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setPreviewMode(false)}>
              <Edit2 className="h-4 w-4 mr-2" />
              Back to Edit
            </Button>
            <Button onClick={handleSubmit(onFormSubmit)} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {initialData ? "Update Product" : "Create Product"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Images */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
              {thumbnail.url ? (
                <img
                  src={thumbnail.url}
                  alt={watchedValues.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  No thumbnail selected
                </div>
              )}
            </div>
            {images.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((img, idx) => (
                  <div key={idx} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">{watchedValues.name || "Product Name"}</h1>
              {watchedValues.category && categories?.find(c => c._id === watchedValues.category) && (
                <p className="text-sm text-gray-500 mt-1">
                  Category: {categories.find(c => c._id === watchedValues.category)?.name}
                </p>
              )}
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-primary">
                ${watchedValues.price?.toFixed(2) || "0.00"}
              </span>
              {watchedValues.discountPrice > 0 && (
                <span className="text-lg text-gray-400 line-through">
                  ${watchedValues.discountPrice.toFixed(2)}
                </span>
              )}
            </div>

            <div className="flex gap-2">
              <Badge className={`bg-${stockInfo.color}-500 text-white`}>
                {stockInfo.text}
              </Badge>
              {watchedValues.marketingTags?.map((tag: string) => (
                <Badge key={tag} variant="secondary" className="capitalize">
                  {tag}
                </Badge>
              ))}
            </div>

            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-gray-600 whitespace-pre-wrap">
                {watchedValues.description || "No description provided"}
              </p>
            </div>

            {watchedValues.brand && brands?.find(b => b._id === watchedValues.brand) && (
              <div>
                <h3 className="font-semibold mb-1">Brand</h3>
                <p className="text-gray-600">{brands.find(b => b._id === watchedValues.brand)?.name}</p>
              </div>
            )}

            {watchedValues.supplier && suppliers?.find(s => s._id === watchedValues.supplier) && (
              <div>
                <h3 className="font-semibold mb-1">Supplier</h3>
                <p className="text-gray-600">{suppliers.find(s => s._id === watchedValues.supplier)?.name}</p>
              </div>
            )}

            {variants.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Variants</h3>
                <div className="space-y-3">
                  {variants.map((variant, idx) => (
                    <div key={idx} className="border rounded-lg p-3">
                      <div className="flex gap-3">
                        {variant.image.url && (
                          <img src={variant.image.url} alt="" className="w-16 h-16 object-cover rounded" />
                        )}
                        <div className="flex-1">
                          <p className="font-medium">{variant.attributes.size} / {variant.attributes.color}</p>
                          <p className="text-sm text-gray-600">SKU: {variant.sku}</p>
                          <div className="flex gap-3 mt-1">
                            <span className="text-sm font-semibold">${variant.price}</span>
                            <span className="text-sm text-gray-500">Stock: {variant.stock}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total Stock:</span>
                <span className="font-semibold">
                  {variants.reduce((sum, v) => sum + v.stock, 0) + (watchedValues.stock || 0)} units
                </span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-gray-500">Reorder Level:</span>
                <span>{watchedValues.reorderLevel || 5} units</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Edit Mode
  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <Tabs defaultValue="basic" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5 lg:grid-cols-5">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="pricing">Pricing & Stock</TabsTrigger>
          <TabsTrigger value="variants">Variants</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="marketing">Marketing</TabsTrigger>
        </TabsList>

        {/* Basic Info Tab */}
        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  {...register("name")}
                  className={errors.name ? "border-red-500" : ""}
                  placeholder="Enter product name"
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  rows={6}
                  className={errors.description ? "border-red-500" : ""}
                  placeholder="Enter product description"
                />
                {errors.description && (
                  <p className="text-sm text-red-500 mt-1">{errors.description}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Category</Label>
                  <Select onValueChange={(value) => setValue("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {categories?.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Brand</Label>
                  <Select onValueChange={(value) => setValue("brand", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select brand" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {brands?.map((brand) => (
                        <SelectItem key={brand._id} value={brand._id}>
                          {brand.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Supplier</Label>
                <Select onValueChange={(value) => setValue("supplier", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {suppliers?.map((supplier) => (
                      <SelectItem key={supplier._id} value={supplier._id}>
                        {supplier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pricing & Stock Tab */}
        <TabsContent value="pricing" className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    {...register("price", { valueAsNumber: true })}
                    className={errors.price ? "border-red-500" : ""}
                    placeholder="0.00"
                  />
                  {errors.price && (
                    <p className="text-sm text-red-500 mt-1">{errors.price}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="discountPrice">Discount Price</Label>
                  <Input
                    id="discountPrice"
                    type="number"
                    step="0.01"
                    {...register("discountPrice", { valueAsNumber: true })}
                    className={errors.discountPrice ? "border-red-500" : ""}
                    placeholder="0.00"
                  />
                  {errors.discountPrice && (
                    <p className="text-sm text-red-500 mt-1">{errors.discountPrice}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="stock">Stock Quantity *</Label>
                  <Input
                    id="stock"
                    type="number"
                    {...register("stock", { valueAsNumber: true })}
                    className={errors.stock ? "border-red-500" : ""}
                    placeholder="0"
                  />
                  {errors.stock && (
                    <p className="text-sm text-red-500 mt-1">{errors.stock}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="reorderLevel">Reorder Level</Label>
                  <Input
                    id="reorderLevel"
                    type="number"
                    {...register("reorderLevel", { valueAsNumber: true })}
                    placeholder="5"
                  />
                </div>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Total Stock: {stockInfo.status} (
                  {variants.reduce((sum, v) => sum + v.stock, 0) + (watchedValues.stock || 0)} units)
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Variants Tab */}
        <TabsContent value="variants" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <ProductVariantManager
                variants={variants}
                onAddVariant={(variant) => {
                  setVariants([...variants, variant]);
                  setValue("variants", [...variants, variant]);
                }}
                onUpdateVariant={(index, variant) => {
                  const newVariants = [...variants];
                  newVariants[index] = variant;
                  setVariants(newVariants);
                  setValue("variants", newVariants);
                }}
                onRemoveVariant={(index) => {
                  const newVariants = variants.filter((_, i) => i !== index);
                  setVariants(newVariants);
                  setValue("variants", newVariants);
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Images Tab */}
        <TabsContent value="images" className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-6">
              <div>
                <Label>Thumbnail Image *</Label>
                <ImageUploader
                  onUpload={(url) => {
                    setThumbnail({ url });
                    setValue("thumbnail", { url });
                    if (errors.thumbnail) {
                      setErrors({ ...errors, thumbnail: "" });
                    }
                  }}
                  currentImage={thumbnail.url}
                />
                {errors.thumbnail && (
                  <p className="text-sm text-red-500 mt-1">{errors.thumbnail}</p>
                )}
              </div>

              <div>
                <Label>Product Images * (Max 10)</Label>
                <ImageUploader
                  multiple
                  onUpload={(urls) => {
                    const newImages = [...images, ...urls.map(url => ({ url }))].slice(0, 10);
                    setImages(newImages);
                    setValue("images", newImages);
                    if (errors.images) {
                      setErrors({ ...errors, images: "" });
                    }
                  }}
                  currentImages={images.map(img => img.url)}
                  onRemove={(index) => {
                    const newImages = images.filter((_, i) => i !== index);
                    setImages(newImages);
                    setValue("images", newImages);
                  }}
                />
                {errors.images && (
                  <p className="text-sm text-red-500 mt-1">{errors.images}</p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  {images.length}/10 images uploaded
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Marketing Tab */}
        <TabsContent value="marketing" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div>
                <Label>Marketing Tags</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {marketingTagOptions.map((tag) => (
                    <Badge
                      key={tag}
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      className="cursor-pointer capitalize"
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Select tags to highlight this product in your store
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Form Actions */}
      <div className="flex justify-between gap-2 pt-4 sticky bottom-0 bg-white py-4 border-t">
        <Button type="button" variant="outline" onClick={() => setPreviewMode(true)}>
          <Eye className="h-4 w-4 mr-2" />
          Preview Product
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? "Update Product" : "Create Product"}
        </Button>
      </div>
    </form>
  );
};