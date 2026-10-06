import React, { useState } from 'react';
import {
  Barcode,
  Camera,
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Package,
  Layers,
  Sparkles,
  Zap,
  ArrowLeftRight,
  Plus,
  RotateCcw,
} from 'lucide-react';
import { InventoryProduct } from '../../types/stockInventory';

interface BarcodeScannerModuleProps {
  products: InventoryProduct[];
  onOpenStockAdjustment: (productId: string) => void;
  onOpenEditProduct: (product: InventoryProduct) => void;
}

export const BarcodeScannerModule: React.FC<BarcodeScannerModuleProps> = ({
  products,
  onOpenStockAdjustment,
  onOpenEditProduct,
}) => {
  const [scannedCode, setScannedCode] = useState('');
  const [isScanningActive, setIsScanningActive] = useState(true);
  const [foundProduct, setFoundProduct] = useState<InventoryProduct | null>(null);
  const [scanMessage, setScanMessage] = useState<string | null>(null);

  const handleLookup = (code: string) => {
    const cleanCode = code.trim();
    if (!cleanCode) return;
    setScannedCode(cleanCode);

    const match = products.find(
      (p) =>
        p.barcode.toLowerCase() === cleanCode.toLowerCase() ||
        p.sku.toLowerCase() === cleanCode.toLowerCase()
    );

    if (match) {
      setFoundProduct(match);
      setScanMessage(`Barcode Matched: ${match.name}`);
    } else {
      setFoundProduct(null);
      setScanMessage(`No catalog product found matching code "${cleanCode}".`);
    }
  };

  const handleSimulateScan = (product: InventoryProduct) => {
    handleLookup(product.barcode);
  };

  const handleRandomScan = () => {
    const randomProduct = products[Math.floor(Math.random() * products.length)];
    if (randomProduct) {
      handleSimulateScan(randomProduct);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Top Banner */}
      <div className="p-5 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <Barcode className="w-5 h-5 text-red-600" />
            <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 font-['Poppins']">
              Barcode Scanner &amp; Rapid Stock Terminal
            </h2>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Scan 1D (EAN-13, Code 128) and 2D QR codes to quickly look up stock levels, verify prices, and record warehouse movements.
          </p>
        </div>

        <button
          onClick={handleRandomScan}
          className="px-3.5 py-2 text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-lg transition-colors flex items-center space-x-1.5 cursor-pointer self-start md:self-auto border border-neutral-200 dark:border-neutral-700"
        >
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span>Simulate Gun Scan</span>
        </button>
      </div>

      {/* Main Terminal Viewport */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Interactive Scanner Camera Viewport Frame */}
        <div className="bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-bold text-neutral-800 dark:text-neutral-200">
              <Camera className="w-4 h-4 text-red-600" />
              <span>Camera Optical Terminal Viewport</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400">
              Ready for Camera SDK
            </span>
          </div>

          {/* Scanner Simulation Window */}
          <div className="relative h-64 rounded-xl bg-neutral-900 overflow-hidden flex flex-col items-center justify-center p-4 border border-neutral-800">
            {/* Target Reticle corners */}
            <div className="absolute inset-8 border border-white/20 rounded-lg pointer-events-none">
              <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-red-500" />
              <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-red-500" />
              <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-red-500" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-red-500" />
            </div>

            {/* Red Laser Sweep Line Animation */}
            {isScanningActive && (
              <div className="absolute left-8 right-8 h-0.5 bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.9)] animate-bounce" />
            )}

            <div className="text-center space-y-2 z-10">
              <Barcode className="w-12 h-12 text-white/40 mx-auto" />
              <p className="text-xs text-white/80 font-mono">
                Align barcode within red target reticle
              </p>
              <p className="text-[10px] text-white/40">
                Supports handheld USB laser scanners &amp; mobile webcams
              </p>
            </div>
          </div>

          {/* Manual Input Entry */}
          <div className="space-y-2 pt-2">
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300">
              Manual Barcode or SKU Entry
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. 6161100348123 or PG-INV-1001"
                value={scannedCode}
                onChange={(e) => setScannedCode(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleLookup(scannedCode);
                }}
                className="flex-1 px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 font-mono text-neutral-900 dark:text-white"
              />
              <button
                type="button"
                onClick={() => handleLookup(scannedCode)}
                className="px-4 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-xs cursor-pointer"
              >
                Scan Code
              </button>
            </div>
          </div>
        </div>

        {/* Right: Scan Results & Product Dossier */}
        <div className="bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white font-['Poppins']">
              Scanned Item Dossier
            </h3>
            {foundProduct && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400">
                Verified Match
              </span>
            )}
          </div>

          {scanMessage && (
            <div
              className={`p-3 rounded-lg text-xs font-medium flex items-center space-x-2 ${
                foundProduct
                  ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
              }`}
            >
              {foundProduct ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              )}
              <span>{scanMessage}</span>
            </div>
          )}

          {foundProduct ? (
            <div className="space-y-4 pt-1">
              <div className="flex items-start space-x-3.5">
                {foundProduct.imageUrl && (
                  <img
                    src={foundProduct.imageUrl}
                    alt={foundProduct.name}
                    className="w-16 h-16 rounded-xl object-cover border border-neutral-200 dark:border-neutral-800 shrink-0"
                  />
                )}
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                    {foundProduct.name}
                  </h4>
                  <div className="flex flex-wrap gap-2 text-xs font-mono">
                    <span className="text-neutral-500">SKU: {foundProduct.sku}</span>
                    <span className="text-neutral-500">Barcode: {foundProduct.barcode}</span>
                  </div>
                  <div className="text-xs text-neutral-500">{foundProduct.categoryName}</div>
                </div>
              </div>

              {/* Live stock and price specs */}
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs">
                <div>
                  <span className="text-neutral-500">Current Warehouse Stock:</span>
                  <div className="text-lg font-bold font-mono text-neutral-900 dark:text-white">
                    {foundProduct.currentQuantity} {foundProduct.unit}
                  </div>
                  <div className="text-[10px] text-neutral-400">
                    Min safety reserve: {foundProduct.minStockLevel}
                  </div>
                </div>

                <div>
                  <span className="text-neutral-500">Selling Price:</span>
                  <div className="text-lg font-bold font-mono text-emerald-600">
                    KES {foundProduct.sellingPriceKes.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-neutral-400">
                    Cost: KES {foundProduct.buyingPriceKes.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-xs space-y-1">
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                  Location in Warehouse:
                </span>
                <p className="text-neutral-500 font-mono">{foundProduct.location}</p>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <button
                  onClick={() => onOpenStockAdjustment(foundProduct.id)}
                  className="flex-1 py-2 px-3 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-xs transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                  <span>Adjust Stock for Item</span>
                </button>
                <button
                  onClick={() => onOpenEditProduct(foundProduct)}
                  className="py-2 px-3 text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-800 dark:text-neutral-200 rounded-lg transition-colors cursor-pointer"
                >
                  Edit Master
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-neutral-400 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl space-y-2">
              <Package className="w-8 h-8 mx-auto text-neutral-300 dark:text-neutral-600" />
              <p>Scan a product or select a quick barcode sample below to load full inventory details.</p>
            </div>
          )}

          {/* Quick Demo Samples list */}
          <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 space-y-2">
            <span className="text-[11px] font-bold uppercase text-neutral-400">
              Quick Test Barcodes (Click to Simulate)
            </span>
            <div className="flex flex-wrap gap-1.5">
              {products.slice(0, 5).map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSimulateScan(p)}
                  className="px-2 py-1 rounded bg-neutral-100 dark:bg-neutral-800 text-[10px] font-mono hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 cursor-pointer"
                >
                  {p.barcode} ({p.name.split(' ')[0]})
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
