import React, { useState, useEffect } from 'react';
import { BrandingProduct, CartItem } from '../types';
import {
  X,
  Check,
  Package,
  Clock,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  UploadCloud,
  Layers,
  CheckCircle2,
  Tag,
} from 'lucide-react';

interface ProductConfiguratorModalProps {
  product: BrandingProduct | null;
  onClose: () => void;
  onAddToCart: (item: CartItem) => void;
}

export const ProductConfiguratorModal: React.FC<ProductConfiguratorModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  if (!product) return null;

  // Selected variations state
  const [selectedVariations, setSelectedVariations] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState<number>(product.minOrder);
  const [customInstructions, setCustomInstructions] = useState('');
  const [artworkFileName, setArtworkFileName] = useState<string>('');
  const [addedSuccess, setAddedSuccess] = useState(false);

  // Initialize default variations
  useEffect(() => {
    if (product) {
      const initial: Record<string, string> = {};
      product.variations.forEach((v) => {
        initial[v.name] = v.defaultOption || v.options[0];
      });
      setSelectedVariations(initial);
      setQuantity(product.minOrder);
      setCustomInstructions('');
      setArtworkFileName('');
      setAddedSuccess(false);
    }
  }, [product]);

  // Compute bulk discount based on quantity
  const matchedDiscount = [...product.bulkDiscounts]
    .reverse()
    .find((tier) => quantity >= tier.minQty);

  const discountPercent = matchedDiscount ? matchedDiscount.discountPercent : 0;
  const unitPrice = Math.round(product.basePrice * (1 - discountPercent / 100));
  const subtotal = unitPrice * quantity;

  const handleVariationChange = (name: string, value: string) => {
    setSelectedVariations((prev) => ({ ...prev, [name]: value }));
  };

  const handleSimulateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setArtworkFileName(e.target.files[0].name);
    }
  };

  const handleAddToCart = (e: React.FormEvent) => {
    e.preventDefault();
    const cartItem: CartItem = {
      id: `cart_${Date.now()}`,
      productId: product.id,
      title: product.title,
      category: product.category,
      unitPrice,
      quantity,
      selectedVariations,
      customInstructions: `${artworkFileName ? `Artwork: ${artworkFileName} · ` : ''}${customInstructions || 'Standard placement'}`,
      totalPrice: subtotal,
      addedAt: new Date().toLocaleTimeString(),
    };

    onAddToCart(cartItem);
    setAddedSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-white dark:bg-[#14171d] rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-500">
                {product.category}
              </span>
              <span className="text-neutral-300 dark:text-neutral-700">•</span>
              <span className="text-xs text-neutral-500">Min Order: {product.minOrder} units</span>
            </div>
            <h2 className="text-2xl font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100 mt-0.5">
              {product.title}
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">{product.tagline}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleAddToCart} className="p-6 sm:p-8 max-h-[72vh] overflow-y-auto space-y-6">
          {/* Overview & Materials */}
          <div className="space-y-3">
            <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
              {product.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-lg bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 text-xs">
              <div className="flex items-start space-x-2">
                <Package className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-neutral-800 dark:text-neutral-200">Materials:</span>
                  <span className="text-neutral-500 text-[11px]">{product.materials}</span>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Clock className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-neutral-800 dark:text-neutral-200">Standard Production:</span>
                  <span className="text-neutral-500 text-[11px]">{product.turnaround}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Variations */}
          <div className="space-y-4 pt-2 border-t border-neutral-100 dark:border-neutral-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-100 font-['Poppins']">
              1. Select Variations &amp; Finishes
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {product.variations.map((v) => (
                <div key={v.name} className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block">
                    {v.name}
                  </label>
                  <select
                    value={selectedVariations[v.name] || v.defaultOption}
                    onChange={(e) => handleVariationChange(v.name, e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-red-600"
                  >
                    {v.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Customization Instructions & Artwork */}
          <div className="space-y-3 pt-2 border-t border-neutral-100 dark:border-neutral-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-100 font-['Poppins']">
              2. Customization &amp; Artwork Instructions
            </h3>

            <div>
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                Upload Vector Artwork / Logo (PDF, AI, SVG, PNG)
              </label>
              <div className="p-4 rounded-lg border border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900/40 text-center relative hover:border-red-600 transition-colors">
                <input
                  type="file"
                  onChange={handleSimulateUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  accept=".png,.jpg,.jpeg,.svg,.pdf,.ai,.eps"
                />
                <div className="flex flex-col items-center justify-center space-y-1 text-xs">
                  <UploadCloud className="w-5 h-5 text-red-600" />
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                    {artworkFileName ? artworkFileName : 'Click or drag file to attach logo artwork'}
                  </span>
                  <span className="text-[10px] text-neutral-400">
                    High-res vector or 300+ DPI recommended. Free proof included before production.
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                Placement Details, Sizing Breakdown, or Specific Notes
              </label>
              <textarea
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                placeholder="e.g. 10 Medium, 20 Large, 10 XL. Left chest embroidery in white thread. Back neck tag print with our company URL."
                rows={2}
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-red-600"
              />
            </div>
          </div>

          {/* Quantity & Tiered Pricing Matrix */}
          <div className="space-y-3 pt-2 border-t border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-100 font-['Poppins']">
                3. Quantity &amp; Volume Pricing
              </h3>
              {discountPercent > 0 && (
                <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" />
                  <span>{discountPercent}% Volume Discount Applied</span>
                </span>
              )}
            </div>

            {/* Quantity Slider / Stepper */}
            <div className="flex items-center space-x-3">
              <div className="w-36">
                <label className="text-[11px] text-neutral-500 block mb-1">Total Units</label>
                <input
                  type="number"
                  min={product.minOrder}
                  max={5000}
                  step={product.minOrder >= 25 ? 5 : 1}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(product.minOrder, parseInt(e.target.value) || product.minOrder))}
                  className="w-full px-3 py-2 text-xs font-mono font-bold rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-red-600"
                  required
                />
              </div>

              {/* Volume discount tiers chips */}
              <div className="flex-1 flex flex-wrap gap-1.5 pt-4">
                {product.bulkDiscounts.map((tier) => (
                  <button
                    key={tier.minQty}
                    type="button"
                    onClick={() => setQuantity(tier.minQty)}
                    className={`px-2.5 py-1 rounded text-[10px] font-semibold transition-colors ${
                      quantity >= tier.minQty
                        ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200'
                    }`}
                  >
                    {tier.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Pricing Summary Footer Inside Form */}
          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xs text-neutral-500">Calculated Order Total:</div>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold font-mono text-neutral-900 dark:text-neutral-100">
                  ${subtotal.toLocaleString()} USD
                </span>
                <span className="text-xs text-neutral-500 font-mono">
                  (${unitPrice} / unit · {quantity} units)
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={addedSuccess}
              className={`w-full sm:w-auto px-6 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center space-x-2 transition-all shadow-xs ${
                addedSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-red-600 hover:bg-red-700 text-white cursor-pointer'
              }`}
            >
              {addedSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Added to Order Cart!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Customization Order</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
