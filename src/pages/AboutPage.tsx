import React from 'react';
import { Award, Compass, ShieldCheck, Zap } from 'lucide-react';
import { FACTS } from '../data/portfolioData';

interface AboutPageProps {
  onNavigateTab: (tab: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigateTab }) => {
  const team = [
    {
      name: 'Maya Lin',
      role: 'Founding Partner & Design Principal',
      bio: 'Former principal at top international studios. Specializes in typography systems, spatial interfaces, and multi-brand design tokens.',
      image: '/assets/images/studio-4.webp',
    },
    {
      name: 'David Keller',
      role: 'Creative Director & Brand Lead',
      bio: 'Over 14 years shaping high-growth venture identities. Champion of tactile materiality and editorial clarity.',
      image: '/assets/images/studio-5.webp',
    },
    {
      name: 'Ethan Brooks',
      role: 'Head of Engineering & Systems',
      bio: 'Full-stack software architect specializing in high-performance WebGL, React architectures, and distributed systems.',
      image: '/assets/images/studio-2.webp',
    },
    {
      name: 'Aria Thorne',
      role: 'Design Operations & Client Partner',
      bio: 'Ensures seamless cross-functional alignment between engineering roadmaps, executive vision, and design sprints.',
      image: '/assets/images/studio-1.webp',
    },
  ];

  const values = [
    {
      icon: ShieldCheck,
      title: 'Rigor over Trends',
      desc: 'We eschew fleeting aesthetic gimmicks in favor of resilient visual foundations that communicate authority for a decade.',
    },
    {
      icon: Zap,
      title: 'Design-to-Code Synergy',
      desc: 'No messy handoffs. Our design team writes production code, and our engineers understand kerning, contrast, and layout grids.',
    },
    {
      icon: Compass,
      title: 'Partner-Level Attention',
      desc: 'You work directly with the senior designers and architects who actually craft your product. No junior handoffs or bloated account teams.',
    },
    {
      icon: Award,
      title: 'Measurable Velocity',
      desc: 'We measure success not by design awards, but by conversion rates, component adoption metrics, and engineering velocity.',
    },
  ];

  const milestones = [
    { year: '2014', title: 'Studio Founded in SF', desc: 'Started with 3 designers focused on emerging responsive web paradigms.' },
    { year: '2018', title: 'Design Systems Practice', desc: 'Pioneered token-based multi-platform design systems for enterprise scale.' },
    { year: '2022', title: 'Cross-Disciplinary Expansion', desc: 'Merged industrial product packaging and spatial UI engineering into our core services.' },
    { year: '2026', title: '12 Years of Craft', desc: 'Over 200 shipped digital products, serving clients across 16 countries.' },
  ];

  return (
    <div className="pt-32 pb-24 space-y-24">
      {/* Intro Hero */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <span className="text-xs font-bold uppercase tracking-widest text-muted">
          About the Studio
        </span>
        <h1 className="text-4xl sm:text-6xl font-extrabold font-['Poppins'] tracking-tight">
          Crafting tools, brands, and digital worlds with relentless precision.
        </h1>
        <p className="text-muted text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
          Founded in California in 2014, Creative Agency is an independent design and technology studio. We help ambitious companies translate complex technology into elegant, human-centric experiences.
        </p>
      </section>

      {/* Large Studio Meeting Photo */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden aspect-[16/9] sm:aspect-[21/9] border border-divider shadow-xl bg-surface">
          <img
            src="/assets/images/studio-meeting.webp"
            alt="Studio meeting and design review"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6 sm:p-10">
            <p className="text-white text-sm sm:text-base font-medium max-w-xl">
              Our studio in San Francisco: designed for open critique, physical material testing, and deep-focus engineering sprints.
            </p>
          </div>
        </div>
      </section>

      {/* Core Principles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-muted">
            Our Manifesto
          </span>
          <h2 className="text-3xl font-extrabold font-['Poppins']">
            How We Operate
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((val, i) => {
            const Icon = val.icon;
            return (
              <div
                key={i}
                className="p-8 rounded-2xl bg-surface border border-divider space-y-4 hover:border-primary/50 transition-colors"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-divider)' }}
                >
                  <Icon className="w-6 h-6" style={{ color: 'var(--color-primary)' }} />
                </div>
                <h3 className="text-xl font-bold font-['Poppins']">{val.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{val.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Studio Team */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-muted">
            The Leadership
          </span>
          <h2 className="text-3xl font-extrabold font-['Poppins']">
            Senior Partners on Every Project
          </h2>
          <p className="text-muted text-sm">
            We stay intentionally lean to preserve uncompromised quality and direct communication.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member) => (
            <div
              key={member.name}
              className="rounded-2xl overflow-hidden border border-divider bg-surface space-y-4 p-5 hover:shadow-lg transition-all"
            >
              <div className="aspect-[4/5] rounded-xl overflow-hidden bg-muted/20">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-lg font-['Poppins']">{member.name}</h4>
                <div className="text-xs font-semibold" style={{ color: 'var(--color-primary)' }}>
                  {member.role}
                </div>
                <p className="text-xs text-muted leading-relaxed pt-2">
                  {member.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Studio Milestones */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-muted">
            The Journey
          </span>
          <h2 className="text-3xl font-extrabold font-['Poppins']">
            Key Milestones
          </h2>
        </div>

        <div className="space-y-8 relative before:absolute before:inset-0 before:left-4 md:before:left-1/2 before:-translate-x-1/2 before:w-0.5 before:bg-divider">
          {milestones.map((item, idx) => (
            <div
              key={idx}
              className={`relative flex flex-col md:flex-row items-start ${
                idx % 2 === 0 ? 'md:flex-row-reverse text-left md:text-right' : 'text-left'
              }`}
            >
              <div className="md:w-1/2 p-4 md:px-8">
                <div className="p-6 rounded-2xl bg-surface border border-divider shadow-sm space-y-2">
                  <span
                    className="text-xs font-bold uppercase tracking-widest"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    {item.year}
                  </span>
                  <h4 className="text-lg font-bold font-['Poppins']">{item.title}</h4>
                  <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
                </div>
              </div>
              {/* Circle Marker */}
              <div
                className="absolute left-4 md:left-1/2 -translate-x-1/2 top-8 w-4 h-4 rounded-full border-4 border-base"
                style={{ backgroundColor: 'var(--color-primary)' }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* CTA Band */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="p-10 rounded-3xl bg-surface border border-divider space-y-6">
          <h3 className="text-2xl sm:text-3xl font-bold font-['Poppins']">
            Ready to collaborate with a partner who cares as much as you do?
          </h3>
          <p className="text-muted text-sm sm:text-base max-w-xl mx-auto">
            Reach out directly to discuss your product roadmap, rebrand, or design system rollout.
          </p>
          <button
            onClick={() => onNavigateTab('contact')}
            className="px-8 py-3.5 rounded-xl font-bold text-white shadow-md transition-transform hover:scale-105"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            Start a Conversation
          </button>
        </div>
      </section>
    </div>
  );
};
