"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { QuizAnswer } from "@/lib/types";

interface ProtocolSection {
  title: string;
  content: string;
  icon: string;
}

const SECTION_ICONS: Record<string, string> = {
  "ROOT CAUSE ANALYSIS": "🔬",
  "THE SCIENCE": "⚗️",
  "MORNING PROTOCOL": "🌅",
  "AFTERNOON PROTOCOL": "☀️",
  "EVENING PROTOCOL": "🌙",
  "NUTRITION PROTOCOL": "🌿",
  "SUPPLEMENT STACK": "⚡",
  "WHAT TO EXPECT": "📈",
};

function parseProtocol(raw: string): ProtocolSection[] {
  const parts = raw.split(/^##\s+/m).filter(Boolean);
  return parts.map((part) => {
    const firstNewline = part.indexOf("\n");
    const title = firstNewline > -1 ? part.slice(0, firstNewline).trim() : part.trim();
    const content = firstNewline > -1 ? part.slice(firstNewline + 1).trim() : "";
    return {
      title,
      content,
      icon: SECTION_ICONS[title] || "🔹",
    };
  });
}

function renderContent(content: string): React.ReactNode {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();

    if (!line) { i++; continue; }

    if (line.startsWith("### ")) {
      elements.push(
        <h3 key={i} className="text-[#00D4FF] font-bold text-sm uppercase tracking-wider mt-5 mb-2">
          {line.replace("### ", "")}
        </h3>
      );
    } else if (line.startsWith("- ") || line.startsWith("• ") || line.startsWith("* ")) {
      const text = line.replace(/^[-•*]\s+/, "");
      elements.push(
        <div key={i} className="flex items-start gap-2.5 py-1.5">
          <span className="text-[#00D4FF] text-xs mt-1 flex-shrink-0">→</span>
          <span
            className="text-[#CBD5E1] text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: formatInline(text) }}
          />
        </div>
      );
    } else if (/^\d+\./.test(line)) {
      const text = line.replace(/^\d+\.\s+/, "");
      const num = line.match(/^(\d+)\./)?.[1] || "•";
      elements.push(
        <div key={i} className="flex items-start gap-3 py-1.5">
          <span className="text-[#00D4FF] text-xs font-bold mt-0.5 flex-shrink-0 w-4">{num}.</span>
          <span
            className="text-[#CBD5E1] text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: formatInline(text) }}
          />
        </div>
      );
    } else {
      elements.push(
        <p
          key={i}
          className="text-[#94A3B8] text-sm leading-relaxed mb-3"
          dangerouslySetInnerHTML={{ __html: formatInline(line) }}
        />
      );
    }
    i++;
  }
  return <div className="space-y-0.5">{elements}</div>;
}

function formatInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-[#F5A623] font-semibold">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="text-[#94A3B8]">$1</em>')
    .replace(/`(.+?)`/g, '<code class="text-[#00D4FF] bg-[#00D4FF]/10 px-1 rounded text-xs">$1</code>');
}

