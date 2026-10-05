import React from 'react';
import { CartItem } from '../types';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onRemoveItem,
  onCheckout,
}) => {
  if (!isOpen) return null;

  const totalAmount = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-black/60 flex justify-end"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white dark:bg-[#14171d] h-full shadow-2xl border-l border-neutral-200 dark:border-neutral-800 flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-red-600" />
            <h2 className="text-base font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
              Customization Order Cart ({cartItems.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Items List */}
        <div className="p-6 flex-grow overflow-y-auto space-y-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-400 flex items-center justify-center mx-auto">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                Your customization order cart is empty
              </p>
              <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                Select custom apparel, banners, workwear, or business cards from the catalog to configure specifications.
              </p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 space-y-3 text-xs"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-red-600">
                      {item.category}
                    </span>
                    <h4 className="text-sm font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
                      {item.title}
                    </h4>
                  </div>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="text-neutral-400 hover:text-red-600 transition-colors p-1"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Selected Variations Breakdown */}
                <div className="space-y-1 text-neutral-600 dark:text-neutral-400 text-[11px] border-l-2 border-red-600 pl-2">
                  {Object.entries(item.selectedVariations).map(([k, v]) => (
                    <div key={k}>
                      <span className="font-semibold text-neutral-700 dark:text-neutral-300">{k}:</span> {v}
                    </div>
                  ))}
                  {item.customInstructions && (
                    <div className="pt-0.5 text-neutral-500 italic">
                      "{item.customInstructions}"
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                  <span className="text-neutral-500">
                    {item.quantity} units @ ${item.unitPrice}/ea
                  </span>
                  <span className="font-mono font-bold text-sm text-neutral-900 dark:text-neutral-100">
                    ${item.totalPrice.toLocaleString()} USD
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer Checkout */}
        {cartItems.length > 0 && (
          <div className="p-6 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 space-y-4">
            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between text-neutral-500">
                <span>Production Subtotal:</span>
                <span className="font-mono text-neutral-800 dark:text-neutral-200 font-semibold">
                  ${totalAmount.toLocaleString()} USD
                </span>
              </div>
              <div className="flex items-center justify-between text-neutral-500">
                <span>Digital Artwork Proofing:</span>
                <span className="text-emerald-600 font-semibold">Included Free</span>
              </div>
              <div className="flex items-center justify-between text-sm font-bold pt-2 border-t border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100">
                <span>Estimated Total:</span>
                <span className="font-mono text-base text-red-600 dark:text-red-500">
                  ${totalAmount.toLocaleString()} USD
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-1.5 text-[11px] text-neutral-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Orders bill to your central Paperglow account with proof approval before printing.</span>
            </div>

            <button
              onClick={onCheckout}
              className="w-full py-3 rounded-lg text-xs font-bold bg-red-600 hover:bg-red-700 text-white transition-colors flex items-center justify-center space-x-2 shadow-xs cursor-pointer"
            >
              <span>Submit Order to Paperglow Account</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
