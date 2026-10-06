import React from 'react';

interface FooterProps {
  onNavigateSection: (sectionId: string) => void;
  onOpenAccount: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateSection, onOpenAccount }) => {
  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#0c0e12] py-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-sm bg-red-600"></span>
              <span className="text-lg font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
                Paperglow
              </span>
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              The unified platform bringing practical business applications and commercial-grade physical branding together under one central account.
            </p>
            <div className="pt-2 text-xs text-neutral-500">
              Not a web hosting provider. We build business software and physical brand goods.
            </div>
          </div>

          {/* Digital Applications */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-100 mb-3 font-['Poppins']">
              Business Applications
            </h4>
            <ul className="space-y-2 text-xs text-neutral-600 dark:text-neutral-400">
              <li>
                <button onClick={() => onNavigateSection('applications')} className="hover:text-red-600 transition-colors">
                  Paperglow Invoice &amp; Ledgers
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('applications')} className="hover:text-red-600 transition-colors">
                  Paperglow CRM &amp; Pipelines
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('applications')} className="hover:text-red-600 transition-colors">
                  Paperglow Hub &amp; Projects
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('applications')} className="hover:text-red-600 transition-colors">
                  Paperglow Ticketing &amp; SLA
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('applications')} className="hover:text-red-600 transition-colors">
                  Paperglow Team &amp; Permissions
                </button>
              </li>
            </ul>
          </div>

          {/* Branding & Customization */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-100 mb-3 font-['Poppins']">
              Branding &amp; Customization
            </h4>
            <ul className="space-y-2 text-xs text-neutral-600 dark:text-neutral-400">
              <li>
                <button onClick={() => onNavigateSection('branding')} className="hover:text-red-600 transition-colors">
                  Graphic Design Services
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('branding')} className="hover:text-red-600 transition-colors">
                  Custom T-Shirts &amp; Hoodies
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('branding')} className="hover:text-red-600 transition-colors">
                  Corporate Uniforms &amp; Workwear
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('branding')} className="hover:text-red-600 transition-colors">
                  Vinyl Banners &amp; Signage
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('branding')} className="hover:text-red-600 transition-colors">
                  Business Cards &amp; Swag
                </button>
              </li>
            </ul>
          </div>

          {/* Platform & Account */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-100 mb-3 font-['Poppins']">
              Platform &amp; Access
            </h4>
            <ul className="space-y-2 text-xs text-neutral-600 dark:text-neutral-400">
              <li>
                <button onClick={onOpenAccount} className="hover:text-red-600 transition-colors font-medium text-red-600 dark:text-red-500">
                  Open Central Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('how-it-works')} className="hover:text-red-600 transition-colors">
                  How Paperglow Works
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('why-paperglow')} className="hover:text-red-600 transition-colors">
                  Why Paperglow
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <p>© {new Date().getFullYear()} Paperglow Platform. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <span>Unified Business Software</span>
            <span>•</span>
            <span>Physical Customization Studio</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
