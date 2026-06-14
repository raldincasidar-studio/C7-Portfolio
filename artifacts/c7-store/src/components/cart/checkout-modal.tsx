import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCart } from "../../context/cart-context";
import { useCreateOrder, useListLocations } from "@workspace/api-client-react";
import { Loader2, CheckCircle2, Phone, MapPin, Package } from "lucide-react";

const checkoutSchema = z.object({
  customerName: z.string().min(2, "Name is required"),
  customerEmail: z.string().email("Invalid email"),
  customerPhone: z.string().min(7, "Phone number is required"),
  locationId: z.coerce.number().min(1, "Please select a pickup location"),
  notes: z.string().optional(),
});

interface OrderConfirmation {
  orderId: number;
  customerName: string;
  customerPhone: string;
  locationName: string;
  total: number;
  itemCount: number;
}

export function CheckoutModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { items, totalPrice, clearCart } = useCart();
  const { data: locations } = useListLocations();
  const { mutate: createOrder, isPending } = useCreateOrder();
  const [confirmation, setConfirmation] = useState<OrderConfirmation | null>(null);

  const form = useForm<z.infer<typeof checkoutSchema>>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      locationId: 0,
      notes: "",
    },
  });

  const handleClose = () => {
    setConfirmation(null);
    form.reset();
    onClose();
  };

  const onSubmit = (data: z.infer<typeof checkoutSchema>) => {
    const selectedLocation = locations?.find((l) => l.id === Number(data.locationId));

    createOrder(
      {
        data: {
          ...data,
          items: items.map((item) => ({ productId: item.product.id, quantity: item.quantity })),
        },
      },
      {
        onSuccess: (order) => {
          setConfirmation({
            orderId: order.id,
            customerName: data.customerName,
            customerPhone: data.customerPhone,
            locationName: selectedLocation?.name ?? "your chosen branch",
            total: order.total,
            itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
          });
          clearCart();
          form.reset();
        },
        onError: () => {
          form.setError("root", {
            message: "There was a problem placing your order. Please try again.",
          });
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        {confirmation ? (
          /* ── Order Confirmation Screen ── */
          <div className="py-4 text-center space-y-6">
            <div className="flex justify-center">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="h-12 w-12 text-primary" />
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
                Order Placed!
              </h2>
              <p className="text-muted-foreground text-sm">
                Order #{String(confirmation.orderId).padStart(4, "0")}
              </p>
            </div>

            <div className="bg-zinc-50 rounded-xl p-5 space-y-4 text-left">
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-sm">We'll call you to confirm</p>
                  <p className="text-muted-foreground text-sm mt-0.5">
                    Our team will contact you at{" "}
                    <span className="font-bold text-foreground">{confirmation.customerPhone}</span>{" "}
                    shortly to confirm your order and discuss pickup details.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-sm">Pickup Branch</p>
                  <p className="text-muted-foreground text-sm mt-0.5">
                    {confirmation.locationName} — Open 24/7
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Package className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-sm">Order Summary</p>
                  <p className="text-muted-foreground text-sm mt-0.5">
                    {confirmation.itemCount} item{confirmation.itemCount !== 1 ? "s" : ""} •{" "}
                    <span className="font-bold text-foreground">
                      ₱{confirmation.total.toFixed(2)}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <p className="text-xs text-muted-foreground px-4">
              Hi {confirmation.customerName}! Thank you for choosing C7 Convenience Store.
              Please keep your phone line open — we'll reach out to confirm your order within the hour.
            </p>

            <Button className="w-full font-bold" onClick={handleClose}>
              Done
            </Button>
          </div>
        ) : (
          /* ── Checkout Form ── */
          <>
            <DialogHeader>
              <DialogTitle className="font-heading text-2xl">Complete Your Order</DialogTitle>
              <DialogDescription>
                Enter your details to place your order for pickup. Total:{" "}
                <strong className="text-primary">₱{totalPrice.toFixed(2)}</strong>
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-2">
                <FormField
                  control={form.control}
                  name="customerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Juan dela Cruz" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="customerEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="juan@example.com" type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="customerPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="09171234567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="locationId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pickup Branch</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value ? field.value.toString() : ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a C7 branch..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {locations?.map((loc) => (
                            <SelectItem key={loc.id} value={loc.id.toString()}>
                              {loc.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Order Notes (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Any special requests?" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.formState.errors.root && (
                  <p className="text-sm text-destructive text-center">
                    {form.formState.errors.root.message}
                  </p>
                )}

                <div className="pt-4 flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={handleClose} disabled={isPending}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isPending || items.length === 0}>
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Place Order (₱{totalPrice.toFixed(2)})
                  </Button>
                </div>
              </form>
            </Form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