function LoadingState() {
  const steps = [
    "Analyzing diagnostic responses...",
    "Identifying root physiological causes...",
    "Cross-referencing research database...",
    "Building your personalized protocol...",
    "Finalizing recommendations...",
  ];
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((s) => Math.min(s + 1, steps.length - 1));
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#050B14] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6">
        {/* Animated circles */}
        <div className="relative w-32 h-32 mx-auto mb-10">
          <div className="absolute inset-0 rounded-full border-2 border-[#00D4FF]/10 animate-ping" />
          <div className="absolute inset-2 rounded-full border-2 border-[#00D4FF]/20 animate-ping" style={{ animationDelay: "0.3s" }} />
          <div className="absolute inset-4 rounded-full border border-[#00D4FF]/30 animate-ping" style={{ animationDelay: "0.6s" }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00D4FF] to-[#0099CC] flex items-center justify-center">
              <span className="text-2xl">🧬</span>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-3">Analyzing Your Biology</h2>
        <p className="text-[#64748B] mb-10 text-sm leading-relaxed">
          Our AI is cross-referencing your responses against peer-reviewed research
          to identify your specific physiological patterns.
        </p>

        {/* Step indicators */}
        <div className="space-y-3">
          {steps.map((s, i) => (
            <div
              key={s}
              className={`flex items-center gap-3 text-sm transition-all duration-500 ${
                i < step
                  ? "text-[#10B981]"
                  : i === step
                  ? "text-white"
                  : "text-[#1E3A5F]"
              }`}
            >
              <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                i < step
                  ? "bg-[#10B981]/20 border border-[#10B981]"
                  : i === step
                  ? "bg-[#00D4FF]/20 border border-[#00D4FF] animate-pulse"
                  : "border border-[#1E3A5F]"
              }`}>
                {i < step ? (
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : i === step ? (
                  <div className="w-2 h-2 rounded-full bg-[#00D4FF]" />
                ) : null}
              </div>
              <span>{s}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PaywallSection({
  onUnlock,
  answers,
}: {
  onUnlock: () => void;
  answers: QuizAnswer[];
}) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubscribe() {
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, answers }),
      });
      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else if (data.error) {
        setError(data.error);
        setLoading(false);
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="relative mt-8">
      {/* Blurred preview rows */}
      <div className="paywall-blur select-none">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card p-6 mb-4 rounded-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#1E3A5F]" />
              <div>
                <div className="h-4 bg-[#1E3A5F] rounded w-32 mb-2" />
                <div className="h-3 bg-[#1E3A5F]/60 rounded w-20" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-[#1E3A5F]/60 rounded w-full" />
              <div className="h-3 bg-[#1E3A5F]/60 rounded w-4/5" />
              <div className="h-3 bg-[#1E3A5F]/60 rounded w-3/5" />
            </div>
          </div>
        ))}
      </div>

      {/* Paywall overlay */}
      <div className="absolute inset-0 flex items-start justify-center pt-8">
        <div className="card glow-cyan rounded-2xl p-8 max-w-md w-full mx-4 relative overflow-hidden">
          {/* Top gradient */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0099CC] via-[#00D4FF] to-[#0099CC]" />

          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#00D4FF]/20 to-[#0099CC]/20 border border-[#00D4FF]/30 flex items-center justify-center text-3xl">
              🔬
            </div>
            <h3 className="text-2xl font-black mb-2">Unlock Your Full Protocol</h3>
            <p className="text-[#64748B] text-sm leading-relaxed">
              Your complete science-backed protocol includes your morning, afternoon & evening routines, nutrition plan, supplement stack, and expected timeline.
            </p>
          </div>

          {/* Bullets */}
          <div className="space-y-2 mb-6">
            {[
              "Complete daily action plan (AM/PM/Evening)",
              "Evidence-based supplement stack with dosages",
              "Personalized nutrition protocol",
              "Week-by-week timeline with expected results",
              "Ongoing protocol updates as science evolves",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2.5 text-sm">
                <div className="w-5 h-5 rounded-full bg-[#10B981]/20 border border-[#10B981]/40 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-[#94A3B8]">{item}</span>
              </div>
            ))}
          </div>

          {/* Pricing */}
          <div className="bg-[#0D1B2A] border border-[#1E3A5F] rounded-xl p-4 mb-6 text-center">
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-3xl font-black text-white">$12.99</span>
              <span className="text-[#64748B]">/month</span>
            </div>
            <p className="text-[#475569] text-xs mt-1">Cancel anytime · Instant access</p>
          </div>

          {/* Email input */}
          <div className="mb-4">
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
              className="w-full bg-[#0D1B2A] border border-[#1E3A5F] rounded-xl px-4 py-3 text-white placeholder-[#475569] focus:outline-none focus:border-[#00D4FF] transition-colors text-sm"
            />
          </div>

          {error && (
            <p className="text-red-400 text-xs mb-3 text-center">{error}</p>
          )}

          <button
            onClick={handleSubscribe}
            disabled={loading}
            className="btn-primary w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-[#050B14]/30 border-t-[#050B14] rounded-full animate-spin" />
                Redirecting to checkout...
              </>
            ) : (
              <>
                Get Full Protocol →
              </>
            )}
          </button>

          <p className="text-center text-[#475569] text-xs mt-3">
            Secured by Stripe · 256-bit SSL encryption
          </p>
        </div>
      </div>
    </div>
  );
}

function ResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [protocol, setProtocol] = useState<string>("");
  const [sections, setSections] = useState<ProtocolSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const hasFetched = useRef(false);

  // FREE sections shown to everyone
  const FREE_SECTIONS = 2;

  useEffect(() => {
    // Check for payment success
    const payment = searchParams.get("payment");
    if (payment === "success") {
      setUnlocked(true);
      sessionStorage.setItem("scimax_unlocked", "true");
    }

    // Check if already unlocked
    if (sessionStorage.getItem("scimax_unlocked") === "true") {
      setUnlocked(true);
    }

    // Load answers
    const saved = sessionStorage.getItem("scimax_answers");
    if (!saved) {
      router.push("/quiz");
      return;
    }
    const parsedAnswers: QuizAnswer[] = JSON.parse(saved);
    setAnswers(parsedAnswers);

    // Check for cached protocol
    const cachedProtocol = sessionStorage.getItem("scimax_protocol");
    if (cachedProtocol && !hasFetched.current) {
      hasFetched.current = true;
      setProtocol(cachedProtocol);
      setSections(parseProtocol(cachedProtocol));
      setLoading(false);
      return;
    }

    // Fetch protocol
    if (hasFetched.current) return;
    hasFetched.current = true;

    fetch("/api/generate-protocol", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers: parsedAnswers }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          const raw = data.protocol;
          setProtocol(raw);
          setSections(parseProtocol(raw));
          sessionStorage.setItem("scimax_protocol", raw);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to generate your protocol. Please try again.");
        setLoading(false);
      });
  }, [router, searchParams]);

  if (loading) return <LoadingState />;

  if (error) {
    return (
      <div className="min-h-screen bg-[#050B14] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-3">Generation Failed</h2>
          <p className="text-[#64748B] mb-6">{error}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => {
                hasFetched.current = false;
                setError("");
                setLoading(true);
                // re-trigger fetch
                const saved = sessionStorage.getItem("scimax_answers");
                if (saved) {
                  fetch("/api/generate-protocol", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ answers: JSON.parse(saved) }),
                  })
                    .then((r) => r.json())
                    .then((d) => {
                      setProtocol(d.protocol);
                      setSections(parseProtocol(d.protocol));
                      setLoading(false);
                    })
                    .catch(() => {
                      setError("Failed again. Please check your API key.");
                      setLoading(false);
                    });
                }
              }}
              className="btn-primary px-6 py-3 rounded-xl font-bold"
            >
              Retry
            </button>
            <button
              onClick={() => router.push("/quiz")}
              className="border border-[#1E3A5F] text-[#94A3B8] hover:text-white px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              Retake Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  const freeSections = sections.slice(0, FREE_SECTIONS);
  const lockedSections = sections.slice(FREE_SECTIONS);

  return (
    <div className="min-h-screen bg-[#050B14]">
      {/* Nav */}
      <nav className="sticky top-0 z-40 border-b border-[#1E3A5F]/50 backdrop-blur-md bg-[#050B14]/90">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-[#475569] hover:text-white transition-colors"
          >
            <div className="w-6 h-6 rounded bg-gradient-to-br from-[#00D4FF] to-[#0099CC] flex items-center justify-center text-[#050B14] font-black text-xs">
              Sx
            </div>
            <span className="font-semibold text-sm">SciMax</span>
          </button>
          <div className="flex items-center gap-2">
            {unlocked ? (
              <div className="flex items-center gap-2 text-[#10B981] text-xs font-semibold bg-[#10B981]/10 border border-[#10B981]/30 px-3 py-1.5 rounded-full">
                <div className="w-2 h-2 bg-[#10B981] rounded-full" />
                Full Access
              </div>
            ) : (
              <div className="flex items-center gap-2 text-[#F5A623] text-xs font-semibold bg-[#F5A623]/10 border border-[#F5A623]/30 px-3 py-1.5 rounded-full">
                <div className="w-2 h-2 bg-[#F5A623] rounded-full animate-pulse" />
                Free Preview
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] text-xs font-semibold px-3 py-1.5 rounded-full mb-4 uppercase tracking-widest">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Diagnostic Complete
          </div>

          <h1 className="text-4xl font-black mb-3">
            Your Personalized{" "}
            <span className="gradient-text">Science Protocol</span>
          </h1>
          <p className="text-[#64748B] leading-relaxed">
            Generated from {answers.length} diagnostic data points across 6 physiological systems.
            This protocol is built specifically for your biology.
          </p>

          {/* Answer summary chips */}
          <div className="flex flex-wrap gap-2 mt-4">
            {["About You", "Facial Appearance", "Hormones", "Sleep", "Nutrition", "Posture", "Stress"].map(
              (cat) => (
                <span
                  key={cat}
                  className="text-xs bg-[#0D1B2A] border border-[#1E3A5F] text-[#64748B] px-2.5 py-1 rounded-full"
                >
                  ✓ {cat}
                </span>
              )
            )}
          </div>
        </div>

        {/* Free sections */}
        <div className="space-y-5">
          {freeSections.map((section) => (
            <div key={section.title} className="card rounded-2xl overflow-hidden">
              <div className="flex items-center gap-3 p-5 border-b border-[#1E3A5F]/50 bg-[#0D1B2A]/50">
                <span className="text-2xl">{section.icon}</span>
                <div>
                  <h2 className="font-bold text-white text-lg">{section.title}</h2>
                </div>
                <div className="ml-auto">
                  <span className="text-xs bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] px-2 py-1 rounded-full">
                    Free Preview
                  </span>
                </div>
              </div>
              <div className="p-6">{renderContent(section.content)}</div>
            </div>
          ))}
        </div>

        {/* Paywall or Locked Sections */}
        {!unlocked ? (
          <PaywallSection onUnlock={() => setUnlocked(true)} answers={answers} />
        ) : (
          <div className="space-y-5 mt-5">
            {lockedSections.map((section) => (
              <div key={section.title} className="card rounded-2xl overflow-hidden">
                <div className="flex items-center gap-3 p-5 border-b border-[#1E3A5F]/50 bg-[#0D1B2A]/50">
                  <span className="text-2xl">{section.icon}</span>
                  <div>
                    <h2 className="font-bold text-white text-lg">{section.title}</h2>
                  </div>
                </div>
                <div className="p-6">{renderContent(section.content)}</div>
              </div>
            ))}

            {/* Unlocked success state */}
            <div className="card rounded-2xl p-8 text-center mt-8 border-[#10B981]/30 bg-[#10B981]/5">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-2">Protocol Complete</h3>
              <p className="text-[#64748B] text-sm leading-relaxed mb-4">
                You now have full access to your personalized science protocol. Follow it consistently for 6 weeks to see measurable changes.
              </p>
              <div className="text-xs text-[#475569]">
                Bookmark this page to reference your protocol anytime.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <ResultsContent />
    </Suspense>
  );
}
