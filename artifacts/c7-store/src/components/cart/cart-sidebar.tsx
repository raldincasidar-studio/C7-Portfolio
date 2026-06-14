import React, { useState } from "react";
import { useCart } from "../../context/cart-context";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "../ui/sheet";
import { Button } from "../ui/button";
import { Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { CheckoutModal } from "./checkout-modal";

export function CartSidebar() {
  const { items, isCartOpen, setIsCartOpen, updateQuantity, removeItem, totalPrice } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  return (
    <>
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent className="w-full sm:max-w-md flex flex-col">
          <SheetHeader>
            <SheetTitle className="font-heading font-bold text-2xl flex items-center gap-2">
              <ShoppingBag className="h-6 w-6 text-primary" />
              Your Cart
            </SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto py-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-16">
                <ShoppingBag className="h-16 w-16 text-muted-foreground opacity-30" />
                <p className="text-lg font-medium text-muted-foreground">Your cart is empty</p>
                <Button variant="outline" onClick={() => setIsCartOpen(false)}>
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-3 border-b pb-4">
                    {/* Product Image */}
                    <div className="h-20 w-20 rounded-lg overflow-hidden bg-zinc-50 border flex-shrink-0 flex items-center justify-center p-1">
                      {item.product.imageUrl ? (
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="h-full w-full object-contain"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.display = "none";
                            (e.currentTarget.parentElement as HTMLElement).innerHTML =
                              '<div class="flex items-center justify-center w-full h-full"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-zinc-300"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg></div>';
                          }}
                        />
                      ) : (
                        <ShoppingBag className="h-8 w-8 text-zinc-300" />
                      )}
                    </div>

                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0">
                          <h4 className="font-semibold text-sm line-clamp-2 leading-tight">
                            {item.product.name}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {item.product.categoryName}
                          </p>
                        </div>
                        <p className="font-bold text-primary text-sm whitespace-nowrap">
                          ₱{(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border rounded-lg overflow-hidden">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-none hover:bg-zinc-100"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-7 text-center text-sm font-semibold">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-none hover:bg-zinc-100"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive hover:bg-destructive/10"
                          onClick={() => removeItem(item.product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <SheetFooter className="border-t pt-4 flex flex-col gap-3">
              <div className="flex justify-between items-center w-full">
                <span className="font-semibold text-base">
                  Total ({items.reduce((s, i) => s + i.quantity, 0)} items)
                </span>
                <span className="font-bold text-2xl text-primary">₱{totalPrice.toFixed(2)}</span>
              </div>
              <Button
                className="w-full text-base font-bold py-6"
                onClick={() => {
                  setIsCartOpen(false);
                  setIsCheckoutOpen(true);
                }}
              >
                Checkout Now
              </Button>
            </SheetFooter>
          )}
        </SheetContent>
      </Sheet>

      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
    </>
  );
}
