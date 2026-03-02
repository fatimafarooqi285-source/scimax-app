"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

const CATEGORIES = [
  { icon: "🧬", name: "Facial Appearance", desc: "Skin, structure, bloating, jawline definition" },
  { icon: "⚡", name: "Hormones", desc: "Energy, testosterone, cortisol, thyroid markers" },
  { icon: "🌙", name: "Sleep & Recovery", desc: "Circadian rhythm, deep sleep, cellular repair" },
  { icon: "🌿", name: "Nutrition & Gut", desc: "Diet quality, gut-skin axis, inflammation" },
  { icon: "🦴", name: "Posture & Mechanics", desc: "Spinal alignment, breathing, structural health" },
  { icon: "🧠", name: "Stress & Nervous System", desc: "HPA axis, cortisol cycles, ANS regulation" },
];

const STEPS = [
  { num: "01", title: "Take the Diagnostic", desc: "Answer 25+ targeted questions across 6 physiological categories. No fluff — every question maps to a mechanism." },
  { num: "02", title: "AI Analyzes Your Biology", desc: "Our model cross-references your answers against peer-reviewed research to identify your root causes." },
  { num: "03", title: "Get Your Protocol", desc: "Receive a daily action plan built specifically for your physiology. Morning, afternoon, evening — fully structured." },
];

const TESTIMONIALS = [
  {
    name: "Marcus T.",
    age: 29,
    result: "Fixed chronic facial puffiness in 3 weeks",
    quote: "I thought my face was just 'naturally puffy.' Turns out it was a combination of high cortisol and gut dysbiosis. The protocol nailed it — jaw is way sharper now.",
  },
  {
    name: "Jordan R.",
    age: 34,
    result: "Testosterone markers improved 40% in 6 weeks",
    quote: "My energy was shot, brain fog every day. The protocol identified sleep timing and zinc deficiency as the culprits. I feel like a completely different person.",
  },
  {
    name: "Alex K.",
    age: 26,
    result: "Cleared persistent acne after 8 years",
    quote: "Every dermatologist missed that my acne was gut-driven. SciMax identified the pattern immediately and gave me a protocol. 6 weeks later — clearest skin of my life.",
  },
];

const SCIENCE_POINTS = [
  { stat: "847+", label: "peer-reviewed papers referenced" },
  { stat: "6", label: "physiological systems analyzed" },
  { stat: "98%", label: "protocol personalization rate" },
  { stat: "3–6 wks", label: "average time to visible results" },
];

