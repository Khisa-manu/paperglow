import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Mail, Phone, MapPin, Send, CheckCircle2, ChevronDown, Clock, ShieldCheck } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: 'New Web App',
    budget: '$50k - $100k',
    timeline: 'Within 2-3 months',
    message: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const projectTypes = [
    'New Web App',
    'Rebrand & Identity',
    'Design System',
    'Mobile Experience',
    'Advisory / Retainer',
  ];

  const budgetTiers = [
    '$25k - $50k',
    '$50k - $100k',
    '$100k - $250k',
    '$250k+',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }, 600);
  };

  const faqs = [
    {
      q: 'What is your typical turnaround time for a full engagement?',
      a: 'Most comprehensive design and full-stack development projects run between 8 and 12 weeks. Focused design system sprints or brand identity packages can be delivered in 4 to 6 weeks.',
    },
    {
      q: 'Do you work with early-stage venture-backed startups?',
      a: 'Yes. Approximately 40% of our portfolio consists of Seed and Series A companies needing to establish enterprise-grade credibility before major market launches.',
    },
    {
      q: 'Who owns the intellectual property and code at project close?',
      a: 'You do. 100% of all design tokens, Figma component libraries, typography licenses, vector marks, and clean TypeScript source code are transferred to your organization upon final invoice settlement.',
    },
    {
      q: 'Can our in-house engineering team collaborate with your developers during sprints?',
      a: 'We welcome it. We frequently run shared GitHub pull requests and Slack channels directly with your engineering leads to ensure zero friction at handover.',
    },
  ];

  return (
    <div className="pt-32 pb-24 space-y-20">
      {/* Contact Header */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <span className="text-xs font-bold uppercase tracking-widest text-muted">
          Initiate Contact
        </span>
        <h1 className="text-4xl sm:text-6xl font-extrabold font-['Poppins'] tracking-tight">
          Let&apos;s Build Something Lasting Together
        </h1>
        <p className="text-muted text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
          Tell us about your organization, current challenges, and project vision. We respond within 24 business hours.
        </p>
      </section>

      {/* Main Grid: Form + Studio Info */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Form Column */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-12 rounded-3xl bg-surface border border-divider shadow-xl">
              {isSubmitted ? (
                <div className="text-center py-12 space-y-5 animate-in fade-in zoom-in-95 duration-300">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold font-['Poppins']">
                    Inquiry Received!
                  </h3>
                  <p className="text-muted text-sm sm:text-base max-w-md mx-auto leading-relaxed">
                    Thank you for reaching out, <span className="font-semibold text-contrast">{formData.name}</span>. A studio partner has received your project details and will reply to <span className="font-semibold text-contrast">{formData.email}</span> shortly.
                  </p>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({
                        name: '',
                        email: '',
                        projectType: 'New Web App',
                        budget: '$50k - $100k',
                        timeline: 'Within 2-3 months',
                        message: '',
                      });
                    }}
                    className="text-xs font-semibold underline hover:text-primary pt-4 block mx-auto"
                  >
                    Submit another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name and Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-contrast/90">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Elena Vance"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-base border border-divider text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-contrast/90">
                        Work Email *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="elena@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-base border border-divider text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                      />
                    </div>
                  </div>

                  {/* Project Type */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-contrast/90 block">
                      Project Nature
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {projectTypes.map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setFormData({ ...formData, projectType: type })}
                          className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-all ${
                            formData.projectType === type
                              ? 'border-primary bg-primary text-white'
                              : 'border-divider bg-base text-muted hover:text-contrast'
                          }`}
                          style={{
                            backgroundColor: formData.projectType === type ? 'var(--color-primary)' : undefined,
                          }}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Budget Tier */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-contrast/90 block">
                      Anticipated Budget Range
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {budgetTiers.map((tier) => (
                        <button
                          key={tier}
                          type="button"
                          onClick={() => setFormData({ ...formData, budget: tier })}
                          className={`p-2.5 rounded-xl text-xs font-medium border transition-all text-center ${
                            formData.budget === tier
                              ? 'border-primary bg-primary/10 text-primary font-bold'
                              : 'border-divider bg-base text-muted hover:text-contrast'
                          }`}
                        >
                          {tier}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-contrast/90">
                      Project Overview &amp; Goals *
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Please summarize what you are looking to build, your current technical stack, and any target launch dates..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-base border border-divider text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-sm resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl text-base font-bold text-white shadow-lg transition-transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  >
                    {isSubmitting ? (
                      <span>Sending inquiry...</span>
                    ) : (
                      <>
                        <span>Submit Project Brief</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Info Column */}
          <div className="lg:col-span-5 space-y-8">
            {/* Direct Coordinates */}
            <div className="p-8 rounded-3xl bg-surface border border-divider space-y-6">
              <h3 className="text-xl font-bold font-['Poppins']">
                Studio Coordinates
              </h3>

              <div className="space-y-4 text-sm">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 shrink-0 mt-0.5" style={{ color: 'var(--color-primary)' }} />
                  <div>
                    <div className="font-semibold text-contrast">San Francisco Studio</div>
                    <div className="text-muted">350 Mission Street, Floor 18<br />San Francisco, CA 94105</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 shrink-0 mt-0.5" style={{ color: 'var(--color-primary)' }} />
                  <div>
                    <div className="font-semibold text-contrast">Direct Inquiries</div>
                    <a href="mailto:hello@creativeagency.design" className="text-muted hover:underline">
                      hello@creativeagency.design
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 shrink-0 mt-0.5" style={{ color: 'var(--color-primary)' }} />
                  <div>
                    <div className="font-semibold text-contrast">Direct Line</div>
                    <div className="text-muted">+1 (415) 890-4122</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 shrink-0 mt-0.5" style={{ color: 'var(--color-primary)' }} />
                  <div>
                    <div className="font-semibold text-contrast">Hours of Operation</div>
                    <div className="text-muted">Monday – Friday: 9am – 6pm PST</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Guarantees */}
            <div className="p-6 rounded-2xl bg-base border border-divider space-y-3">
              <div className="flex items-center space-x-2 text-sm font-semibold text-contrast">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Non-Disclosure Agreement Guarantee</span>
              </div>
              <p className="text-xs text-muted leading-relaxed">
                We handle unreleased product concepts with strict confidentiality. Standard mutual NDAs can be signed prior to our first deep discovery session.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="text-center mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-muted">
            Got Questions?
          </span>
          <h2 className="text-3xl font-extrabold font-['Poppins']">
            Working With the Studio
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-surface border border-divider overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between font-semibold text-base font-['Poppins']"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-muted transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-primary' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-sm text-muted leading-relaxed border-t border-divider/50 pt-3 animate-in fade-in duration-150">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
