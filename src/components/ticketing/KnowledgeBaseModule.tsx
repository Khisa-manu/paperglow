import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Plus,
  Eye,
  ThumbsUp,
  ThumbsDown,
  ArrowRight,
  X,
  FileText,
  HelpCircle,
  Tag,
} from 'lucide-react';
import { KnowledgeArticle } from '../../types/ticketing';

interface KnowledgeBaseModuleProps {
  articles: KnowledgeArticle[];
  onAddArticle: (newArt: Omit<KnowledgeArticle, 'id' | 'views' | 'helpfulCount' | 'notHelpfulCount' | 'updatedAt'>) => void;
  onRateArticle: (articleId: string, isHelpful: boolean) => void;
  onOpenCreateTicket: () => void;
}

export const KnowledgeBaseModule: React.FC<KnowledgeBaseModuleProps> = ({
  articles,
  onAddArticle,
  onRateArticle,
  onOpenCreateTicket,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [readingArticleId, setReadingArticleId] = useState<string | null>(null);
  const [isAddArticleOpen, setIsAddArticleOpen] = useState(false);

  // New Article Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Billing & Plans');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  const categories = ['All', 'Billing & Plans', 'Hardware & Setup', 'Account & Permissions', 'Troubleshooting'];

  const filteredArticles = articles.filter((art) => {
    if (selectedCategory !== 'All' && art.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesTitle = art.title.toLowerCase().includes(q);
      const matchesExcerpt = art.excerpt.toLowerCase().includes(q);
      const matchesContent = art.content.toLowerCase().includes(q);
      const matchesTags = art.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchesTitle && !matchesExcerpt && !matchesContent && !matchesTags) return false;
    }
    return true;
  });

  const readingArticle = articles.find((a) => a.id === readingArticleId);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    onAddArticle({
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category,
      excerpt: excerpt || content.slice(0, 120) + '...',
      content,
      tags: tagsInput.split(',').map((t) => t.trim()).filter(Boolean),
    });

    setIsAddArticleOpen(false);
    setTitle('');
    setExcerpt('');
    setContent('');
    setTagsInput('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-neutral-900 dark:text-white font-['Poppins']">
            Knowledge Base & Self-Service Portal
          </h2>
          <p className="text-xs text-neutral-500">
            Publish support articles, frequently asked questions, setup guides, and troubleshooting procedures
          </p>
        </div>

        <button
          onClick={() => setIsAddArticleOpen(true)}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-md shadow-xs transition-colors shrink-0 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Help Article</span>
        </button>
      </div>

      {/* Search & Category Filter */}
      <div className="p-4 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-lg space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guides by keyword, error code, or integration (e.g. M-Pesa, KRA, Barcode)..."
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-neutral-50 dark:bg-[#181c24] border border-neutral-200 dark:border-neutral-800 rounded-md text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-red-600"
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-md font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Article Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredArticles.length === 0 ? (
          <div className="col-span-2 p-12 text-center text-xs text-neutral-500 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-lg">
            No articles found matching "{searchQuery}".
          </div>
        ) : (
          filteredArticles.map((art) => (
            <div
              key={art.id}
              onClick={() => setReadingArticleId(art.id)}
              className="p-5 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-lg hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors cursor-pointer flex flex-col justify-between space-y-3 group"
            >
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-red-600 dark:text-red-400">
                  {art.category}
                </span>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-2">
                  {art.title}
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-3 leading-relaxed">
                  {art.excerpt}
                </p>
              </div>

              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-400">
                <div className="flex items-center space-x-3 tabular-nums">
                  <span className="flex items-center space-x-1">
                    <Eye className="w-3.5 h-3.5" />
                    <span>{art.views} views</span>
                  </span>
                  <span className="flex items-center space-x-1 text-emerald-600">
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{art.helpfulCount} helpful</span>
                  </span>
                </div>

                <span className="text-xs font-semibold text-red-600 flex items-center space-x-1">
                  <span>Read article</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Interactive Article Reader Modal */}
      {readingArticle && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-lg max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-5">
            <div className="flex items-start justify-between border-b border-neutral-200 dark:border-neutral-800 pb-4">
              <div>
                <span className="text-xs font-semibold text-red-600 dark:text-red-400">
                  {readingArticle.category}
                </span>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white mt-1">
                  {readingArticle.title}
                </h3>
                <span className="text-[11px] text-neutral-400 block mt-1">
                  Last updated {new Date(readingArticle.updatedAt).toLocaleDateString()}
                </span>
              </div>
              <button
                onClick={() => setReadingArticleId(null)}
                className="text-neutral-400 hover:text-neutral-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed space-y-3 whitespace-pre-line font-normal">
              {readingArticle.content}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 pt-2">
              {readingArticle.tags.map((t, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-[10px] text-neutral-600 dark:text-neutral-400"
                >
                  #{t}
                </span>
              ))}
            </div>

            {/* Feedback & Deflection Section */}
            <div className="p-4 bg-neutral-50 dark:bg-[#181c24] border border-neutral-200 dark:border-neutral-800 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                  Was this article helpful?
                </span>
                <button
                  onClick={() => onRateArticle(readingArticle.id, true)}
                  className="px-2.5 py-1 bg-white dark:bg-[#12151b] border border-neutral-300 dark:border-neutral-700 hover:border-emerald-500 rounded text-xs flex items-center space-x-1 text-emerald-600 cursor-pointer"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Yes ({readingArticle.helpfulCount})</span>
                </button>
                <button
                  onClick={() => onRateArticle(readingArticle.id, false)}
                  className="px-2.5 py-1 bg-white dark:bg-[#12151b] border border-neutral-300 dark:border-neutral-700 hover:border-neutral-500 rounded text-xs flex items-center space-x-1 text-neutral-500 cursor-pointer"
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                  <span>No</span>
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-neutral-500 text-[11px]">Still need help?</span>
                <button
                  onClick={() => {
                    setReadingArticleId(null);
                    onOpenCreateTicket();
                  }}
                  className="text-xs font-semibold text-red-600 hover:text-red-700 underline cursor-pointer"
                >
                  Submit a Support Ticket
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Article Modal */}
      {isAddArticleOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-lg max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                Create Knowledge Base Article
              </h3>
              <button
                onClick={() => setIsAddArticleOpen(false)}
                className="text-neutral-400 hover:text-neutral-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-500 mb-1">Article Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. How to connect Epson TM-T20 receipt printer"
                  className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-[#181c24] border border-neutral-200 dark:border-neutral-800 rounded focus:outline-none focus:ring-1 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="block text-neutral-500 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-[#181c24] border border-neutral-200 dark:border-neutral-800 rounded focus:outline-none"
                >
                  <option value="Billing & Plans">Billing & Plans</option>
                  <option value="Hardware & Setup">Hardware & Setup</option>
                  <option value="Account & Permissions">Account & Permissions</option>
                  <option value="Troubleshooting">Troubleshooting</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-500 mb-1">Short Excerpt</label>
                <input
                  type="text"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Brief preview sentence..."
                  className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-[#181c24] border border-neutral-200 dark:border-neutral-800 rounded focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-500 mb-1">Article Content *</label>
                <textarea
                  rows={6}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Full markdown/text instructions and steps..."
                  className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-[#181c24] border border-neutral-200 dark:border-neutral-800 rounded focus:outline-none focus:ring-1 focus:ring-red-600 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-neutral-500 mb-1">Tags (Comma-separated)</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="Printer, POS, Hardware, Setup"
                  className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-[#181c24] border border-neutral-200 dark:border-neutral-800 rounded focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsAddArticleOpen(false)}
                  className="px-3 py-1.5 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 rounded cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded cursor-pointer shadow-xs"
                >
                  Publish Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
