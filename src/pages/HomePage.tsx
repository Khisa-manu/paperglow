import React, { useState, useEffect } from 'react';
import { CLIENTS, FACTS, PROJECTS, SERVICES, ARTICLES, STUDIO_PHOTOS } from '../data/portfolioData';
import { Project, Article } from '../types';
import { ArrowRight, ArrowUpRight, Check, Sparkles } from 'lucide-react';

interface HomePageProps {
  onSelectProject: (project: Project) => void;
  onSelectArticle: (article: Article) => void;
  onNavigateTab: (tab: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onSelectProject,
  onSelectArticle,
  onNavigateTab,
}) => {
  // Counter animation logic
  const [counts, setCounts] = useState<{ [key: string]: number }>({
    shipped: 0,
    clients: 0,
    awards: 0,
  });

  useEffect(() => {
    const duration = 1600;
    const steps = 40;
    const intervalTime = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = Math.min(step / steps, 1);
      // easeOutExpo formula
      const factor = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      setCounts({
        shipped: Math.floor(214 * factor),
        clients: Math.floor(96 * factor),
        awards: Math.floor(18 * factor),
      });

      if (step >= steps) {
        clearInterval(timer);
        setCounts({ shipped: 214, clients: 96, awards: 18 });
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-24 sm:space-y-32">
      {/* 1. HERO SECTION */}
      <section className="relative pt-32 sm:pt-40 pb-16 overflow-hidden">
        {/* Subtle Watermark background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none z-0">
          <span className="watermark-text text-8xl sm:text-[14rem] font-black block">
            STUDIO
          </span>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-surface border border-divider">
            <Sparkles className="w-3.5 h-3.5" style={{ color: 'var(--color-primary)' }} />
            <span>Independent Design &amp; Technology Practice</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight font-['Poppins'] leading-[1.15] text-contrast">
            We are a{' '}
            <span
              className="underline decoration-wavy decoration-2 underline-offset-8"
              style={{ textDecorationColor: 'var(--color-primary)' }}
            >
              design and development
            </span>{' '}
            studio based in California
          </h1>

          <p className="text-muted text-lg sm:text-xl max-w-2xl mx-auto font-normal leading-relaxed">
            We partner with visionary startups and global brands to build durable digital products, thoughtful identities, and scalable design systems.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onNavigateTab('work')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold text-white shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:shadow-xl flex items-center justify-center gap-2"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              <span>Browse our work</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigateTab('contact')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-semibold border border-divider hover:bg-surface text-contrast transition-all hover:-translate-y-0.5"
            >
              Let&apos;s start a project
            </button>
          </div>
        </div>
      </section>

      {/* 2. CLIENT LOGOS */}
      <section className="border-y border-divider py-10 bg-surface/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-muted mb-8">
            Trusted by innovators and established industry leaders
          </p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-8 items-center justify-items-center opacity-70 hover:opacity-100 transition-opacity">
            {CLIENTS.map((client) => (
              <div
                key={client.name}
                className="h-10 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300"
                title={client.name}
              >
                <img
                  src={client.logo}
                  alt={client.name}
                  className="max-h-8 max-w-[120px] object-contain dark:invert"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURED WORKS (STAGGERED 2-COLUMN GRID) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-muted block mb-2">
              Portfolio
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold font-['Poppins'] tracking-tight">
              Selected Works
            </h2>
          </div>
          <button
            onClick={() => onNavigateTab('work')}
            className="text-sm font-semibold flex items-center gap-1.5 transition-colors group"
            style={{ color: 'var(--color-primary)' }}
          >
            <span>View all projects</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* 2-column staggered grid matching theme.json pattern */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14">
          {/* Column 1 */}
          <div className="space-y-12">
            {/* Project 1: Nookdesk */}
            <div
              className="group cursor-pointer rounded-2xl overflow-hidden border border-divider bg-surface transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              onClick={() => onSelectProject(PROJECTS[0])}
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-muted/10">
                <img
                  src={PROJECTS[0].image}
                  alt={PROJECTS[0].title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-base/90 backdrop-blur-md text-contrast shadow-sm">
                    {PROJECTS[0].category}
                  </span>
                </div>
              </div>
              <div className="p-6 sm:p-8 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl sm:text-2xl font-bold font-['Poppins'] group-hover:text-primary transition-colors">
                    {PROJECTS[0].title}
                  </h3>
                  <div className="w-8 h-8 rounded-full border border-divider flex items-center justify-center text-muted group-hover:text-contrast group-hover:border-contrast transition-colors">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-sm text-muted leading-relaxed line-clamp-2">
                  {PROJECTS[0].summary}
                </p>
                <div className="pt-2 flex flex-wrap gap-2">
                  {PROJECTS[0].tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="text-xs px-2.5 py-0.5 rounded bg-base border border-divider text-muted">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Project 2: Whisk */}
            <div
              className="group cursor-pointer rounded-2xl overflow-hidden border border-divider bg-surface transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              onClick={() => onSelectProject(PROJECTS[1])}
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-muted/10">
                <img
                  src={PROJECTS[1].image}
                  alt={PROJECTS[1].title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-base/90 backdrop-blur-md text-contrast shadow-sm">
                    {PROJECTS[1].category}
                  </span>
                </div>
              </div>
              <div className="p-6 sm:p-8 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl sm:text-2xl font-bold font-['Poppins'] group-hover:text-primary transition-colors">
                    {PROJECTS[1].title}
                  </h3>
                  <div className="w-8 h-8 rounded-full border border-divider flex items-center justify-center text-muted group-hover:text-contrast group-hover:border-contrast transition-colors">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-sm text-muted leading-relaxed line-clamp-2">
                  {PROJECTS[1].summary}
                </p>
                <div className="pt-2 flex flex-wrap gap-2">
                  {PROJECTS[1].tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="text-xs px-2.5 py-0.5 rounded bg-base border border-divider text-muted">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Column 2 (Offset/Staggered) */}
          <div className="space-y-12 md:mt-16">
            {/* Project 3: Harrow & Pine */}
            <div
              className="group cursor-pointer rounded-2xl overflow-hidden border border-divider bg-surface transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              onClick={() => onSelectProject(PROJECTS[2])}
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-muted/10">
                <img
                  src={PROJECTS[2].image}
                  alt={PROJECTS[2].title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-base/90 backdrop-blur-md text-contrast shadow-sm">
                    {PROJECTS[2].category}
                  </span>
                </div>
              </div>
              <div className="p-6 sm:p-8 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl sm:text-2xl font-bold font-['Poppins'] group-hover:text-primary transition-colors">
                    {PROJECTS[2].title}
                  </h3>
                  <div className="w-8 h-8 rounded-full border border-divider flex items-center justify-center text-muted group-hover:text-contrast group-hover:border-contrast transition-colors">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-sm text-muted leading-relaxed line-clamp-2">
                  {PROJECTS[2].summary}
                </p>
                <div className="pt-2 flex flex-wrap gap-2">
                  {PROJECTS[2].tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="text-xs px-2.5 py-0.5 rounded bg-base border border-divider text-muted">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Project 4: Arcade Club */}
            <div
              className="group cursor-pointer rounded-2xl overflow-hidden border border-divider bg-surface transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              onClick={() => onSelectProject(PROJECTS[3])}
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-muted/10">
                <img
                  src={PROJECTS[3].image}
                  alt={PROJECTS[3].title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-base/90 backdrop-blur-md text-contrast shadow-sm">
                    {PROJECTS[3].category}
                  </span>
                </div>
              </div>
              <div className="p-6 sm:p-8 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl sm:text-2xl font-bold font-['Poppins'] group-hover:text-primary transition-colors">
                    {PROJECTS[3].title}
                  </h3>
                  <div className="w-8 h-8 rounded-full border border-divider flex items-center justify-center text-muted group-hover:text-contrast group-hover:border-contrast transition-colors">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-sm text-muted leading-relaxed line-clamp-2">
                  {PROJECTS[3].summary}
                </p>
                <div className="pt-2 flex flex-wrap gap-2">
                  {PROJECTS[3].tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="text-xs px-2.5 py-0.5 rounded bg-base border border-divider text-muted">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. QUICK FACTS / STATS COUNTER */}
      <section className="relative py-20 bg-surface border-y border-divider overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-center">
          <span className="watermark-text text-7xl sm:text-9xl font-black">
            QUICK FACT
          </span>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {FACTS.map((fact) => {
              const currentVal = counts[fact.id] || 0;
              return (
                <div key={fact.id} className="space-y-2">
                  <div
                    className="text-5xl sm:text-7xl font-extrabold font-['Poppins'] tracking-tight"
                    style={{ color: fact.colorVar }}
                  >
                    {currentVal}
                  </div>
                  <div className="text-base sm:text-lg font-medium text-contrast/90">
                    {fact.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. DARK SERVICES BAND ("What we do") */}
      <section className="bg-[#121417] text-white py-24 sm:py-32 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-16 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-white/50">
              Our Capabilities
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold font-['Poppins'] tracking-tight text-white">
              End-to-end craft across strategy, design, and code
            </h2>
            <p className="text-white/70 text-base sm:text-lg leading-relaxed">
              We eliminate handoff silos. Our team designs with technical feasibility in mind and codes with meticulous visual discernment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {SERVICES.map((service, i) => (
              <div
                key={service.id}
                className="p-8 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-white/30 transition-all hover:-translate-y-1 space-y-5"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center font-mono font-bold text-lg text-white bg-white/10">
                  0{i + 1}
                </div>
                <h3 className="text-xl font-bold font-['Poppins'] text-white">
                  {service.title}
                </h3>
                <p className="text-sm text-white/70 leading-relaxed">
                  {service.description}
                </p>
                <div className="pt-4 border-t border-white/10 space-y-2">
                  {service.deliverables.slice(0, 3).map((item) => (
                    <div key={item} className="flex items-center space-x-2 text-xs text-white/60">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <button
              onClick={() => onNavigateTab('services')}
              className="px-6 py-3 rounded-xl text-sm font-semibold bg-white text-black hover:bg-white/90 transition-all shadow-md"
            >
              Explore Full Capabilities &amp; Pricing
            </button>
          </div>
        </div>
      </section>

      {/* 6. STUDIO STRIP (ORIGINAL PHOTOGRAPHY FROM THEME) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-muted">
            The Environment
          </span>
          <h2 className="text-3xl font-extrabold font-['Poppins']">
            Life at the Studio
          </h2>
          <p className="text-muted text-sm">
            Curious minds, focused execution, and zero unnecessary bureaucracy.
          </p>
        </div>

        {/* 5-photo responsive strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {STUDIO_PHOTOS.map((photo, idx) => (
            <div
              key={idx}
              className="group relative aspect-[3/4] rounded-xl overflow-hidden bg-surface border border-divider shadow-sm"
            >
              <img
                src={photo.src}
                alt={photo.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3 text-white text-xs">
                <span>{photo.alt}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. LATEST FROM BLOG */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-muted block mb-2">
              Writing &amp; Perspectives
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-['Poppins'] tracking-tight">
              From the Studio Journal
            </h2>
          </div>
          <button
            onClick={() => onNavigateTab('blog')}
            className="text-sm font-semibold flex items-center gap-1.5 transition-colors group"
            style={{ color: 'var(--color-primary)' }}
          >
            <span>Read all articles</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ARTICLES.map((article) => (
            <article
              key={article.id}
              onClick={() => onSelectArticle(article)}
              className="group cursor-pointer p-6 rounded-2xl bg-surface border border-divider hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-muted">
                  <span
                    className="font-semibold uppercase tracking-wider text-xs"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    {article.category}
                  </span>
                  <span>{article.readTime}</span>
                </div>
                <h3 className="text-lg font-bold font-['Poppins'] group-hover:text-primary transition-colors leading-snug">
                  {article.title}
                </h3>
                <p className="text-sm text-muted line-clamp-3 leading-relaxed">
                  {article.excerpt}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-divider flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <img
                    src={article.author.avatar}
                    alt={article.author.name}
                    className="w-7 h-7 rounded-full object-cover border border-divider"
                  />
                  <span className="text-xs font-medium text-contrast/80">
                    {article.author.name}
                  </span>
                </div>
                <span className="text-xs font-semibold flex items-center gap-1" style={{ color: 'var(--color-primary)' }}>
                  Read <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 8. CTA BAND */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="relative rounded-3xl p-10 sm:p-16 text-center text-white overflow-hidden shadow-2xl"
          style={{ backgroundColor: 'var(--color-primary-deep)' }}
        >
          {/* Decorative shapes */}
          <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-white/10 blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-white/20">
              New Engagements
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold font-['Poppins'] tracking-tight">
              Have a project in mind? Let&apos;s build something extraordinary.
            </h2>
            <p className="text-white/80 text-base sm:text-lg leading-relaxed">
              We are currently booking projects for next quarter. Tell us about your goals, timelines, and vision.
            </p>
            <div className="pt-2">
              <button
                onClick={() => onNavigateTab('contact')}
                className="px-8 py-4 rounded-xl text-base font-bold bg-white text-black hover:bg-white/95 transition-all shadow-xl hover:scale-105"
              >
                Schedule an Intro Call
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
