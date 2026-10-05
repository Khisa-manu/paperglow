import React, { useState } from 'react';
import { Article } from '../types';
import { X, Calendar, Clock, MessageSquare, Send } from 'lucide-react';

interface ArticleModalProps {
  article: Article | null;
  onClose: () => void;
}

interface Comment {
  id: string;
  name: string;
  date: string;
  text: string;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({ article, onClose }) => {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      name: 'Sarah Jenkins',
      date: '2 days ago',
      text: 'This mirrors our experience exactly. Establishing clear ownership for design tokens saved our frontend sprints.'
    }
  ]);
  const [authorName, setAuthorName] = useState('');
  const [commentText, setCommentText] = useState('');

  if (!article) return null;

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !commentText.trim()) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      name: authorName.trim(),
      date: 'Just now',
      text: commentText.trim()
    };
    setComments([newComment, ...comments]);
    setAuthorName('');
    setCommentText('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl bg-base rounded-2xl shadow-2xl border border-divider overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-base/80 backdrop-blur-md text-contrast hover:bg-surface border border-divider transition-transform hover:scale-105"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-10 space-y-6">
          {/* Metadata */}
          <div className="flex items-center space-x-3 text-xs text-muted">
            <span
              className="px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider text-white"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              {article.category}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {article.date}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {article.readTime}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-2xl sm:text-3xl font-extrabold font-['Poppins'] leading-tight">
            {article.title}
          </h2>

          {/* Author Badge */}
          <div className="flex items-center space-x-3 py-3 border-y border-divider">
            <img
              src={article.author.avatar}
              alt={article.author.name}
              className="w-10 h-10 rounded-full object-cover border border-divider"
            />
            <div>
              <div className="font-semibold text-sm">{article.author.name}</div>
              <div className="text-xs text-muted">{article.author.role}</div>
            </div>
          </div>

          {/* Article Paragraphs */}
          <div className="space-y-4 text-contrast/90 leading-relaxed text-base">
            <p className="text-lg font-medium text-contrast leading-relaxed italic border-l-2 pl-4" style={{ borderColor: 'var(--color-primary)' }}>
              {article.excerpt}
            </p>
            {article.content.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 pt-4 border-t border-divider">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 text-xs rounded-md bg-surface border border-divider text-muted font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Comments Section */}
          <div className="pt-8 border-t border-divider space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-['Poppins'] flex items-center gap-2">
                <MessageSquare className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
                Reader Discussion ({comments.length})
              </h3>
            </div>

            {/* Comment Form */}
            <form onSubmit={handleSubmitComment} className="space-y-3 p-4 rounded-xl bg-surface border border-divider">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted">
                Leave a comment
              </div>
              <input
                type="text"
                placeholder="Your Name"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-base border border-divider focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
              <textarea
                placeholder="Share your thoughts on this topic..."
                rows={3}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-base border border-divider focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                required
              />
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold rounded-lg text-white flex items-center gap-1.5 transition-transform hover:scale-105"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post Comment</span>
              </button>
            </form>

            {/* Comments List */}
            <div className="space-y-3">
              {comments.map((comment) => (
                <div key={comment.id} className="p-3.5 rounded-xl border border-divider bg-surface/40 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-contrast">{comment.name}</span>
                    <span className="text-muted">{comment.date}</span>
                  </div>
                  <p className="text-sm text-contrast/90">{comment.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
