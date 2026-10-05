import React, { useState } from 'react';
import { BrandingItem } from '../types';
import { X, Check, Clock, Package, CheckCircle2, ArrowRight } from 'lucide-react';

interface BrandingModalProps {
  item: BrandingItem | null;
  onClose: () => void;
  onInquirySubmitted: (itemName: string) => void;
}

export const BrandingModal: React.FC<BrandingModalProps> = ({
  item,
  onClose,
  onInquirySubmitted,
}) => {
  const [quantity, setQuantity] = useState('50');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!item) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      onInquirySubmitted(item.title);
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-[#14171d] rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-neutral-200 dark:border-neutral-800 flex items-start justify-between">
          <div className="space-y-1 pr-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-red-600 dark:text-red-500">
              {item.category}
            </span>
            <h2 className="text-2xl font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
              {item.title}
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Starting at {item.startingPrice} • Min Order: {item.minOrder}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6">
          <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
            {item.description}
          </p>

          <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 text-xs">
            <div className="flex items-center space-x-2">
              <Package className="w-4 h-4 text-red-600" />
              <div>
                <span className="font-semibold block text-neutral-800 dark:text-neutral-200">Materials:</span>
                <span className="text-neutral-500">{item.materials}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-red-600" />
              <div>
                <span className="font-semibold block text-neutral-800 dark:text-neutral-200">Production Turnaround:</span>
                <span className="text-neutral-500">{item.turnaround}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Quality &amp; Production Standards
            </h3>
            <div className="space-y-1.5">
              {item.specs.map((spec, i) => (
                <div key={i} className="flex items-center space-x-2 text-xs text-neutral-700 dark:text-neutral-300">
                  <Check className="w-3.5 h-3.5 text-red-600 shrink-0" />
                  <span>{spec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Inquiry Form */}
          <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
            {submitted ? (
              <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 flex items-center space-x-3 text-emerald-800 dark:text-emerald-200 text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Customization order inquiry received! Our production team will contact you shortly.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
                  Request Custom Quote for {item.title}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-neutral-500 block mb-1">Target Quantity</label>
                    <input
                      type="text"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder="e.g. 50 units"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-1 focus:ring-red-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs text-neutral-500 block mb-1">Color / Sizing / Custom Notes</label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Black with front chest embroidery"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-1 focus:ring-red-600"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg text-xs font-semibold bg-red-600 hover:bg-red-700 text-white flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <span>Submit Custom Quote Request</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
