"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/cart-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { submitOrder } from '@/lib/api'

interface CheckoutClientProps {
  restaurantId: string
  tableId: string
}

export default function CheckoutClient({ restaurantId, tableId }: CheckoutClientProps) {
  const { items, total, removeItem, updateQuantity, clearCart } = useCart();
  const [step, setStep] = useState<"form" | "review" | "success">("form");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      toast.error("Please provide your name and phone number.");
      return;
    }
    setStep("review");
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      await submitOrder({
        restaurantId,
        tableId,
        customerName: name,
        customerPhone: phone,
        items: items.map(item => ({
          menuItemId: item.id,
          quantity: item.quantity
        }))
      });
      clearCart();
      setStep("success");
    } catch {
      toast.error("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (step === "form") {
    return (
      <div className="max-w-md mx-auto py-8">
        <h2 className="text-2xl font-bold mb-4">Enter your details</h2>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <Input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
          <Input placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} />
          <Button type="submit" className="w-full">Continue to Review</Button>
        </form>
      </div>
    );
  }

  if (step === "review") {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <h2 className="text-2xl font-bold mb-4">Review Your Cart</h2>
        <div className="space-y-4 mb-6">
          {items.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            items.map(item => (
              <div key={item.id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">{item.quantity} x ${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</Button>
                  <span>{item.quantity}</span>
                  <Button size="sm" variant="outline" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</Button>
                  <Button size="sm" variant="destructive" onClick={() => removeItem(item.id)}>Remove</Button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="flex justify-between items-center mb-4">
          <span className="font-bold">Total</span>
          <span className="font-bold">${total.toFixed(2)}</span>
        </div>
        <Button className="w-full" onClick={handlePlaceOrder} disabled={items.length === 0 || loading}>
          {loading ? "Placing Order..." : "Place Order"}
        </Button>
      </div>
    );
  }

  if (step === "success") {
    return (
      <div className="max-w-md mx-auto py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Order Placed!</h2>
        <p className="mb-4">Thank you, {name}! Your order has been placed and will be prepared soon.</p>
        <Button onClick={() => router.push(`/${restaurantId}/${tableId}`)}>Back to Menu</Button>
      </div>
    );
  }

  return null;
} 