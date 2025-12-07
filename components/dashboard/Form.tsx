'use client'

import { useState } from 'react';
import { useForm, useFieldArray, useWatch, type Resolver, type FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Trash2, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import Image from 'next/image';
import { toast } from 'sonner';
import { useCreateProduct, useUpdateProduct } from '@/hooks/useProducts';

import { uploadImagesToCloudinary } from '@/lib/uploadToCloudinary';

import { Item } from '@/types/ItemTypes';



const variantSchema = z.object({
  color: z.string().min(1, 'Color is required'),
  size: z.string().min(1, 'Size is required'),
  sku: z.string().min(1, 'SKU is required'),
  stock: z.coerce.number().min(0),
  price: z.number().optional(),
  salePrice: z.number().optional(),
  id: z.coerce.string().optional()
});

const productSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  price: z.coerce.number().min(0),
  salePrice: z.number().optional(),
  category: z.string().min(1),
  gender: z.enum(["male", "female", "unisex"]),
  isOnSale: z.boolean(),
  variants: z.array(variantSchema).min(1),
});

type ProductFormData = z.infer<typeof productSchema>;

interface Tprop {
  isEdit: boolean
  product?: Item
  onSuccess?: () => void
}


export default function ProductForm({ isEdit, product, onSuccess }: Tprop) {

  const [existingImages, setExistingImages] = useState<string[]>(isEdit && product?.imgSrc ? product.imgSrc : []);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>(isEdit && product?.imgSrc ? product.imgSrc : []);
  const createProductMutation = useCreateProduct();

  const editProductMutation = useUpdateProduct(product?.id||'');


  const defaultValues: ProductFormData = {
    title: isEdit && product ? product.title : "",
    price: isEdit && product ? product.price : 0,
    category: isEdit && product ? product.category : "",
    gender: isEdit && product ? product.gender : "unisex",
    isOnSale: isEdit && product ? product.isOnSale : false,
    salePrice: isEdit && product ? product.salePrice : undefined,
    description: isEdit && product ? product.description : "",
    variants: isEdit && product
      ? product.variants
      : [
        {
          color: "",
          size: "",
          sku: "",
          stock: 0,
          price: undefined,
          salePrice: undefined,
        },
      ],
  };

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema) as Resolver<ProductFormData, FieldValues>,
    defaultValues,
  });



  const { fields, append, remove } = useFieldArray({
    control,
    name: 'variants',
  });

  const isOnSale = useWatch({
    control,
    name: "isOnSale",
  });


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    setImages(prev => [...prev, ...files]);

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    const existingCount = existingImages.length;

    if (index < existingCount) {
      setExistingImages(prev => prev.filter((_, i) => i !== index));
    } else {
      const newImageIndex = index - existingCount;
      setImages(prev => prev.filter((_, i) => i !== newImageIndex));
    }

    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ProductFormData) => {
    try {

      let imageUrls: string[] = [];

      if (images.length > 0) {
        toast.info('Uploading images...');
        imageUrls = await uploadImagesToCloudinary(images);
      }

      const productData = {
        title: data.title,
        description: data.description,
        price: data.price,
        salePrice: data.salePrice,
        category: data.category,
        imgSrc: imageUrls,
        isOnSale: data.isOnSale ?? false,
        gender: data.gender,
        variants: data.variants.map(v => ({
          color: v.color,
          size: v.size,
          sku: v.sku,
          stock: v.stock,
          price: v.price,
          salePrice: v.salePrice,
        })),
      };

      await createProductMutation.mutateAsync(productData);
      toast.success('Product created successfully!');
      onSuccess?.();
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Failed to create product. Please try again.');
    }
  };

  const onEdit = async (data: ProductFormData) => {
    try {
      let uploadedUrls: string[] = [];

      if (images.length > 0) {
        toast.info('Uploading images...');
        uploadedUrls = await uploadImagesToCloudinary(images);
        setImages([]);
        const updatedExisting = [...existingImages, ...uploadedUrls];
        setExistingImages(updatedExisting);
      }
      const finalImageUrls = [...existingImages, ...uploadedUrls];

      const existingVariants = data.variants
        .filter(v => v.id && v.id.trim() !== '')
        .map(v => ({
          id: v.id!,
          productId: product ? product.id : '',
          color: v.color,
          size: v.size,
          sku: v.sku,
          stock: v.stock,
          price: v.price,
          salePrice: v.salePrice,
        }));


      const newVariants = data.variants
        .filter(v => !v.id || v.id.trim() === '')
        .map(v => ({
          productId: product ? product.id : '',
          color: v.color,
          size: v.size,
          sku: v.sku,
          stock: v.stock,
          price: v.price,
          salePrice: v.salePrice,
        }));

      console.log('Existing variants:', existingVariants);
      console.log('New variants:', newVariants);

      const productData = {
        id: product ? product.id : '',
        title: data.title,
        description: data.description,
        price: data.price,
        salePrice: data.salePrice,
        category: data.category,
        imgSrc: finalImageUrls,
        isOnSale: data.isOnSale ?? false,
        gender: data.gender,
        existingVariants,
        newVariants,
      };

      await editProductMutation.mutateAsync(productData);
      toast.success('Product updated successfully!');
      onSuccess?.();
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          {isEdit ?
            <CardTitle className="text-2xl">Edit Product</CardTitle>
            :
            <CardTitle className="text-2xl">Add New Product</CardTitle>
          }
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>

              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input id="title" {...register('title')} />
                {errors.title && (
                  <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" {...register('description')} rows={4} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Input id="category" {...register('category')} placeholder="e.g., Shoes, Shirts" />
                  {errors.category && (
                    <p className="text-sm text-red-500 mt-1">{errors.category.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    defaultValue={isEdit && product ? product.gender : ''}
                    onValueChange={(value) => setValue('gender', value as 'male' | 'female' | 'unisex')}
                  >
                    <SelectTrigger className='lg:w-[390px]'>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unisex">Unisex</SelectItem>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isOnSale"
                  defaultChecked={isEdit && product ? product.isOnSale : false}
                  onCheckedChange={(checked) => setValue('isOnSale', checked as boolean)}
                />
                <Label htmlFor="isOnSale" className="cursor-pointer">Is on sale</Label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    {...register('price', { valueAsNumber: true })}
                  />
                  {errors.price && (
                    <p className="text-sm text-red-500 mt-1">{errors.price.message}</p>
                  )}
                </div>

                {isOnSale && (
                  <div className="space-y-2">
                    <Label htmlFor="salePrice">Sale Price</Label>
                    <Input
                      id="salePrice"
                      type="number"
                      step="0.01"
                      {...register('salePrice', {
                        setValueAs: (v) => v === '' ? undefined : parseFloat(v)
                      })}
                    />
                    {errors.salePrice && (
                      <p className="text-sm text-red-500 mt-1">{errors.salePrice.message}</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Product Images</h3>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <input
                  type="file"
                  id="images"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label
                  htmlFor="images"
                  className="flex flex-col items-center justify-center cursor-pointer"
                >
                  <Upload className="w-12 h-12 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">Click to upload images</span>
                  <span className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</span>
                </label>
              </div>

              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-4 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <Image
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        width={200}
                        height={128}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Product Variants</h3>
                <Button
                  type="button"
                  onClick={() => append({ color: '', size: '', sku: '', stock: 0, price: undefined, salePrice: undefined })}
                  size="sm"
                  variant="outline"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Variant
                </Button>
              </div>

              {errors.variants && typeof errors.variants.message === 'string' && (
                <p className="text-sm text-red-500">{errors.variants.message}</p>
              )}

              <div className="space-y-4">
                {fields.map((field, index) => (
                  <Card key={field.id}>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium">Variant {index + 1}</h4>
                          {fields.length > 1 && (
                            <Button
                              type="button"
                              onClick={() => remove(index)}
                              size="sm"
                              variant="ghost"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Color *</Label>
                            <Input {...register(`variants.${index}.color`)} />
                            {errors.variants?.[index]?.color && (
                              <p className="text-sm text-red-500 mt-1">
                                {errors.variants[index]?.color?.message}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label>Size *</Label>
                            <Input {...register(`variants.${index}.size`)} />
                            {errors.variants?.[index]?.size && (
                              <p className="text-sm text-red-500 mt-1">
                                {errors.variants[index]?.size?.message}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label>SKU *</Label>
                            <Input {...register(`variants.${index}.sku`)} />
                            {errors.variants?.[index]?.sku && (
                              <p className="text-sm text-red-500 mt-1">
                                {errors.variants[index]?.sku?.message}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label>Stock</Label>
                            <Input
                              type="number"
                              {...register(`variants.${index}.stock`, { valueAsNumber: true })}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Variant Price (optional)</Label>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="Optional"
                              {...register(`variants.${index}.price`, {
                                setValueAs: (v) => {
                                  if (v === '' || v === null || v === undefined) return undefined;
                                  const num = parseFloat(v);
                                  return isNaN(num) ? undefined : num;
                                }
                              })}
                            />
                          </div>

                          {isOnSale && (
                            <div className="space-y-2">
                              <Label>Variant Sale Price (optional)</Label>
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="Optional"
                                {...register(`variants.${index}.salePrice`, {
                                  setValueAs: (v) => {
                                    if (v === '' || v === null || v === undefined) return undefined;
                                    const num = parseFloat(v);
                                    return isNaN(num) ? undefined : num;
                                  }
                                })}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {isEdit ?
              <Button onClick={handleSubmit(onEdit)} disabled={editProductMutation.isPending} className="w-full" size="lg">
                {editProductMutation.isPending ? 'Updating...' : 'Edit Product'}
              </Button>
              :
              <Button onClick={handleSubmit(onSubmit)} disabled={createProductMutation.isPending} className="w-full" size="lg">
                {createProductMutation.isPending ? 'Creating...' : 'Create Product'}
              </Button>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}