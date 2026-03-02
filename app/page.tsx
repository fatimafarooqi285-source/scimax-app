'use client';
import { useState, useEffect, useRef } from 'react';

// ─── DATA ────────────────────────────────────────────────────────────────────

const researchTabs = [
  { label: "😴 Sleep", color: "#6366f1", studies: [
    { stat: "15%", claim: "One week of bad sleep reduces testosterone by up to 15%", source: "Leproult & Van Cauter · JAMA (2011)" },
    { stat: "2×", claim: "Poor sleep doubles the rate at which your skin ages overnight", source: "Oyetakin-White et al. · Clinical and Experimental Dermatology" },
    { stat: "55%", claim: "Sleep-deprived people are 55% more likely to become obese — hunger hormones go haywire", source: "Cappuccio et al. · Sleep (2008)" },
    { stat: "30%", claim: "Just one week of short sleep drops cognitive performance by up to 30%", source: "Van Dongen et al. · Sleep (2003)" },
  ]},
  { label: "⚡ Hormones", color: "#1a56db", studies: [
    { stat: "7×", claim: "Women are 7× more likely to have thyroid problems — yet guidelines were built on male-only studies", source: "Canaris et al. · Archives of Internal Medicine" },
    { stat: "42%", claim: "42% of adults have vitamin D deficiency. Hair loss, low mood, fatigue — all linked.", source: "Forrest & Stuhldreher · Nutrition Research (2011)" },
    { stat: "3×", claim: "Chronic stress triples the rate collagen breaks down in your skin", source: "Choi et al. · Psychoneuroendocrinology" },
    { stat: "25%", claim: "Zinc deficiency — common in active people — cuts testosterone by up to 25%", source: "Prasad et al. · Nutrition (1996)" },
  ]},
  { label: "🥦 Nutrition", color: "#059669", studies: [
    { stat: "95%", claim: "95% of serotonin is made in your gut. Your food is literally your mood.", source: "Yano et al. · Cell (2015)" },
    { stat: "3–6mo", claim: "Hair loss from nutritional deficiency shows up 3–6 months after it starts. Easy to misdiagnose.", source: "Almohanna et al. · Dermatology and Therapy (2019)" },
    { stat: "0.8g", claim: "The RDA protein target is the minimum to survive — not the amount you need to thrive", source: "Phillips et al. · Journal of Nutrition" },
    { stat: "40%", claim: "A whole-food diet reduces inflammatory markers linked to acne, aging, and hair loss by 40%", source: "Psaltopoulou et al. · Annals of Clinical Nutrition" },
  ]},
  { label: "🧠 Posture", color: "#d97706", studies: [
    { stat: "10kg", claim: "Every inch your head moves forward = 10 extra kg of pressure on your spine", source: "Hansraj · Surgical Technology International (2014)" },
    { stat: "30%", claim: "Forward head posture reduces your lung capacity by up to 30%", source: "Dimitriadis et al. · Journal of Bodywork and Movement Therapies" },
    { stat: "70%", claim: "Poor posture increases your nervous system's stress response by up to 70%", source: "Sung · Journal of Physical Therapy Science" },
  ]},
  { label: "💭 Mental Health", color: "#db2777", studies: [
    { stat: "2×", claim: "Women are twice as likely to experience anxiety — largely due to hormonal cycles medicine ignored for decades", source: "Kessler et al. · Archives of General Psychiatry" },
    { stat: "4×", claim: "Chronic stress multiplies cortisol output fourfold, suppressing immunity, hormones, and tissue repair at once", source: "McEwen · New England Journal of Medicine" },
    { stat: "20%", claim: "Burnout shrinks prefrontal cortex density by 20%, making focus and decisions genuinely harder", source: "Savic · Cerebral Cortex (2015)" },
  ]},
];

const diagnostics = [
  { icon: "⚡", title: "Hormonal Architecture", desc: "Are your energy, mood, and body composition being undermined by hormonal disruption?", tags: ["Cortisol", "Sex hormones", "Thyroid", "Adrenal"], free: true, color: "#1a56db" },
  { icon: "😴", title: "Sleep Architecture", desc: "Are you actually recovering when you sleep — or just lying down for hours?", tags: ["Sleep quality", "Recovery", "Circadian rhythm", "Sleep debt"], free: true, color: "#6366f1" },
  { icon: "🥦", title: "Nutritional Gaps", desc: "What specific deficiencies are silently affecting how you look, feel, and think?", tags: ["Protein", "Micronutrients", "Gut health", "Inflammation"], free: false, color: "#059669" },
  { icon: "🦴", title: "Structural Health", desc: "Is how you hold your body quietly compressing your breathing, hormones, and recovery?", tags: ["Spine", "Breathing", "Jaw", "Mobility"], free: false, color: "#d97706" },
  { icon: "💭", title: "Cognitive & Stress Load", desc: "Is chronic mental load physically depleting your ability to focus and make decisions?", tags: ["Stress", "Brain fog", "Emotion", "Burnout"], free: false, color: "#db2777" },
  { icon: "✨", title: "Skin, Hair & Tissue", desc: "What biological process is driving changes in your skin quality, hair, or physical appearance?", tags: ["Collagen", "Hair cycling", "Skin barrier", "Inflammation"], free: false, color: "#0891b2" },
];

const howItWorks = [
  { step: "01", icon: "📋", title: "Answer the assessment", body: "8 minutes. 40–60 questions across six physiological areas.", detail: "No guessing, no vague questions. Every item maps directly to a measurable biological indicator." },
  { step: "02", icon: "🔬", title: "We map your physiology", body: "Your answers are cross-referenced against thousands of peer-reviewed studies.", detail: "This builds a precise picture of where your biological systems are under pressure — and why." },
  { step: "03", icon: "📄", title: "Receive your protocol", body: "A gender-differentiated, evidence-based action plan built for your biology.", detail: "Covers nutrition, sleep, supplementation, lifestyle, and posture. Not a generic template." },
  { step: "04", icon: "📈", title: "Track your progress", body: "Retest every 3 months. Measure real, documented change.", detail: "Your protocol adjusts as your physiology shifts. Progress is visible, not just felt." },
];

