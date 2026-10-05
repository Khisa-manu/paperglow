import React, { useState } from 'react';
import { ARTICLES } from '../data/portfolioData';
import { Article } from '../types';
import { Search, Calendar, Clock, ArrowRight, Tag } from 'lucide-react';

interface BlogPageProps {
  onSelectArticle: (article: Article) => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({ onSelectArticle }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Design Systems', 'Opinion', 'Engineering'];

  const filteredArticles = ARTICLES.filter((article) => {
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pt-32 pb-24 space-y-16">
      {/* Blog Header */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <span className="text-xs font-bold uppercase tracking-widest text-muted">
          Studio Journal
        </span>
        <h1 className="text-4xl sm:text-6xl font-extrabold font-['Poppins'] tracking-tight">
          Essays on Craft, Software, and Digital Design
        </h1>
        <p className="text-muted text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
          Unvarnished observations from our day-to-day work building interfaces, design systems, and software products.
        </p>

        {/* Search & Categories Bar */}
        <div className="max-w-2xl mx-auto space-y-4 pt-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Search essays by keyword, tag, or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 text-sm rounded-2xl bg-surface border border-divider focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-primary text-white'
                    : 'bg-surface border border-divider text-muted hover:text-contrast'
                }`}
                style={{
                  backgroundColor: selectedCategory === cat ? 'var(--color-primary)' : undefined,
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredArticles.length === 0 ? (
          <div className="text-center py-20 bg-surface rounded-2xl border border-divider">
            <p className="text-muted text-base">No articles found matching your query.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="mt-3 text-sm font-semibold hover:underline"
              style={{ color: 'var(--color-primary)' }}
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article) => (
              <article
                key={article.id}
                onClick={() => onSelectArticle(article)}
                className="group cursor-pointer p-8 rounded-3xl bg-surface border border-divider hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-muted">
                    <span
                      className="px-2.5 py-0.5 rounded-md font-semibold text-white"
                      style={{ backgroundColor: 'var(--color-primary)' }}
                    >
                      {article.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {article.readTime}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold font-['Poppins'] group-hover:text-primary transition-colors leading-snug">
                    {article.title}
                  </h3>

                  <p className="text-sm text-muted leading-relaxed line-clamp-3">
                    {article.excerpt}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-divider space-y-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={article.author.avatar}
                      alt={article.author.name}
                      className="w-8 h-8 rounded-full object-cover border border-divider"
                    />
                    <div>
                      <div className="text-xs font-semibold text-contrast">{article.author.name}</div>
                      <div className="text-[11px] text-muted">{article.date}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex flex-wrap gap-1.5">
                      {article.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="text-[11px] px-2 py-0.5 rounded bg-base border border-divider text-muted">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <span className="text-xs font-semibold flex items-center gap-1" style={{ color: 'var(--color-primary)' }}>
                      Read essay <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
