import React from 'react';
import { Project } from '../types';
import { X, CheckCircle, ArrowRight, Quote } from 'lucide-react';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  onSelectContact: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose, onSelectContact }) => {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl bg-base rounded-2xl shadow-2xl border border-divider overflow-hidden my-8"
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

        {/* Hero Image */}
        <div className="relative h-72 sm:h-96 w-full bg-surface overflow-hidden">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-6 sm:p-8">
            <div className="text-white space-y-1">
              <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-white/20 backdrop-blur-md">
                {project.category}
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold font-['Poppins']">
                {project.title}
              </h2>
              <p className="text-white/80 text-sm">
                Client: {project.client} • Year: {project.year}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-10 space-y-8">
          {/* Metrics bar */}
          {project.metrics && (
            <div className="grid grid-cols-3 gap-4 p-4 rounded-xl bg-surface border border-divider">
              {project.metrics.map((metric, i) => (
                <div key={i} className="text-center">
                  <div className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>
                    {metric.value}
                  </div>
                  <div className="text-xs text-muted uppercase tracking-wider mt-0.5">
                    {metric.label}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Overview */}
          <div>
            <h3 className="text-lg font-bold uppercase tracking-wider font-['Poppins'] mb-2">
              Project Overview
            </h3>
            <p className="text-muted leading-relaxed text-base">
              {project.overview}
            </p>
          </div>

          {/* Challenge & Solution Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl border border-divider bg-surface/50">
              <h4 className="font-semibold text-base mb-2 font-['Poppins'] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                The Challenge
              </h4>
              <p className="text-sm text-muted leading-relaxed">
                {project.challenge}
              </p>
            </div>

            <div className="p-5 rounded-xl border border-divider bg-surface/50">
              <h4 className="font-semibold text-base mb-2 font-['Poppins'] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--color-primary)' }}></span>
                The Solution
              </h4>
              <p className="text-sm text-muted leading-relaxed">
                {project.solution}
              </p>
            </div>
          </div>

          {/* Key Results */}
          <div>
            <h3 className="text-lg font-bold uppercase tracking-wider font-['Poppins'] mb-3">
              Measurable Outcomes
            </h3>
            <div className="grid grid-cols-1 gap-2.5">
              {project.results.map((res, i) => (
                <div key={i} className="flex items-start space-x-3 text-sm">
                  <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-contrast/90">{res}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Deliverables & Tags */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-divider">
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 text-xs rounded-md bg-surface border border-divider text-muted font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <button
              onClick={() => {
                onClose();
                onSelectContact();
              }}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm flex items-center space-x-2 transition-transform hover:scale-105"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              <span>Build similar project</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Testimonial if present */}
          {project.testimonial && (
            <div className="p-6 rounded-2xl bg-surface border border-divider relative">
              <Quote className="w-8 h-8 opacity-15 absolute top-4 right-4" style={{ color: 'var(--color-primary)' }} />
              <p className="italic text-contrast/90 text-sm leading-relaxed mb-4">
                &ldquo;{project.testimonial.quote}&rdquo;
              </p>
              <div>
                <div className="font-semibold text-sm">{project.testimonial.author}</div>
                <div className="text-xs text-muted">{project.testimonial.role}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