const curiosityFacts = [
  { emoji: "🧠", tag: "Gut–Brain Axis", title: "Your gut controls your mood more than your brain does", body: "500 million neurons line your digestive system. 95% of serotonin is produced there — not in the brain. Your diet is literally your mental state." },
  { emoji: "💤", tag: "Sleep Science", title: "You physically age faster when you sleep badly", body: "Growth hormone — the primary cellular repair signal — is almost exclusively released during deep sleep. Bad sleep doesn't just tire you. It breaks you down." },
  { emoji: "🦱", tag: "Hair Loss", title: "Hair loss begins months before you notice it", body: "Follicle miniaturisation starts 3–6 months before any visible thinning. The cause is already active long before the symptom appears." },
  { emoji: "📱", tag: "Posture", title: "Your phone is physically reshaping your spine right now", body: "4+ daily hours of forward head tilt places 27kg of force on the cervical spine. This impairs breathing, elevates cortisol, and compresses the vagal nerve." },
  { emoji: "⚡", tag: "Energy", title: "Afternoon energy crashes are biological — not a character flaw", body: "A natural dip in core body temperature and rising adenosine occur between 1–3pm. Poor sleep and unstable blood sugar make it dramatically worse." },
  { emoji: "🍎", tag: "Food Industry", title: "'Organic', 'natural', and 'clean' have no legal definitions in food labelling", body: "Ultra-processed ingredients, seed oils, and synthetic preservatives can appear under these labels. The food industry isn't regulated on marketing language — only on ingredient lists." },
];

const painPoints = [
  { q: "Why am I exhausted even after 8 hours of sleep?", a: "Sleep quantity ≠ sleep quality. Elevated cortisol, nutrient deficiencies, and poor circadian alignment all prevent restorative rest — regardless of hours." },
  { q: "Why is my hair thinning and nothing works?", a: "Over 70% of diffuse hair loss has a nutritional or hormonal root. Treating the symptom while the underlying biology stays broken produces no lasting result." },
  { q: "Why do I feel foggy and unmotivated most days?", a: "Brain fog is almost never psychological. Disrupted sleep, micronutrient depletion, and elevated cortisol all impair neurotransmitter production at a cellular level." },
  { q: "Why do I look more tired and aged than I feel?", a: "Chronic cortisol, protein deficiency, and sleep debt all accelerate structural tissue breakdown. These are measurable biological processes — not inevitable aging." },
  { q: "Why does my energy crash every afternoon?", a: "This is a circadian signal — amplified by blood sugar instability and poor sleep architecture. It's biological, not laziness." },
  { q: "Why am I not recovering properly from exercise?", a: "Recovery requires hormones, protein, and sleep working together. If any one is disrupted, the whole system stalls." },
];

const genderPoints = {
  women: [
    { icon: "🔄", text: "Hormonal fluctuations across the menstrual cycle change nutritional needs phase by phase. Standard advice ignores this entirely." },
    { icon: "💊", text: "Iron and ferritin deficiency is the #1 cause of diffuse hair thinning in women — routinely misdiagnosed as genetics or stress." },
    { icon: "😰", text: "Cortisol suppresses progesterone, creating a cascading disruption to cycle regularity, sleep, and emotional stability." },
    { icon: "🦋", text: "Thyroid dysfunction is 7× more common in women — with subclinical signs frequently dismissed in standard bloodwork." },
    { icon: "✨", text: "Skin structural integrity is directly oestrogen-dependent. Women's collagen loss is hormonally driven in ways no generic skincare routine addresses." },
    { icon: "⏰", text: "Women's circadian rhythm averages 6 minutes shorter than men's — meaning earlier fatigue and different optimal sleep timing." },
  ],
  men: [
    { icon: "💤", text: "Testosterone production happens almost entirely during sleep. One week of restricted sleep produces measurable hormonal suppression." },
    { icon: "🦱", text: "DHT conversion drives scalp follicle miniaturisation — addressable through targeted nutrition and lifestyle, not just topicals." },
    { icon: "📈", text: "Men's cortisol response to stress lasts significantly longer than women's, compounding cardiovascular and metabolic risk over time." },
    { icon: "⚡", text: "Sweat depletes zinc and magnesium. Active men are especially vulnerable to the testosterone suppression that follows." },
    { icon: "🦴", text: "Forward head posture is more prevalent in men and directly linked to reduced lung capacity and long-term spinal degeneration." },
    { icon: "🥩", text: "Men require far more protein than the RDA to maintain lean mass, regulate hunger hormones, and support proper recovery." },
  ]
};

const sidebarSections = [
  { id: "home", label: "Home", icon: "⌂", group: "Start" },
  { id: "about", label: "About", icon: "◎", group: "Start" },
  { id: "offer", label: "What We Offer", icon: "◇", group: "Our Work" },
  { id: "science", label: "The Science", icon: "🔬", group: "Our Work" },
  { id: "diagnostics", label: "Diagnostics", icon: "△", group: "Our Work" },
  { id: "didyouknow", label: "Did You Know", icon: "💡", group: "Explore" },
  { id: "methodology", label: "Methodology", icon: "📐", group: "Explore" },
  { id: "pricing", label: "Pricing", icon: "◑", group: "Explore" },
];

const facts = [
  { cat: "SLEEP", stat: "15%", text: "Testosterone drop after one week of bad sleep", src: "JAMA" },
  { cat: "GUT", stat: "95%", text: "Serotonin made in the gut, not the brain", src: "Cell" },
  { cat: "POSTURE", stat: "10kg", text: "Extra spinal load per inch of forward head", src: "Surg. Tech. Int'l" },
  { cat: "VITAMIN D", stat: "42%", text: "Adults deficient — most have no idea", src: "Nutrition Research" },
  { cat: "STRESS", stat: "3×", text: "Collagen breakdown under chronic cortisol", src: "Psychoneuroendo." },
  { cat: "PROTEIN", stat: "0.8g", text: "RDA = minimum to survive, not to thrive", src: "J. Nutrition" },
];

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function ProgressBar() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const update = () => {
      const el = document.documentElement;
      const pct = (window.scrollY / (el.scrollHeight - el.clientHeight)) * 100;
      setProgress(Math.min(pct, 100));
    };
    window.addEventListener('scroll', update);
    return () => window.removeEventListener('scroll', update);
  }, []);
  return (
    <div style={{ position: 'fixed', top: 64, left: 232, right: 0, height: 3, background: '#f0f0f0', zIndex: 190 }}>
      <div style={{ height: '100%', background: 'linear-gradient(90deg, #1a56db, #6366f1)', width: `${progress}%`, transition: 'width 0.1s' }} />
    </div>
  );
}

