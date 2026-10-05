import React, { useState } from 'react';
import { SERVICES } from '../data/portfolioData';
import { Check, ArrowRight, Calculator, Layers, Code, Palette, Sparkles } from 'lucide-react';

interface ServicesPageProps {
  onNavigateTab: (tab: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onNavigateTab }) => {
  const [selectedServices, setSelectedServices] = useState<string[]>([SERVICES[0].id, SERVICES[1].id]);
  const [timeline, setTimeline] = useState<'standard' | 'accelerated' | 'retainer'>('standard');

  const toggleService = (id: string) => {
    if (selectedServices.includes(id)) {
      if (selectedServices.length > 1) {
        setSelectedServices(selectedServices.filter((s) => s !== id));
      }
    } else {
      setSelectedServices([...selectedServices, id]);
    }
  };

  const getEstimatedBudget = () => {
    let base = selectedServices.length * 12000;
    if (timeline === 'accelerated') base *= 1.3;
    if (timeline === 'retainer') return '$9,500 / month';
    return `$${base.toLocaleString()} - $${(base * 1.4).toLocaleString()}`;
  };

  const processStages = [
    {
      num: '01',
      title: 'Discovery & Strategic Framing',
      time: 'Weeks 1-2',
      desc: 'We conduct stakeholder interviews, audit competitor ecosystems, define technical constraints, and crystalize project goals into clear acceptance criteria.',
    },
    {
      num: '02',
      title: 'Architecture & Visual Explorations',
      time: 'Weeks 3-4',
      desc: 'Rapid iteration of high-fidelity prototypes, typographic scales, design tokens, and user journeys tested with real personas before writing code.',
    },
    {
      num: '03',
      title: 'Full-Stack Development & Polish',
      time: 'Weeks 5-8',
      desc: 'Production-grade software engineering using TypeScript, modern reactive frameworks, accessible micro-interactions, and 60fps animations.',
    },
    {
      num: '04',
      title: 'Launch, QA & Team Enablement',
      time: 'Weeks 9-10',
      desc: 'Rigorous cross-browser testing, SEO audits, documentation handover, and workshops to train your in-house team on maintaining the system.',
    },
  ];

  return (
    <div className="pt-32 pb-24 space-y-24">
      {/* Services Header */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <span className="text-xs font-bold uppercase tracking-widest text-muted">
          Studio Capabilities
        </span>
        <h1 className="text-4xl sm:text-6xl font-extrabold font-['Poppins'] tracking-tight">
          Comprehensive Design &amp; Technology Practices
        </h1>
        <p className="text-muted text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
          From early-stage product conceptualization to high-scale digital platforms, we provide deep craft without agency bloat.
        </p>
      </section>

      {/* Services Deep Dive */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {SERVICES.map((srv, idx) => (
            <div
              key={srv.id}
              className="p-8 sm:p-10 rounded-3xl bg-surface border border-divider space-y-6 hover:shadow-xl transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm text-muted font-bold">
                  0{idx + 1}
                </span>
                <span
                  className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                >
                  Core Practice
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-bold font-['Poppins']">{srv.title}</h3>
                <p className="text-sm font-medium mt-1" style={{ color: 'var(--color-primary)' }}>
                  {srv.tagline}
                </p>
              </div>

              <p className="text-sm text-muted leading-relaxed">
                {srv.description}
              </p>

              <div className="space-y-2.5 pt-4 border-t border-divider">
                <div className="text-xs font-semibold uppercase tracking-wider text-contrast/80">
                  Deliverables included:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {srv.deliverables.map((item) => (
                    <div key={item} className="flex items-center space-x-2 text-xs text-muted">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4-Stage Process */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-muted">
            Methodology
          </span>
          <h2 className="text-3xl font-extrabold font-['Poppins']">
            Our 4-Phase Delivery Framework
          </h2>
          <p className="text-muted text-sm">
            Predictable sprints, transparent milestones, and zero unpleasant surprises.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {processStages.map((stage) => (
            <div
              key={stage.num}
              className="p-6 rounded-2xl bg-surface border border-divider space-y-3 relative overflow-hidden"
            >
              <div className="text-3xl font-black font-['Poppins'] text-contrast/20">
                {stage.num}
              </div>
              <div className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-primary)' }}>
                {stage.time}
              </div>
              <h4 className="text-lg font-bold font-['Poppins'] leading-snug">
                {stage.title}
              </h4>
              <p className="text-xs text-muted leading-relaxed">
                {stage.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Scope & Estimate Tool */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-surface border border-divider shadow-lg space-y-8">
          <div className="flex items-center space-x-3">
            <Calculator className="w-6 h-6" style={{ color: 'var(--color-primary)' }} />
            <div>
              <h3 className="text-xl sm:text-2xl font-bold font-['Poppins']">
                Interactive Project Scope Estimator
              </h3>
              <p className="text-xs sm:text-sm text-muted">
                Configure your desired capabilities to see typical investment ranges.
              </p>
            </div>
          </div>

          {/* Select services */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-contrast/90 block">
              1. Select Project Tracks (Choose 1 or more)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SERVICES.map((srv) => {
                const isSelected = selectedServices.includes(srv.id);
                return (
                  <button
                    key={srv.id}
                    onClick={() => toggleService(srv.id)}
                    className={`p-4 rounded-xl text-left border transition-all flex items-start justify-between ${
                      isSelected
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : 'border-divider bg-base hover:border-contrast/30'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-semibold text-contrast">{srv.title}</div>
                      <div className="text-xs text-muted mt-0.5">{srv.tagline}</div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center border mt-0.5 ${
                        isSelected
                          ? 'border-primary bg-primary text-white'
                          : 'border-divider'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Select timeline */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-contrast/90 block">
              2. Target Engagement Rhythm
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'standard', label: 'Standard (8-12 wks)' },
                { id: 'accelerated', label: 'Sprint (4-6 wks)' },
                { id: 'retainer', label: 'Ongoing Retainer' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setTimeline(opt.id as any)}
                  className={`p-3 rounded-xl text-center text-xs font-semibold border transition-all ${
                    timeline === opt.id
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-divider bg-base text-muted'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Result banner */}
          <div className="p-6 rounded-2xl bg-base border border-divider flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xs text-muted uppercase font-semibold">Estimated Engagement Tier</div>
              <div className="text-2xl sm:text-3xl font-extrabold font-['Poppins']" style={{ color: 'var(--color-primary)' }}>
                {getEstimatedBudget()}
              </div>
              <div className="text-xs text-muted mt-1">Includes all deliverables, source code, and handover documentation.</div>
            </div>

            <button
              onClick={() => onNavigateTab('contact')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-white shadow-md transition-transform hover:scale-105 shrink-0 flex items-center justify-center gap-2"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              <span>Lock in This Scope</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
