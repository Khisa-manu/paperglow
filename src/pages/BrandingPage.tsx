import React, { useState, useMemo } from 'react';
import { BRANDING_PRODUCTS } from '../data/paperglowData';
import { BrandingProduct, ProductVariation } from '../types';
import {
  Search,
  Filter,
  Package,
  Clock,
  Shirt,
  Sparkle,
  Crown,
  Briefcase,
  Shield,
  CreditCard,
  Image,
  Flag,
  PenTool,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
} from 'lucide-react';

interface BrandingPageProps {
  cartCount: number;
  onOpenCart: () => void;
  onSelectProduct: (product: BrandingProduct) => void;
  onNavigateHome: () => void;
}

export const BrandingPage: React.FC<BrandingPageProps> = ({
  cartCount,
  onOpenCart,
  onSelectProduct,
  onNavigateHome,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    'All',
    'Custom Apparel',
    'Workwear & Uniforms',
    'Signage & Displays',
    'Print Collateral',
    'Creative Design',
    'Merchandise & Swag',
  ];

  const getProductIcon = (iconName: string) => {
    switch (iconName) {
      case 'Shirt':
        return <Shirt className="w-5 h-5 text-red-600" />;
      case 'Sparkle':
        return <Sparkle className="w-5 h-5 text-red-600" />;
      case 'Crown':
        return <Crown className="w-5 h-5 text-red-600" />;
      case 'Briefcase':
        return <Briefcase className="w-5 h-5 text-red-600" />;
      case 'Shield':
        return <Shield className="w-5 h-5 text-red-600" />;
      case 'CreditCard':
        return <CreditCard className="w-5 h-5 text-red-600" />;
      case 'Image':
        return <Image className="w-5 h-5 text-red-600" />;
      case 'Flag':
        return <Flag className="w-5 h-5 text-red-600" />;
      case 'PenTool':
        return <PenTool className="w-5 h-5 text-red-600" />;
      default:
        return <Package className="w-5 h-5 text-red-600" />;
    }
  };

  const filteredProducts = useMemo(() => {
    return BRANDING_PRODUCTS.filter((product) => {
      const matchesSearch =
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.materials.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'All' || product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold text-red-600 dark:text-red-500">
            <button onClick={onNavigateHome} className="hover:underline">
              Home
            </button>
            <span>/</span>
            <span>Branding &amp; Customization</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100 tracking-tight">
            Commercial Branding &amp; Customization
          </h1>
          <p className="text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Professional graphic design, commercial workwear, custom apparel, and high-impact signage. Configure custom options, calculate bulk volume pricing, and order directly through your Paperglow account.
          </p>
        </div>

        {/* Floating Cart Trigger */}
        <button
          onClick={onOpenCart}
          className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs flex items-center space-x-2 shadow-xs transition-colors self-start md:self-auto cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>View Customization Cart</span>
          {cartCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-white text-red-600 font-bold flex items-center justify-center text-[10px]">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Control Bar: Search + Category Filters */}
      <div className="space-y-4 p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#14171d]">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-grow max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search merchandise by keyword, material, or product type..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-red-600"
            />
          </div>

          <div className="text-xs text-neutral-500 font-medium">
            Showing {filteredProducts.length} of {BRANDING_PRODUCTS.length} production items
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
          <span className="text-xs font-semibold text-neutral-500 mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter by:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-red-600 text-white'
                  : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700 hover:border-neutral-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl space-y-3">
          <p className="text-base text-neutral-600 dark:text-neutral-400">
            No branding products match your filter.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-red-600 text-white"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#14171d] flex flex-col justify-between space-y-6 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors shadow-xs"
            >
              <div className="space-y-4">
                {/* Header: Icon + Category + Min Order */}
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/30 flex items-center justify-center">
                    {getProductIcon(product.iconName)}
                  </div>
                  <span className="text-[11px] font-mono text-neutral-500">
                    Min Order: {product.minOrder} {product.minOrder === 1 ? 'unit' : 'units'}
                  </span>
                </div>

                {/* Title & Tagline */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 dark:text-red-500">
                    {product.category}
                  </span>
                  <h3 className="text-lg font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100 mt-0.5">
                    {product.title}
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">{product.tagline}</p>
                </div>

                {/* Description */}
                <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-3 leading-relaxed">
                  {product.description}
                </p>

                {/* Materials & Turnaround */}
                <div className="space-y-1.5 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 text-[11px]">
                  <div className="flex items-start space-x-1.5 text-neutral-600 dark:text-neutral-400">
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200 shrink-0">Materials:</span>
                    <span className="line-clamp-1">{product.materials}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-neutral-600 dark:text-neutral-400">
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200 shrink-0">Turnaround:</span>
                    <span>{product.turnaround}</span>
                  </div>
                </div>

                {/* Variations Preview */}
                <div className="text-[11px] space-y-1">
                  <span className="font-semibold text-neutral-500">Available Variations:</span>
                  <div className="flex flex-wrap gap-1">
                    {product.variations.map((v: ProductVariation) => (
                      <span
                        key={v.name}
                        className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-[10px]"
                      >
                        {v.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Starting Price */}
                <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-baseline justify-between">
                  <span className="text-xs text-neutral-500">Starting Price</span>
                  <div className="text-right">
                    <span className="text-lg font-bold font-mono text-neutral-900 dark:text-neutral-100">
                      ${product.basePrice}
                    </span>
                    <span className="text-xs text-neutral-500"> {product.priceUnit}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Action */}
              <div className="pt-2">
                <button
                  onClick={() => onSelectProduct(product)}
                  className="w-full py-2.5 rounded-lg text-xs font-semibold bg-red-600 hover:bg-red-700 text-white flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Configure Options &amp; Order</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Production & Proof Guarantee */}
      <div className="p-8 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#121419] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase text-red-600">
            <ShieldCheck className="w-4 h-4" />
            <span>The Paperglow Production Guarantee</span>
          </div>
          <h4 className="text-lg font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
            Free Digital Artwork Proofing Before Any Press Runs
          </h4>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 max-w-xl">
            You maintain full control. Our production studio generates a digital proof showing exact thread colors, ink separations, and placement measurements for your approval in your account before manufacturing.
          </p>
        </div>
        <button
          onClick={onOpenCart}
          className="px-5 py-2.5 rounded-lg text-xs font-semibold bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 transition-colors whitespace-nowrap"
        >
          Check Active Cart ({cartCount})
        </button>
      </div>
    </div>
  );
};