function TLDRBox({ points }: { points: string[] }) {
  return (
    <div style={{ background: '#f0f5ff', border: '1px solid #d0e0ff', borderLeft: '4px solid #1a56db', padding: '20px 24px', marginBottom: 48 }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#1a56db', marginBottom: 12 }}>TL;DR — The short version</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {points.map((p, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13, color: '#334', fontWeight: 400, lineHeight: 1.6 }}>
            <span style={{ color: '#1a56db', flexShrink: 0, fontWeight: 700 }}>→</span>
            {p}
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionTag({ label, color = '#1a56db' }: { label: string; color?: string }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: color + '12', border: `1px solid ${color}30`, borderRadius: 2, padding: '4px 10px', marginBottom: 16 }}>
      <div style={{ width: 6, height: 6, borderRadius: '50%', background: color }} />
      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color }}>{label}</span>
    </div>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState(0);
  const [openQ, setOpenQ] = useState<number | null>(null);
  const [activeFact, setActiveFact] = useState(0);
  const [genderTab, setGenderTab] = useState<'women' | 'men'>('women');
  const [activeSection, setActiveSection] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setActiveFact(p => (p + 1) % facts.length), 4000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const ids = sidebarSections.map(s => s.id);
    const onScroll = () => {
      for (let i = ids.length - 1; i >= 0; i--) {
        const el = document.getElementById(ids[i]);
        if (el && window.scrollY >= el.offsetTop - 130) { setActiveSection(ids[i]); break; }
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setSidebarOpen(false);
  };

  const groups = [...new Set(sidebarSections.map(s => s.group))];

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", background: '#fff', color: '#111', lineHeight: 1.6 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap');
        *{margin:0;padding:0;box-sizing:border-box}
        html{scroll-behavior:smooth}
        body{font-size:15px}

        /* ── NAV ── */
        .nav{position:fixed;top:0;left:0;right:0;z-index:200;height:64px;display:flex;align-items:center;justify-content:space-between;padding:0 28px 0 260px;background:rgba(255,255,255,0.97);backdrop-filter:blur(10px);border-bottom:1px solid #eee}
        .nav-logo{font-family:'Cormorant Garamond',serif;font-size:19px;font-weight:500;color:#111;text-decoration:none;letter-spacing:0.04em}
        .nav-logo b{color:#1a56db;font-weight:600}
        .nav-cta{background:#111;color:#fff;padding:10px 22px;font-size:13px;font-weight:500;text-decoration:none;display:inline-block;transition:background .15s;border:none;cursor:pointer;letter-spacing:.02em}
        .nav-cta:hover{background:#333}
        .nav-tag{font-size:13px;color:#999;font-weight:300}
        .menu-btn{display:none;background:none;border:none;font-size:22px;cursor:pointer;color:#111}

        /* ── SIDEBAR ── */
        .sidebar{position:fixed;left:0;top:0;bottom:0;width:232px;z-index:150;background:#fff;border-right:1px solid #eee;display:flex;flex-direction:column;padding-top:64px;overflow-y:auto}
        .sb-brand{padding:20px 20px 16px;border-bottom:1px solid #f0f0f0}
        .sb-brand-name{font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:500;color:#111}
        .sb-brand-name b{color:#1a56db}
        .sb-brand-sub{font-size:11px;color:#bbb;margin-top:3px;font-weight:300}
        .sb-group{font-size:9px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:#ccc;padding:14px 20px 5px}
        .sb-item{display:flex;align-items:center;gap:9px;padding:9px 20px;cursor:pointer;font-size:13px;color:#777;transition:all .15s;border-left:2px solid transparent;text-decoration:none}
        .sb-item:hover{color:#111;background:#f8f9ff}
        .sb-item.active{color:#1a56db;background:#f0f5ff;border-left-color:#1a56db;font-weight:500}
        .sb-icon{font-size:12px;opacity:.7;width:16px;text-align:center}
        .sb-footer{margin-top:auto;padding:16px 20px;border-top:1px solid #f0f0f0}
        .sb-footer-note{font-size:11px;color:#bbb;line-height:1.6}
        .sb-cta-link{display:inline-block;margin-top:10px;font-size:12px;font-weight:600;color:#1a56db;text-decoration:none;letter-spacing:.04em}

        /* ── LAYOUT ── */
        .main{margin-left:232px;padding-top:64px}

        /* ── HERO ── */
        .hero{display:grid;grid-template-columns:1fr 1fr;gap:64px;padding:72px 48px 64px;align-items:center;max-width:1100px}
        .eyebrow{font-size:10px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:#1a56db;margin-bottom:18px}
        .hero h1{font-family:'Cormorant Garamond',serif;font-size:52px;font-weight:500;line-height:1.1;margin-bottom:20px;letter-spacing:-.01em}
        .hero h1 b{font-weight:600;color:#1a56db}
        .hero-body{font-size:15px;font-weight:300;color:#555;line-height:1.8;margin-bottom:12px;max-width:460px}
        .hero-note{font-size:12px;color:#aaa;margin-top:14px}
        .cta-row{display:flex;gap:12px;flex-wrap:wrap;margin-top:28px}
        .btn-dark{background:#111;color:#fff;padding:13px 26px;font-size:13px;font-weight:500;text-decoration:none;display:inline-block;transition:background .15s;border:none;cursor:pointer}
        .btn-dark:hover{background:#333}
        .btn-ghost{background:transparent;color:#111;border:1.5px solid #111;padding:12px 26px;font-size:13px;font-weight:500;text-decoration:none;display:inline-block;transition:all .15s;cursor:pointer}
        .btn-ghost:hover{background:#111;color:#fff}
        .btn-blue{background:#1a56db;color:#fff;padding:13px 26px;font-size:13px;font-weight:500;text-decoration:none;display:inline-block;transition:background .15s;border:none;cursor:pointer}
        .btn-blue:hover{background:#1447b8}

        /* ── FACT CARD ── */
        .fact-card{background:#111;padding:36px;position:relative;overflow:hidden}
        .fact-card::before{content:'';position:absolute;top:-50px;right:-50px;width:180px;height:180px;border-radius:50%;background:radial-gradient(circle,rgba(26,86,219,.18) 0%,transparent 70%);pointer-events:none}
        .fact-cat{font-size:9px;letter-spacing:.18em;color:#1a56db;text-transform:uppercase;font-weight:700;margin-bottom:6px}
        .fact-stat{font-family:'Cormorant Garamond',serif;font-size:72px;font-weight:400;color:#fff;line-height:1;margin-bottom:10px}
        .fact-text{font-size:16px;color:rgba(255,255,255,.82);font-weight:300;line-height:1.55;margin-bottom:10px}
        .fact-src{font-size:10px;color:rgba(255,255,255,.3);letter-spacing:.06em}
        .fact-dots{display:flex;gap:5px;margin-top:24px}
        .fact-dot{width:4px;height:4px;border-radius:50%;background:rgba(255,255,255,.2);cursor:pointer;transition:all .3s}
        .fact-dot.on{background:#1a56db;width:16px;border-radius:2px}

        /* ── BARS & GRIDS ── */
        .press-bar{border-top:1px solid #eee;border-bottom:1px solid #eee;padding:16px 48px;display:flex;align-items:center;gap:12px;flex-wrap:wrap}
        .press-lbl{font-size:9px;color:#ccc;letter-spacing:.12em;text-transform:uppercase;white-space:nowrap;margin-right:12px;font-weight:600}
        .press-item{font-size:12px;color:#ccc;font-weight:500;letter-spacing:.04em;white-space:nowrap}

        .stats-row{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:#eee}
        .stat-card{background:#fff;padding:28px 24px;text-align:center}
        .stat-num{font-family:'Cormorant Garamond',serif;font-size:40px;font-weight:500;line-height:1;margin-bottom:6px}
        .stat-num b{color:#1a56db}
        .stat-lbl{font-size:12px;color:#888;font-weight:300;line-height:1.5}

        /* ── SECTIONS ── */
        .sec{padding:80px 48px}
        .sec-inner{max-width:1100px}
        .sec-bg{background:#fafafa}
        .sec-dark{background:#111}

        .sec-h2{font-family:'Cormorant Garamond',serif;font-size:40px;font-weight:500;line-height:1.15;margin-bottom:16px}
        .sec-h2 b{font-weight:600}
        .sec-sub{font-size:15px;color:#555;font-weight:300;line-height:1.8;max-width:540px;margin-bottom:12px}

        /* ── RESEARCH TABS ── */
        .tabs{display:flex;gap:0;border-bottom:2px solid #eee;margin-bottom:36px;flex-wrap:wrap}
        .tab{padding:10px 18px;font-size:13px;font-weight:500;color:#aaa;cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-2px;transition:all .15s;white-space:nowrap}
        .tab.on{color:#111;border-bottom-color:#111}

        .studies-grid{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:#eee}
        .study{background:#fff;padding:28px 24px;transition:background .15s}
        .study:hover{background:#f7f9ff}
        .study-stat{font-family:'Cormorant Garamond',serif;font-size:46px;font-weight:500;line-height:1;margin-bottom:10px}
        .study-claim{font-size:14px;font-weight:400;color:#111;line-height:1.55;margin-bottom:10px}
        .study-src{font-size:11px;color:#aaa}

        /* ── HOW IT WORKS ── */
        .how-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:#eee}
        .how-card{background:#fff;padding:32px 24px;border-left:3px solid transparent;transition:border-color .2s}
        .how-card:hover{border-left-color:#1a56db}
        .how-step-num{font-size:10px;color:#1a56db;font-weight:700;letter-spacing:.14em;margin-bottom:12px}
        .how-emoji{font-size:26px;margin-bottom:14px;display:block}
        .how-title{font-size:15px;font-weight:600;margin-bottom:8px;line-height:1.3}
        .how-body{font-size:13px;font-weight:500;color:#111;line-height:1.6;margin-bottom:8px}
        .how-detail{font-size:12px;font-weight:300;color:#888;line-height:1.65}

        /* ── DIAGNOSTICS ── */
        .diag-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:#eee}
        .diag-card{background:#fff;padding:28px 22px;position:relative;transition:background .15s}
        .diag-card:hover{background:#f7f9ff}
        .diag-badge{position:absolute;top:16px;right:16px;font-size:9px;letter-spacing:.1em;text-transform:uppercase;padding:3px 8px;font-weight:700}
        .diag-badge.free{color:#059669;border:1.5px solid #059669}
        .diag-badge.paid{background:#111;color:#fff}
        .diag-icon{font-size:22px;margin-bottom:12px}
        .diag-title{font-size:15px;font-weight:600;margin-bottom:8px}
        .diag-q{font-size:13px;font-style:italic;color:#1a56db;margin-bottom:10px;line-height:1.5}
        .diag-tags{display:flex;flex-wrap:wrap;gap:5px;margin-top:10px}
        .diag-tag{font-size:10px;color:#888;border:1px solid #e5e5e5;padding:2px 7px}

        /* ── CURIOSITY ── */
        .curiosity-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:#eee}
        .curiosity-card{background:#fff;padding:28px 22px;transition:background .15s;cursor:default}
        .curiosity-card:hover{background:#f7f9ff}
        .c-tag{display:inline-block;font-size:9px;font-weight:700;letter-spacing:.13em;text-transform:uppercase;color:#1a56db;border:1px solid #d0e0ff;padding:2px 7px;margin-bottom:12px}
        .c-emoji{font-size:26px;margin-bottom:12px;display:block}
        .c-title{font-size:15px;font-weight:600;color:#111;margin-bottom:8px;line-height:1.35}
        .c-body{font-size:13px;color:#666;font-weight:300;line-height:1.75}

        /* ── ABOUT ── */
        .about-grid{display:grid;grid-template-columns:1fr 1fr;gap:56px;align-items:start}
        .about-name{font-family:'Cormorant Garamond',serif;font-size:30px;font-weight:500;color:#111;margin-bottom:4px;letter-spacing:.02em}
        .about-role{font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#1a56db;margin-bottom:20px}
        .about-p{font-size:14px;color:#555;font-weight:300;line-height:1.85;margin-bottom:14px}
        .about-p b{color:#111;font-weight:500}
        .about-quote{border-left:3px solid #1a56db;padding:16px 20px;background:#f0f5ff;margin:24px 0}
        .about-quote p{font-family:'Cormorant Garamond',serif;font-size:19px;font-style:italic;color:#1a3366;line-height:1.5}
        .value-list{display:flex;flex-direction:column;gap:1px;background:#eee}
        .value-item{background:#fff;padding:18px 20px;display:flex;gap:12px;transition:background .15s}
        .value-item:hover{background:#f7f9ff}
        .value-dot{width:6px;height:6px;border-radius:50%;background:#1a56db;flex-shrink:0;margin-top:6px}
        .value-text{font-size:13px;color:#555;font-weight:300;line-height:1.75}
        .value-text b{color:#111;font-weight:500}
        .transparency-box{background:#f0f5ff;border:1px solid #d0e0ff;padding:22px;margin-top:20px}
        .trans-lbl{font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#1a56db;margin-bottom:10px}

        /* ── FAQ ── */
        .faq-list{display:flex;flex-direction:column;gap:1px;background:#eee}
        .faq-item{background:#fff;cursor:pointer}
        .faq-q{padding:20px 24px;display:flex;justify-content:space-between;align-items:center;gap:12px;font-size:14px;font-weight:500;color:#111;transition:color .15s}
        .faq-toggle{font-size:18px;color:#1a56db;flex-shrink:0}
        .faq-a{padding:0 24px 18px;font-size:13px;color:#666;font-weight:300;line-height:1.75;display:none}
        .faq-item.open .faq-a{display:block}
        .faq-item.open .faq-q{color:#1a56db}

        /* ── GENDER ── */
        .g-tabs{display:flex;border-bottom:1px solid rgba(255,255,255,.1);margin-bottom:36px}
        .g-tab{padding:12px 22px;font-size:14px;font-weight:500;color:rgba(255,255,255,.4);cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-1px;transition:all .15s}
        .g-tab.on{color:#fff;border-bottom-color:#1a56db}
        .g-grid{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:rgba(255,255,255,.06)}
        .g-item{background:#111;padding:18px 22px;display:flex;gap:12px;transition:background .15s}
        .g-item:hover{background:#1a1a1a}
        .g-item-icon{font-size:16px;flex-shrink:0}
        .g-item-text{font-size:13px;color:rgba(255,255,255,.65);font-weight:300;line-height:1.7}

        /* ── OFFER ── */
        .offer-grid{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:#eee}
        .offer-card{background:#fff;padding:32px 28px;transition:background .15s}
        .offer-card:hover{background:#f7f9ff}
        .offer-icon{font-size:24px;margin-bottom:14px;display:block}
        .offer-badge{display:inline-block;font-size:9px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#1a56db;border:1px solid #d0e0ff;padding:2px 8px;margin-bottom:10px}
        .offer-title{font-size:16px;font-weight:600;margin-bottom:8px}
        .offer-desc{font-size:13px;color:#666;font-weight:300;line-height:1.75}

        /* ── PRICING ── */
        .price-grid{display:grid;grid-template-columns:1fr 1fr;gap:2px;background:#ddd;max-width:760px}
        .price-card{background:#fff;padding:38px 34px}
        .price-card.dark{background:#111}
        .price-tier{font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#1a56db;margin-bottom:16px}
        .price-name{font-family:'Cormorant Garamond',serif;font-size:30px;font-weight:500;color:#111;margin-bottom:6px}
        .price-card.dark .price-name{color:#fff}
        .price-cost{font-size:13px;color:#bbb;margin-bottom:26px}
        .price-card.dark .price-cost{color:rgba(255,255,255,.35)}
        .price-features{list-style:none;margin-bottom:30px}
        .price-features li{font-size:13px;color:#555;font-weight:300;padding:8px 0;border-bottom:1px solid #f0f0f0;display:flex;gap:10px;line-height:1.5}
        .price-card.dark .price-features li{color:rgba(255,255,255,.6);border-color:rgba(255,255,255,.07)}
        .price-features li::before{content:'✓';color:#1a56db;flex-shrink:0;font-weight:700}

        /* ── FOOTER ── */
        .footer{background:#111;padding:36px 48px;display:flex;justify-content:space-between;align-items:center;gap:24px}
        .foot-logo{font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:500;color:#fff}
        .foot-logo b{color:#1a56db}
        .foot-disc{font-size:11px;color:rgba(255,255,255,.25);max-width:460px;line-height:1.65}

        @media(max-width:960px){
          .sidebar{transform:translateX(-100%);transition:transform .25s ease;box-shadow:none}
          .sidebar.open{transform:translateX(0);box-shadow:4px 0 24px rgba(0,0,0,.12)}
          .nav{padding:0 24px}
          .main{margin-left:0}
          .menu-btn{display:block}
          .hero{grid-template-columns:1fr;padding:64px 24px 48px;gap:32px}
          .hero h1{font-size:36px}
          .sec{padding:56px 24px}
          .studies-grid,.curiosity-grid,.diag-grid,.offer-grid,.how-grid,.about-grid{grid-template-columns:1fr}
          .g-grid{grid-template-columns:1fr}
          .price-grid{grid-template-columns:1fr;max-width:100%}
          .stats-row{grid-template-columns:1fr 1fr}
          .footer{flex-direction:column;padding:28px 24px;text-align:center}
          .press-bar{padding:16px 24px}
        }
      `}</style>

      {/* ── SIDEBAR ── */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sb-brand">
          <div className="sb-brand-name">Sci<b>Max</b></div>
          <div className="sb-brand-sub">Physiology-Based Health</div>
        </div>
        {groups.map(g => (
          <div key={g}>
            <div className="sb-group">{g}</div>
            {sidebarSections.filter(s => s.group === g).map(s => (
              <div key={s.id} className={`sb-item ${activeSection === s.id ? 'active' : ''}`} onClick={() => scrollTo(s.id)}>
                <span className="sb-icon">{s.icon}</span>{s.label}
              </div>
            ))}
          </div>
        ))}
        <div className="sb-footer">
          <div className="sb-footer-note">2 free assessments.<br />No card needed.</div>
          <a href="/quiz" className="sb-cta-link">→ Start Free</a>
        </div>
      </aside>

      {/* ── NAV ── */}
      <nav className="nav">
        <button className="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
        <span className="nav-tag">Science-backed health optimisation</span>
        <a href="/quiz" className="nav-cta">Start Free Assessment</a>
      </nav>

      {/* ── PROGRESS BAR ── */}
      <ProgressBar />

      {/* ── MAIN ── */}
      <div className="main">

        {/* HOME */}
        <div id="home">
          <div className="hero">
            <div>
              <div className="eyebrow">Physiology-Based Health Optimisation</div>
              <h1>Your body has the answers.<br /><b>Science reads them.</b></h1>
              <p className="hero-body">Most health advice is built for the average person. <b>You are not average.</b></p>
              <p className="hero-body">SciMax maps your specific biology across six physiological systems — and tells you exactly what's limiting your energy, focus, appearance, and recovery.</p>
              <div className="cta-row">
                <a href="/quiz" className="btn-dark">Take Free Assessment</a>
                <a href="#science" className="btn-ghost">See The Research</a>
              </div>
              <p className="hero-note">2 assessments free · No account required · Full protocol from £29</p>
            </div>
            <div className="fact-card">
              <div className="fact-cat">Research Brief — {facts[activeFact].cat}</div>
              <div className="fact-stat">{facts[activeFact].stat}</div>
              <div className="fact-text">{facts[activeFact].text}</div>
              <div className="fact-src">Source: {facts[activeFact].src}</div>
              <div className="fact-dots">
                {facts.map((_, i) => <div key={i} className={`fact-dot ${i === activeFact ? 'on' : ''}`} onClick={() => setActiveFact(i)} />)}
              </div>
            </div>
          </div>

          <div className="press-bar">
            <span className="press-lbl">Research Sources</span>
            {["JAMA", "Nature Medicine", "BMJ", "Cell", "NEJM", "Lancet", "NIH/PubMed", "Psychoneuroendocrinology"].map(p => <span key={p} className="press-item">{p}</span>)}
          </div>

          <div className="stats-row">
            {[
              { v: "6", l: "Physiological domains assessed" },
              { v: "2,000+", l: "Peer-reviewed studies behind the protocols" },
              { v: "100%", l: "Gender-differentiated analysis" },
              { v: "Free", l: "First 2 assessments — no card required" },
            ].map((s, i) => (
              <div key={i} className="stat-card">
                <div className="stat-num"><b>{s.v}</b></div>
                <div className="stat-lbl">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ABOUT */}
        <div id="about" className="sec sec-bg">
          <div className="sec-inner">
            <SectionTag label="About" />
            <h2 className="sec-h2">Built from <b>personal frustration.</b><br />Grounded in research.</h2>
            <TLDRBox points={[
              "SciMax was built by Fami Faroki — a researcher frustrated that good health science stays locked in journals no one reads.",
              "The focus: nutrition at a biochemical level, hormonal biology, and why most wellness advice is built to sell things rather than solve problems.",
              "No supplements sold. No pseudoscience. No vague advice. Just the research, translated.",
            ]} />
            <div className="about-grid">
              <div>
                <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, #e8edf8, #c7d9f5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, marginBottom: 20, border: '2px solid #d0e0ff' }}>🧬</div>
                <div className="about-name">Fami Faroki</div>
                <div className="about-role">Founder · Independent Health Researcher</div>
                <p className="about-p">SciMax exists because <b>the existing answers weren't good enough.</b></p>
                <p className="about-p">The wellness industry is loud, expensive, and largely built on vague advice designed to sell products — not solve problems. The research that actually explains how the body works sits buried in academic journals that nobody translates into plain language.</p>
                <p className="about-p">That gap is what this is about. <b>Taking what the science actually says and making it accessible, specific, and actionable.</b></p>
                <div className="about-quote">
                  <p>"A lot of what our generation experiences as brain fog, low energy, and poor focus isn't mysterious — it's biological. And biology has answers."</p>
                </div>
                <p className="about-p">The focus here is on nutrition at a <b>biochemical level</b> — not superfoods or clean eating. What ultra-processed ingredients actually do inside cells. Why food marketing language ('organic', 'natural', 'clean') carries no legal definition and misleads people daily. Why chronic low-grade inflammation is one of the most underdiscussed drivers of how people feel and look.</p>
                <p className="about-p">SciMax is built on one conviction: <b>people deserve accurate information about their own biology.</b></p>
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: '#1a56db', marginBottom: 14 }}>What Drives This Work</div>
                <div className="value-list">
                  {[
                    { b: "The processed food problem runs deeper than most people realise.", t: "What the industry calls 'natural' or 'clean' often has no biological meaning. Chronic low-grade inflammation from diet is one of the most underdiscussed health crises of our generation." },
                    { b: "Decades of medical research excluded women.", t: "Most nutritional guidelines and drug dosages were built on male-only studies and applied to everyone. Women's hormonal architecture is fundamentally different. This site takes that seriously." },
                    { b: "ADHD diagnoses are rising — but the cause is largely biological, not neurological.", t: "Ultra-processed diets, disrupted sleep, and deficient nutrition create symptoms that look exactly like ADHD. These are addressable states. They deserve biological solutions, not just labels." },
                    { b: "Pseudoscientific wellness content is genuinely harmful.", t: "It fills a knowledge vacuum with expensive nonsense, delays real intervention, and makes people distrust legitimate science. That's the problem this site exists to solve." },
                  ].map((v, i) => (
                    <div key={i} className="value-item">
                      <div className="value-dot" />
                      <div className="value-text"><b>{v.b}</b> {v.t}</div>
                    </div>
                  ))}
                </div>
                <div className="transparency-box">
                  <div className="trans-lbl">Transparency</div>
                  <p style={{ fontSize: 13, color: '#444', fontWeight: 300, lineHeight: 1.75 }}>Every claim links to a published source. SciMax does not sell supplements, accept advertising, or earn commission from any product recommendation. <b>The only product here is accurate information.</b></p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* WHAT WE OFFER */}
        <div id="offer" className="sec">
          <div className="sec-inner">
            <SectionTag label="What We Offer" />
            <h2 className="sec-h2">Precise tools for <b>precise problems</b></h2>
            <TLDRBox points={[
              "A structured diagnostic across 6 physiological domains — not a generic quiz.",
              "A gender-differentiated personalised protocol — not a template.",
              "A curated science library — free for everyone.",
            ]} />
            <div className="offer-grid">
              {[
                { icon: "◎", badge: "Free to start", title: "Physiological Assessment", desc: "40–60 questions. 8 minutes. Maps your biology across six systems using peer-reviewed research frameworks. Two assessments completely free." },
                { icon: "📄", badge: "Full report", title: "Personalised Protocol", desc: "A gender-differentiated, evidence-based action plan covering nutrition, sleep, supplementation, posture, and lifestyle. Specific to your biology — not a one-size-fits-all template." },
                { icon: "🔬", badge: "Free access", title: "Science Library", desc: "Curated research briefs on topics that matter but rarely get explained properly. Processed food chemistry, hormonal cycles, cognitive performance, and more." },
                { icon: "📊", badge: "Ongoing", title: "Progress Tracking", desc: "Retest every 3 months. See how your physiological profile shifts. Adjust your protocol. Document real, measurable change over time." },
              ].map((o, i) => (
                <div key={i} className="offer-card">
                  <div className="offer-icon">{o.icon}</div>
                  <div className="offer-badge">{o.badge}</div>
                  <div className="offer-title">{o.title}</div>
                  <div className="offer-desc">{o.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* THE SCIENCE */}
        <div id="science" className="sec sec-bg">
          <div className="sec-inner">
            <SectionTag label="The Science" color="#059669" />
            <h2 className="sec-h2">Your symptoms have <b>biological explanations</b></h2>
            <TLDRBox points={[
              "Most health and appearance problems trace back to specific, correctable physiological factors.",
              "People are unaware of them — not because the research doesn't exist, but because nobody translates it.",
              "Every stat below links to a published, peer-reviewed study.",
            ]} />
            <div className="tabs">
              {researchTabs.map((t, i) => (
                <div key={i} className={`tab ${activeTab === i ? 'on' : ''}`} onClick={() => setActiveTab(i)} style={{ borderBottomColor: activeTab === i ? researchTabs[i].color : 'transparent', color: activeTab === i ? '#111' : '#aaa' }}>{t.label}</div>
              ))}
            </div>
            <div className="studies-grid">
              {researchTabs[activeTab].studies.map((s, i) => (
                <div key={i} className="study">
                  <div className="study-stat" style={{ color: researchTabs[activeTab].color }}>{s.stat}</div>
                  <div className="study-claim">{s.claim}</div>
                  <div className="study-src">{s.source}</div>
                </div>
              ))}
            </div>

            {/* Pain Points */}
            <div style={{ marginTop: 64 }}>
              <SectionTag label="Common Questions" />
              <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 32, fontWeight: 500, marginBottom: 12, lineHeight: 1.2 }}>Questions your doctor <b>didn't have time to answer</b></h3>
              <p style={{ fontSize: 14, color: '#666', fontWeight: 300, marginBottom: 32, maxWidth: 500 }}>Click any question to see the biological explanation. <b>Short answers only.</b> No walls of text.</p>
              <div className="faq-list">
                {painPoints.map((p, i) => (
                  <div key={i} className={`faq-item ${openQ === i ? 'open' : ''}`} onClick={() => setOpenQ(openQ === i ? null : i)}>
                    <div className="faq-q">
                      <span>{p.q}</span>
                      <span className="faq-toggle">{openQ === i ? '−' : '+'}</span>
                    </div>
                    <div className="faq-a">{p.a}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Gender */}
            <div style={{ marginTop: 64, background: '#111', padding: 48 }}>
              <SectionTag label="Physiological Personalisation" color="#1a56db" />
              <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 34, fontWeight: 500, color: '#fff', marginBottom: 12, lineHeight: 1.2, maxWidth: 560 }}>Male and female physiology are <b>fundamentally different.</b></h3>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,.45)', fontWeight: 300, marginBottom: 36, maxWidth: 500 }}>Most clinical studies used male subjects only. SciMax's protocols are differentiated by biological sex — because the same symptom can have a completely different root cause.</p>
              <div className="g-tabs">
                <div className={`g-tab ${genderTab === 'women' ? 'on' : ''}`} onClick={() => setGenderTab('women')}>For Women</div>
                <div className={`g-tab ${genderTab === 'men' ? 'on' : ''}`} onClick={() => setGenderTab('men')}>For Men</div>
              </div>
              <div className="g-grid">
                {genderPoints[genderTab].map((item, i) => (
                  <div key={i} className="g-item">
                    <span className="g-item-icon">{item.icon}</span>
                    <span className="g-item-text">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* DIAGNOSTICS */}
        <div id="diagnostics" className="sec">
          <div className="sec-inner">
            <SectionTag label="Diagnostics" color="#6366f1" />
            <h2 className="sec-h2">Six systems. <b>One complete picture.</b></h2>
            <TLDRBox points={[
              "First 2 assessments are completely free — no card, no account.",
              "Full report unlocks all 6 systems with a personalised protocol.",
              "Every assessment is gender-differentiated from the ground up.",
            ]} />
            <div className="diag-grid">
              {diagnostics.map((d, i) => (
                <div key={i} className="diag-card">
                  <span className={`diag-badge ${d.free ? 'free' : 'paid'}`}>{d.free ? '✓ Free' : 'Full Report'}</span>
                  <div className="diag-icon">{d.icon}</div>
                  <div className="diag-title">{d.title}</div>
                  <div className="diag-q">{d.desc}</div>
                  <div className="diag-tags">{d.tags.map((t, j) => <span key={j} className="diag-tag">{t}</span>)}</div>
                </div>
              ))}
            </div>

            {/* How It Works */}
            <div style={{ marginTop: 64 }}>
              <SectionTag label="How It Works" />
              <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 32, fontWeight: 500, marginBottom: 12 }}>Four steps. <b>No guesswork.</b></h3>
              <p style={{ fontSize: 14, color: '#666', fontWeight: 300, marginBottom: 36, maxWidth: 480 }}>Start in under 10 minutes. No prior knowledge needed.</p>
              <div className="how-grid">
                {howItWorks.map((h, i) => (
                  <div key={i} className="how-card">
                    <div className="how-step-num">{h.step}</div>
                    <div className="how-emoji">{h.icon}</div>
                    <div className="how-title">{h.title}</div>
                    <div className="how-body">{h.body}</div>
                    <div className="how-detail">{h.detail}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* DID YOU KNOW */}
        <div id="didyouknow" className="sec sec-bg">
          <div className="sec-inner">
            <SectionTag label="Did You Know" color="#d97706" />
            <h2 className="sec-h2">Things your body is doing <b>right now</b> that you never knew</h2>
            <TLDRBox points={[
              "These aren't opinions or blog posts — they're documented scientific findings.",
              "Most people have never heard them because no one's translating the research.",
              "Each one has a direct implication for how you look, feel, and function.",
            ]} />
            <div className="curiosity-grid">
              {curiosityFacts.map((f, i) => (
                <div key={i} className="curiosity-card">
                  <div className="c-tag">{f.tag}</div>
                  <div className="c-emoji">{f.emoji}</div>
                  <div className="c-title">{f.title}</div>
                  <div className="c-body">{f.body}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* METHODOLOGY */}
        <div id="methodology" className="sec sec-bg">
          <div className="sec-inner">
            <SectionTag label="How It's Built" color="#6366f1" />
            <h2 className="sec-h2">Transparent by design. <b>Every question has a source.</b></h2>
            <TLDRBox points={[
              "The questionnaire uses validated clinical screening tools — not invented from scratch.",
              "Each domain maps to a different established research framework.",
              "Scoring thresholds are based on published sensitivity data from those tools.",
            ]} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: '#eee', marginBottom: 48 }}>
              {[
                { domain: '😴 Sleep', tool: 'Pittsburgh Sleep Quality Index (PSQI)', basis: 'Buysse et al., 1989 · Used in thousands of sleep studies worldwide to assess subjective sleep quality and disturbances.' },
                { domain: '⚡ Hormones', tool: 'Adrenal/Thyroid Symptom Mapping', basis: 'Zulewski et al. thyroid scoring + clinical endocrinology literature on cortisol and sex hormone symptom patterns.' },
                { domain: '🥦 Nutrition', tool: 'MUST + BDA Deficiency Criteria', basis: 'Malnutrition Universal Screening Tool (MUST) + British Dietetic Association micronutrient deficiency indicator frameworks.' },
                { domain: '🦴 Posture', tool: 'Cervical Loading Research', basis: 'Hansraj (2014) cervical spine load data + breathing pattern disorder screening from physiotherapy literature.' },
                { domain: '💭 Stress & Cognition', tool: 'PSS-10 + MBI Indicators', basis: 'Perceived Stress Scale (Cohen et al., 1983) + Maslach Burnout Inventory indicators for emotional exhaustion and cognitive depletion.' },
                { domain: '✨ Skin & Hair', tool: 'Dermatological Deficiency Criteria', basis: 'Almohanna et al. (2019) nutritional deficiency and hair loss criteria · Collagen degradation marker patterns from psychoneuroendocrinology research.' },
              ].map((m, i) => (
                <div key={i} style={{ background: '#fff', padding: '24px 22px' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#111', marginBottom: 4 }}>{m.domain}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#1a56db', marginBottom: 8 }}>{m.tool}</div>
                  <div style={{ fontSize: 12, color: '#777', fontWeight: 300, lineHeight: 1.65 }}>{m.basis}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'start' }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: '#1a56db', marginBottom: 16 }}>How Scoring Works</div>
                {[
                  { t: 'Each question has 4 options', d: 'Scored 0–3. Zero means no concern. Three means a significant pattern detected in that indicator.' },
                  { t: 'Domain scores are totalled', d: "Each domain's total is expressed as a percentage of its maximum possible score." },
                  { t: 'Four threshold levels', d: 'Optimal (0–25%) · Mild Concern (26–50%) · Moderate Concern (51–75%) · High Priority (76–100%).' },
                  { t: 'Gender differentiation applied', d: 'Hormonal and nutritional reference ranges adjust based on biological sex, reflecting the different physiological profiles in the literature.' },
                ].map((s, i) => (
                  <div key={i} style={{ padding: '14px 0', borderBottom: '1px solid #eee', display: 'flex', gap: 12 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#1a56db', flexShrink: 0, marginTop: 6 }} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#111', marginBottom: 4 }}>{s.t}</div>
                      <div style={{ fontSize: 12, color: '#666', fontWeight: 300, lineHeight: 1.6 }}>{s.d}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: '#1a56db', marginBottom: 16 }}>What This Is — And Isn't</div>
                <div style={{ background: '#fff', border: '1px solid #eee', padding: '22px' }}>
                  {[
                    { icon: '✓', col: '#059669', t: 'Pattern recognition based on validated screening tools' },
                    { icon: '✓', col: '#059669', t: 'Indicators pointing to biological domains worth investigating' },
                    { icon: '✓', col: '#059669', t: 'A structured starting point for lifestyle and nutritional optimisation' },
                    { icon: '✗', col: '#dc2626', t: 'Not a medical diagnosis of any condition' },
                    { icon: '✗', col: '#dc2626', t: 'Not a substitute for clinical blood tests or professional assessment' },
                    { icon: '✗', col: '#dc2626', t: 'Not definitive — results reflect patterns in self-reported data' },
                  ].map((w, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 0', borderBottom: i < 5 ? '1px solid #f5f5f5' : 'none', alignItems: 'flex-start' }}>
                      <span style={{ color: w.col, fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{w.icon}</span>
                      <span style={{ fontSize: 13, color: '#555', fontWeight: 300, lineHeight: 1.5 }}>{w.t}</span>
                    </div>
                  ))}
                </div>
                <div style={{ background: '#f0f5ff', border: '1px solid #d0e0ff', padding: '18px 20px', marginTop: 16 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: '#1a56db', marginBottom: 8 }}>Our Commitment</div>
                  <p style={{ fontSize: 13, color: '#444', fontWeight: 300, lineHeight: 1.75 }}>Every protocol recommendation links back to a published source. If a claim doesn't have a citation, it won't appear here.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PRICING */}
        <div id="pricing" className="sec" style={{ background: '#f7f8ff' }}>
          <div className="sec-inner">
            <SectionTag label="Pricing" />
            <h2 className="sec-h2">Start free. <b>Pay only when you see value.</b></h2>
            <TLDRBox points={[
              "Two full assessments — completely free. No card. No account.",
              "Full report is a one-time payment. No subscription, no hidden fees.",
              "14-day satisfaction guarantee on the full report.",
            ]} />
            <div className="price-grid">
              <div className="price-card">
                <div className="price-tier">Foundation</div>
                <div className="price-name">Free Assessment</div>
                <div className="price-cost">No account. No card. Always free.</div>
                <ul className="price-features">
                  <li>Hormonal Architecture assessment</li>
                  <li>Sleep Architecture assessment</li>
                  <li>Preliminary findings summary</li>
                  <li>Key risk indicators flagged</li>
                  <li>Introductory recommendations</li>
                </ul>
                <a href="/quiz" className="btn-ghost">Begin Free</a>
              </div>
              <div className="price-card dark">
                <div className="price-tier">Complete Protocol</div>
                <div className="price-name">Full Report</div>
                <div className="price-cost">One-time · From £29</div>
                <ul className="price-features">
                  <li>All six physiological assessments</li>
                  <li>Gender-differentiated analysis</li>
                  <li>Fully personalised protocol</li>
                  <li>Nutritional gap identification</li>
                  <li>Structural & postural assessment</li>
                  <li>Cognitive load analysis</li>
                  <li>Skin, hair & tissue health report</li>
                  <li>Prioritised action plan</li>
                </ul>
                <a href="/quiz" className="btn-blue">Get Full Protocol</a>
              </div>
            </div>
            <p style={{ marginTop: 18, fontSize: 12, color: '#aaa' }}>14-day satisfaction guarantee · Your data is encrypted and never shared · No supplements sold</p>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="footer">
          <div className="foot-logo">Sci<b>Max</b></div>
          <div className="foot-disc">SciMax provides informational health assessments based on self-reported data and published research. All content is educational only — not medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional.</div>
        </footer>

      </div>
    </div>
  );
}
