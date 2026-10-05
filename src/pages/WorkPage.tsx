import React, { useState } from 'react';
import { PROJECTS, CLIENTS } from '../data/portfolioData';
import { Project } from '../types';
import { ArrowUpRight, Filter } from 'lucide-react';

interface WorkPageProps {
  onSelectProject: (project: Project) => void;
  onNavigateTab: (tab: string) => void;
}

export const WorkPage: React.FC<WorkPageProps> = ({ onSelectProject, onNavigateTab }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    'All',
    'Product & Web App',
    'Design Systems',
    'Branding & Packaging',
    'Mobile Experience',
  ];

  const filteredProjects = selectedCategory === 'All'
    ? PROJECTS
    : PROJECTS.filter((p) => p.category === selectedCategory);

  return (
    <div className="pt-32 pb-24 space-y-20">
      {/* Work Header */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <span className="text-xs font-bold uppercase tracking-widest text-muted">
          Our Portfolio
        </span>
        <h1 className="text-4xl sm:text-6xl font-extrabold font-['Poppins'] tracking-tight">
          Selected Case Studies &amp; Product Ships
        </h1>
        <p className="text-muted text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
          Every project is built from scratch with tailored typography, custom components, and production-ready code.
        </p>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-primary text-white shadow-sm'
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
      </section>

      {/* Projects Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {filteredProjects.map((project) => (
            <div
              key={project.slug}
              className="group cursor-pointer rounded-2xl overflow-hidden border border-divider bg-surface transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col justify-between"
              onClick={() => onSelectProject(project)}
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-muted/10">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-base/90 backdrop-blur-md text-contrast shadow-sm">
                    {project.category}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-black/60 text-white backdrop-blur-md">
                    {project.year}
                  </span>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold font-['Poppins'] group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs text-muted font-medium mt-0.5">
                      Client: {project.client}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full border border-divider flex items-center justify-center text-muted group-hover:text-contrast group-hover:border-contrast transition-colors shrink-0">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                </div>

                <p className="text-sm text-muted leading-relaxed line-clamp-2">
                  {project.summary}
                </p>

                <div className="pt-2 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2.5 py-1 rounded-md bg-base border border-divider text-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="pt-4 border-t border-divider flex items-center justify-between text-xs font-semibold">
                  <span style={{ color: 'var(--color-primary)' }}>
                    Read Full Case Study &rarr;
                  </span>
                  <span className="text-muted">
                    {project.deliverables?.length || 4} Deliverables
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Client List Strip */}
      <section className="border-t border-divider pt-16 bg-surface/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted">
            Clients who trust our creative direction &amp; technical craft
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8 items-center justify-items-center opacity-70">
            {CLIENTS.map((client) => (
              <div key={client.name} className="h-8 flex items-center justify-center">
                <img
                  src={client.logo}
                  alt={client.name}
                  className="max-h-7 max-w-[120px] object-contain dark:invert"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Project CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="p-10 rounded-3xl bg-surface border border-divider space-y-4">
          <h3 className="text-2xl font-bold font-['Poppins']">
            Need something tailored for your unique problem space?
          </h3>
          <p className="text-muted text-sm max-w-lg mx-auto">
            From greenfield MVP development to enterprise-wide design token rollouts, we provide fixed-scope sprint packages.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigateTab('contact')}
              className="px-6 py-3 rounded-xl font-bold text-white shadow"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              Get a Proposal
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
