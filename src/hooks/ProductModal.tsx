// components/dashboard/products/ProductModal.tsx
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateProductMutation } from "@/redux/api/productApi";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [createProduct, { isLoading }] = useCreateProductMutation();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    thumbnail: { url: "" },
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = "Valid price is required";
    if (!formData.stock || parseInt(formData.stock) < 0) newErrors.stock = "Valid stock is required";
    if (!formData.thumbnail.url) newErrors.thumbnail = "Thumbnail is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    try {
      await createProduct({
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        discountPrice: 0,
        reorderLevel: 5,
        thumbnail: formData.thumbnail,
        images: [],
        variants: [],
        marketingTags: [],
      }).unwrap();
      
      toast({
        title: "Success",
        description: "Product created successfully",
      });
      
      onSuccess();
      onClose();
      setFormData({ name: "", description: "", price: "", stock: "", thumbnail: { url: "" } });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create product",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Product</DialogTitle>
          <DialogDescription>
            Add a new product to your inventory. You can add variants later.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
          </div>
          
          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className={errors.price ? "border-red-500" : ""}
              />
              {errors.price && <p className="text-sm text-red-500 mt-1">{errors.price}</p>}
            </div>
            
            <div>
              <Label htmlFor="stock">Stock *</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className={errors.stock ? "border-red-500" : ""}
              />
              {errors.stock && <p className="text-sm text-red-500 mt-1">{errors.stock}</p>}
            </div>
          </div>
          
          <div>
            <Label htmlFor="thumbnail">Thumbnail URL *</Label>
            <Input
              id="thumbnail"
              value={formData.thumbnail.url}
              onChange={(e) => setFormData({ ...formData, thumbnail: { url: e.target.value } })}
              placeholder="https://example.com/image.jpg"
              className={errors.thumbnail ? "border-red-500" : ""}
            />
            {errors.thumbnail && <p className="text-sm text-red-500 mt-1">{errors.thumbnail}</p>}
            {formData.thumbnail.url && (
              <div className="mt-2">
                <img src={formData.thumbnail.url} alt="Preview" className="w-24 h-24 object-cover rounded" />
              </div>
            )}
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Product
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};