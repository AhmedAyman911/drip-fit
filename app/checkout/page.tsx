'use client';

import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { useCreateOrder } from '@/hooks/useOrders';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useActionState, useEffect } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';

import { useSession } from 'next-auth/react';

type FormState = {
  errors?: {
    shippingAddress?: string[];
    city?: string[];
    state?: string[];
    postalCode?: string[];
    country?: string[];
    phoneNumber?: string[];
    general?: string[];
  };
  success?: boolean;
};

export default function CheckoutPage() {
  const router = useRouter();
  const cart = useCartStore((state) => state.cart);
  const clearCart = useCartStore((state) => state.clearCart);
  const totalPrice = useCartStore((state) => state.totalPrice);
  const createOrderMutation = useCreateOrder();

  useEffect(() => {
    if (cart.length === 0) {
      router.push('/');
    }
  }, [cart, router]);

  const { data: session, status } = useSession();

  const handleSubmit = async (prevState: FormState, formData: FormData): Promise<FormState> => {
    const shippingAddress = formData.get('shippingAddress') as string;
    const city = formData.get('city') as string;
    const state = formData.get('state') as string;
    const postalCode = formData.get('postalCode') as string;
    const country = formData.get('country') as string;
    const phoneNumber = formData.get('phoneNumber') as string;

    // Validation
    const errors: FormState['errors'] = {};

    if (!shippingAddress?.trim()) {
      errors.shippingAddress = ['Shipping address is required'];
    }
    if (!city?.trim()) {
      errors.city = ['City is required'];
    }
    if (!postalCode?.trim()) {
      errors.postalCode = ['Postal code is required'];
    }
    if (!country?.trim()) {
      errors.country = ['Country is required'];
    }
    if (!phoneNumber?.trim()) {
      errors.phoneNumber = ['Phone number is required'];
    }

    if (Object.keys(errors).length > 0) {
      return { errors };
    }

    try {
      const orderData = {
        items: cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
        address: {
          shippingAddress,
          city,
          state: state || undefined,
          postalCode,
          country,
          phoneNumber,
        },
      };

      const order = await createOrderMutation.mutateAsync(orderData);
      clearCart();
      toast.success('Order placed successfully')
      router.push(`/`);

      return { success: true };
    } catch (err) {
      toast.warning('Failed to place order')
      return {
        errors: {
          general: [err instanceof Error ? err.message : 'Failed to place order'],
        },
      };
    }
  };

  const [state, formAction, isPending] = useActionState(handleSubmit, {});

  if (cart.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-gray-200 dark:bg-gray-950 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-6">Shipping Information</h2>

              <form action={formAction} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="shippingAddress">
                    Street Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="shippingAddress"
                    name="shippingAddress"
                    placeholder="123 Main St, Apt 4B"
                    required
                  />
                  {state?.errors?.shippingAddress && (
                    <p className="text-sm text-red-600">
                      {state.errors.shippingAddress[0]}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">
                      City <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="city"
                      name="city"
                      placeholder="New York"
                      required
                    />
                    {state?.errors?.city && (
                      <p className="text-sm text-red-600">
                        {state.errors.city[0]}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State/Province</Label>
                    <Input
                      id="state"
                      name="state"
                      placeholder="NY"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">
                      Postal Code <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="postalCode"
                      name="postalCode"
                      placeholder="10001"
                      required
                    />
                    {state?.errors?.postalCode && (
                      <p className="text-sm text-red-600">
                        {state.errors.postalCode[0]}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">
                      Country <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="country"
                      name="country"
                      placeholder="United States"
                      required
                    />
                    {state?.errors?.country && (
                      <p className="text-sm text-red-600">
                        {state.errors.country[0]}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">
                    Phone Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    required
                  />
                  {state?.errors?.phoneNumber && (
                    <p className="text-sm text-red-600">
                      {state.errors.phoneNumber[0]}
                    </p>
                  )}
                </div>

                {(state?.errors?.general && !session?.user )&& (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">
                      Please login first to place an order
                    </p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isPending || createOrderMutation.isPending}
                >
                  {isPending || createOrderMutation.isPending
                    ? 'Processing...'
                    : 'Place Order'}
                </Button>
              </form>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-950 rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div
                    key={`${item.id}-${item.selectedColor}-${item.selectedSize}`}
                    className="flex gap-3"
                  >
                    {item.imgSrc && item.imgSrc[0] && (
                      <Image
                        src={item.imgSrc[0]}
                        alt={item.title}
                        width={120}
                        height={120}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.title}</p>
                      <p className="text-xs text-gray-500">
                        {item.selectedColor} / {item.selectedSize}
                      </p>
                      <p className="text-sm">
                        Qty: {item.quantity} × ${(item.salePrice ?? item.price).toFixed(2)}
                      </p>
                    </div>
                    <p className="font-semibold">
                      ${((item.salePrice ?? item.price) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${totalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>FREE</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${totalPrice().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}