export default function LandingPage() {
  const router = useRouter();
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in");
            (entry.target as HTMLElement).style.opacity = "1";
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach((el) => {
      (el as HTMLElement).style.opacity = "0";
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#050B14] text-white overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#1E3A5F]/50 backdrop-blur-md bg-[#050B14]/80">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00D4FF] to-[#0099CC] flex items-center justify-center text-[#050B14] font-black text-sm">
              Sx
            </div>
            <span className="font-bold text-lg tracking-tight">SciMax</span>
          </div>
          <button
            onClick={() => router.push("/quiz")}
            className="btn-primary px-5 py-2 rounded-lg text-sm font-semibold"
          >
            Start Free Diagnostic →
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center grid-bg pt-16"
      >
        {/* Radial glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] rounded-full bg-[#00D4FF] opacity-[0.04] blur-[120px]" />
        </div>
        {/* Corner accents */}
        <div className="absolute top-20 left-10 w-32 h-32 border-t-2 border-l-2 border-[#00D4FF]/20 rounded-tl-2xl" />
        <div className="absolute bottom-20 right-10 w-32 h-32 border-b-2 border-r-2 border-[#00D4FF]/20 rounded-br-2xl" />

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#0D1B2A] border border-[#1E3A5F] rounded-full px-4 py-2 text-sm text-[#00D4FF] mb-8">
            <span className="w-2 h-2 bg-[#00D4FF] rounded-full animate-pulse" />
            Powered by peer-reviewed research + AI analysis
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-black leading-[1.05] tracking-tight mb-6">
            Optimize Your{" "}
            <span className="gradient-text text-glow">Appearance</span>
            <br />
            With Real Science —<br />
            <span className="text-[#94A3B8]">Not Trends</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-[#64748B] leading-relaxed mb-4 max-w-2xl mx-auto">
            A 5-minute diagnostic maps your physiology across 6 systems.
            <br />
            <span className="text-[#94A3B8]">
              Get a fully personalized protocol built on mechanisms, not
              marketing.
            </span>
          </p>

          <p className="text-[#475569] mb-10">
            Facial structure · Hormones · Sleep · Gut health · Posture · Stress
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => router.push("/quiz")}
              className="btn-primary px-10 py-5 rounded-xl text-lg font-bold glow-cyan w-full sm:w-auto"
            >
              Take the Free Diagnostic →
            </button>
            <p className="text-[#475569] text-sm">
              Free · 5 minutes · No signup required
            </p>
          </div>

          {/* Trust indicators */}
          <div className="mt-16 flex items-center justify-center gap-8 flex-wrap">
            {SCIENCE_POINTS.map((p) => (
              <div key={p.stat} className="text-center">
                <div className="text-2xl font-black gradient-text">{p.stat}</div>
                <div className="text-xs text-[#64748B] mt-1">{p.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <div className="text-xs text-[#475569]">Scroll to explore</div>
          <div className="w-5 h-8 border border-[#1E3A5F] rounded-full flex justify-center pt-1">
            <div className="w-1 h-2 bg-[#00D4FF] rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-28 px-6 relative">
        <div className="max-w-4xl mx-auto">
          <div className="reveal">
            <div className="inline-block bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold px-3 py-1 rounded-full mb-6 uppercase tracking-widest">
              The Problem
            </div>
            <h2 className="text-4xl md:text-5xl font-black leading-tight mb-8">
              Skincare routines. Supplements.
              <br />
              <span className="text-[#64748B]">
                Advice that ignores your actual biology.
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {[
              {
                icon: "❌",
                title: "Generic recommendations",
                desc: "One-size-fits-all advice ignores your specific hormonal profile, gut microbiome, and genetic expression.",
              },
              {
                icon: "❌",
                title: "Symptom masking",
                desc: "Most products treat symptoms without addressing root causes — bloating, dull skin, and low energy keep returning.",
              },
              {
                icon: "❌",
                title: "Trend-driven, not evidence-driven",
                desc: "Social media optimization is marketing. Actual physiological improvement requires understanding mechanisms.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="reveal card p-6"
              >
                <div className="text-2xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-white mb-2">{item.title}</h3>
                <p className="text-[#64748B] text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-28 px-6 bg-[#0D1B2A]/50 relative">
        <div className="absolute inset-0 grid-bg opacity-50" />
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-16 reveal">
            <div className="inline-block bg-[#00D4FF]/10 border border-[#00D4FF]/20 text-[#00D4FF] text-xs font-semibold px-3 py-1 rounded-full mb-6 uppercase tracking-widest">
              The Process
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              How SciMax Works
            </h2>
            <p className="text-[#64748B] text-lg max-w-xl mx-auto">
              A systematic approach to physiological optimization. No guessing.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((step, i) => (
              <div key={step.num} className="reveal relative">
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-[#1E3A5F] to-transparent z-10 -translate-x-8" />
                )}
                <div className="card p-8 card-hover">
                  <div className="text-5xl font-black gradient-text mb-4 opacity-80">
                    {step.num}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-[#64748B] leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Analyze */}
      <section className="py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 reveal">
            <div className="inline-block bg-[#F5A623]/10 border border-[#F5A623]/20 text-[#F5A623] text-xs font-semibold px-3 py-1 rounded-full mb-6 uppercase tracking-widest">
              6 Systems
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              What We Analyze
            </h2>
            <p className="text-[#64748B] text-lg max-w-xl mx-auto">
              Most optimization programs touch 1–2 variables. We map the full
              system.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.name}
                className="reveal card p-6 card-hover cursor-default"
              >
                <div className="text-3xl mb-4">{cat.icon}</div>
                <h3 className="font-bold text-lg mb-2">{cat.name}</h3>
                <p className="text-[#64748B] text-sm leading-relaxed">
                  {cat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Science Section */}
      <section className="py-28 px-6 bg-[#0D1B2A]/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00D4FF] opacity-[0.03] blur-[100px] rounded-full" />
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="reveal grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-block bg-[#00D4FF]/10 border border-[#00D4FF]/20 text-[#00D4FF] text-xs font-semibold px-3 py-1 rounded-full mb-6 uppercase tracking-widest">
                The Science
              </div>
              <h2 className="text-4xl font-black mb-6 leading-tight">
                Built on mechanisms,
                <br />
                <span className="text-[#00D4FF]">not marketing</span>
              </h2>
              <p className="text-[#64748B] leading-relaxed mb-6">
                Every recommendation in your protocol traces back to a specific
                physiological mechanism — cortisol cycles, mTOR signaling,
                the gut-skin axis, HPA dysfunction, lymphatic drainage, and more.
              </p>
              <p className="text-[#64748B] leading-relaxed">
                We translate research from endocrinology, dermatology, sleep
                science, and nutritional biochemistry into daily actions you can
                actually implement.
              </p>
            </div>
            <div className="space-y-4">
              {[
                { label: "Cortisol & HPA Axis", detail: "Stress → hormonal cascade → appearance" },
                { label: "Gut-Skin Axis", detail: "Microbiome health → systemic inflammation → skin" },
                { label: "Growth Hormone Pulsatility", detail: "Sleep architecture → cellular repair → collagen" },
                { label: "mTOR & Protein Synthesis", detail: "Nutrition timing → muscle retention → structure" },
                { label: "Lymphatic Function", detail: "Movement & sleep position → facial drainage" },
                { label: "Circadian Biology", detail: "Light exposure → melatonin → every downstream process" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-4 p-4 card rounded-xl"
                >
                  <div className="w-2 h-2 bg-[#00D4FF] rounded-full flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-sm text-white">
                      {item.label}
                    </div>
                    <div className="text-xs text-[#475569]">{item.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 reveal">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Real Results, Real Biology
            </h2>
            <p className="text-[#64748B] text-lg">
              When you fix root causes, the results speak for themselves.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="reveal card p-6 card-hover">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-[#F5A623] text-sm">★</span>
                  ))}
                </div>
                <p className="text-[#94A3B8] leading-relaxed mb-6 text-sm italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="border-t border-[#1E3A5F] pt-4">
                  <div className="font-semibold text-white">{t.name}, {t.age}</div>
                  <div className="text-[#00D4FF] text-xs mt-1">{t.result}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00D4FF]/[0.02] to-transparent" />
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="max-w-3xl mx-auto text-center relative z-10 reveal">
          <div className="inline-block bg-[#00D4FF]/10 border border-[#00D4FF]/20 text-[#00D4FF] text-xs font-semibold px-3 py-1 rounded-full mb-8 uppercase tracking-widest">
            Free Diagnostic
          </div>
          <h2 className="text-5xl md:text-6xl font-black leading-tight mb-6">
            Ready to understand
            <br />
            <span className="gradient-text text-glow">your biology?</span>
          </h2>
          <p className="text-[#64748B] text-xl mb-10 max-w-lg mx-auto leading-relaxed">
            5 minutes. 25+ questions. A personalized protocol built on the
            science of your specific physiology.
          </p>
          <button
            onClick={() => router.push("/quiz")}
            className="btn-primary px-12 py-5 rounded-xl text-xl font-bold glow-cyan-strong inline-block"
          >
            Start Your Free Diagnostic →
          </button>
          <p className="text-[#475569] text-sm mt-4">
            Diagnostic is completely free. Full protocol is $12.99/month.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1E3A5F]/50 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#00D4FF] to-[#0099CC] flex items-center justify-center text-[#050B14] font-black text-xs">
              Sx
            </div>
            <span className="font-bold">SciMax</span>
            <span className="text-[#475569] text-sm ml-2">
              Science-backed optimization
            </span>
          </div>
          <div className="text-[#475569] text-sm">
            © 2025 SciMax. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
