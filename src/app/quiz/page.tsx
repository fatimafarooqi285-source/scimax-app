'use client';
import { useState } from 'react';

// ─── QUESTION BANK ────────────────────────────────────────────────────────────
// Each question maps to a domain. Each answer has a score (0 = optimal, 3 = significant concern).
// Scoring methodology based on validated sleep, hormonal, nutritional, and psychological screening tools:
// PHQ-9 (depression/mood), ISI (insomnia severity), PSS (perceived stress), PSQI (sleep quality),
// and nutritional screening frameworks from the British Dietetic Association.

const domains = [
  {
    id: 'sleep',
    label: 'Sleep Architecture',
    icon: '😴',
    color: '#6366f1',
    description: 'Assesses sleep quality, depth, and circadian alignment — not just hours in bed.',
    basis: 'Pittsburgh Sleep Quality Index (PSQI) + Insomnia Severity Index (ISI)',
    questions: [
      {
        id: 's1',
        text: 'How long does it typically take you to fall asleep after getting into bed?',
        options: [
          { label: 'Under 20 minutes', score: 0 },
          { label: '20–30 minutes', score: 1 },
          { label: '30–60 minutes', score: 2 },
          { label: 'Over an hour', score: 3 },
        ],
      },
      {
        id: 's2',
        text: 'How do you feel when you wake up in the morning?',
        options: [
          { label: 'Refreshed and ready', score: 0 },
          { label: 'Okay after some time', score: 1 },
          { label: 'Tired but functional', score: 2 },
          { label: 'Exhausted regardless of hours slept', score: 3 },
        ],
      },
      {
        id: 's3',
        text: 'Do you wake up during the night?',
        options: [
          { label: 'Rarely or never', score: 0 },
          { label: '1–2 times occasionally', score: 1 },
          { label: '1–2 times most nights', score: 2 },
          { label: 'Multiple times most nights', score: 3 },
        ],
      },
      {
        id: 's4',
        text: 'What time do you typically go to sleep?',
        options: [
          { label: 'Before 11pm', score: 0 },
          { label: '11pm–midnight', score: 1 },
          { label: 'Midnight–2am', score: 2 },
          { label: 'After 2am or highly variable', score: 3 },
        ],
      },
      {
        id: 's5',
        text: 'How often do you use a screen (phone, TV, laptop) within an hour of sleeping?',
        options: [
          { label: 'Rarely', score: 0 },
          { label: 'A few times a week', score: 1 },
          { label: 'Most nights', score: 2 },
          { label: 'Every night', score: 3 },
        ],
      },
      {
        id: 's6',
        text: 'Do you experience an energy crash in the early afternoon (1–3pm)?',
        options: [
          { label: 'Rarely', score: 0 },
          { label: 'Sometimes', score: 1 },
          { label: 'Most days', score: 2 },
          { label: 'Every day', score: 3 },
        ],
      },
    ],
  },
  {
    id: 'hormones',
    label: 'Hormonal Architecture',
    icon: '⚡',
    color: '#1a56db',
    description: 'Screens for patterns consistent with hormonal disruption across cortisol, sex hormones, and thyroid function.',
    basis: 'Adrenal Stress Index patterns + thyroid symptom screening (based on Zulewski et al.) + sex hormone symptom mapping',
    questions: [
      {
        id: 'h1',
        text: 'How would you describe your energy levels across a typical day?',
        options: [
          { label: 'Consistent and stable', score: 0 },
          { label: 'Good but dips in afternoon', score: 1 },
          { label: 'Low most of the day', score: 2 },
          { label: 'Exhausted from the moment I wake up', score: 3 },
        ],
      },
      {
        id: 'h2',
        text: 'How often do you experience mood swings or emotional instability?',
        options: [
          { label: 'Rarely', score: 0 },
          { label: 'Occasionally', score: 1 },
          { label: 'Frequently', score: 2 },
          { label: 'Almost daily', score: 3 },
        ],
      },
      {
        id: 'h3',
        text: 'Have you noticed any unexplained changes in weight (gain or loss)?',
        options: [
          { label: 'No', score: 0 },
          { label: 'Minor changes', score: 1 },
          { label: 'Moderate unexplained changes', score: 2 },
          { label: 'Significant unexplained changes', score: 3 },
        ],
      },
      {
        id: 'h4',
        text: 'How sensitive are you to cold temperatures compared to others around you?',
        options: [
          { label: 'Not particularly', score: 0 },
          { label: 'Slightly more sensitive', score: 1 },
          { label: 'Noticeably colder than others', score: 2 },
          { label: 'Cold all the time', score: 3 },
        ],
      },
      {
        id: 'h5',
        text: 'How is your sex drive compared to what you consider your baseline?',
        options: [
          { label: 'Normal or healthy', score: 0 },
          { label: 'Slightly reduced', score: 1 },
          { label: 'Noticeably lower than before', score: 2 },
          { label: 'Very low or absent', score: 3 },
        ],
      },
      {
        id: 'h6',
        text: 'Do you experience heart palpitations, anxiety, or a sense of being "wired but tired"?',
        options: [
          { label: 'Rarely', score: 0 },
          { label: 'Occasionally', score: 1 },
          { label: 'Often', score: 2 },
          { label: 'Frequently or ongoing', score: 3 },
        ],
      },
    ],
  },
  {
    id: 'nutrition',
    label: 'Nutritional Profile',
    icon: '🥦',
    color: '#059669',
    description: 'Identifies dietary patterns and symptoms associated with common micronutrient and macronutrient deficiencies.',
    basis: 'MUST nutritional screening tool + iron deficiency symptom criteria + B12/D3 deficiency symptom mapping (NHS/BDA)',
    questions: [
      {
        id: 'n1',
        text: 'How much protein do you eat per day (roughly)?',
        options: [
          { label: 'A source at every meal (meat, fish, eggs, legumes)', score: 0 },
          { label: 'Once or twice a day', score: 1 },
          { label: 'Irregularly', score: 2 },
          { label: "I'm unsure / rarely focus on this", score: 3 },
        ],
      },
      {
        id: 'n2',
        text: 'Do you experience bloating, irregular digestion, or frequent gut discomfort?',
        options: [
          { label: 'Rarely or never', score: 0 },
          { label: 'Occasionally', score: 1 },
          { label: 'Several times a week', score: 2 },
          { label: 'Almost daily', score: 3 },
        ],
      },
      {
        id: 'n3',
        text: 'How much time do you spend outdoors in direct sunlight daily?',
        options: [
          { label: 'Over 30 minutes', score: 0 },
          { label: '15–30 minutes', score: 1 },
          { label: 'Under 15 minutes', score: 2 },
          { label: 'Rarely go outside', score: 3 },
        ],
      },
      {
        id: 'n4',
        text: 'How would you describe your current diet?',
        options: [
          { label: 'Mostly whole foods, home cooked', score: 0 },
          { label: 'Mix of home cooked and processed', score: 1 },
          { label: 'Mostly packaged, fast food or ready meals', score: 2 },
          { label: 'Highly processed, little variety', score: 3 },
        ],
      },
      {
        id: 'n5',
        text: 'Do you experience strong sugar or carbohydrate cravings?',
        options: [
          { label: 'Rarely', score: 0 },
          { label: 'Occasionally', score: 1 },
          { label: 'Often — especially mid-afternoon', score: 2 },
          { label: 'Constant cravings, hard to control', score: 3 },
        ],
      },
      {
        id: 'n6',
        text: 'Have you noticed your nails breaking easily, or hair shedding more than usual?',
        options: [
          { label: 'No change', score: 0 },
          { label: 'Minor changes', score: 1 },
          { label: 'Noticeable increase in shedding or breakage', score: 2 },
          { label: 'Significant and ongoing', score: 3 },
        ],
      },
    ],
  },
  {
    id: 'posture',
    label: 'Structural Health',
    icon: '🦴',
    color: '#d97706',
    description: 'Assesses postural patterns, breathing mechanics, and musculoskeletal strain from screen use and sedentary habits.',
    basis: 'New York Posture Rating + cervical spine loading research (Hansraj, 2014) + breathing pattern disorder screening',
    questions: [
      {
        id: 'p1',
        text: 'How many hours a day do you spend looking at a screen (phone, computer)?',
        options: [
          { label: 'Under 4 hours', score: 0 },
          { label: '4–6 hours', score: 1 },
          { label: '6–10 hours', score: 2 },
          { label: 'Over 10 hours', score: 3 },
        ],
      },
      {
        id: 'p2',
        text: 'Do you experience neck pain, shoulder tension, or upper back discomfort?',
        options: [
          { label: 'Rarely or never', score: 0 },
          { label: 'Occasionally', score: 1 },
          { label: 'Several times a week', score: 2 },
          { label: 'Daily or constant', score: 3 },
        ],
      },
      {
        id: 'p3',
        text: 'When you breathe, which moves first?',
        options: [
          { label: 'My belly expands', score: 0 },
          { label: 'Both belly and chest', score: 1 },
          { label: 'Mainly my chest', score: 2 },
          { label: "I haven't noticed / I hold my breath often", score: 3 },
        ],
      },
      {
        id: 'p4',
        text: 'Do you notice headaches that begin at the base of your skull or behind your eyes?',
        options: [
          { label: 'Rarely', score: 0 },
          { label: 'Occasionally', score: 1 },
          { label: 'Weekly', score: 2 },
          { label: 'Several times a week', score: 3 },
        ],
      },
    ],
  },
  {
    id: 'stress',
    label: 'Cognitive & Stress Load',
    icon: '💭',
    color: '#db2777',
    description: 'Measures psychological burden, burnout risk, and the cognitive load affecting clarity and decision quality.',
    basis: 'Perceived Stress Scale (PSS-10) + Maslach Burnout Inventory (MBI) indicators + Cognitive Load Theory frameworks',
    questions: [
      {
        id: 'c1',
        text: 'How often do you feel mentally exhausted by mid-day?',
        options: [
          { label: 'Rarely', score: 0 },
          { label: 'Sometimes', score: 1 },
          { label: 'Most days', score: 2 },
          { label: 'Almost every day', score: 3 },
        ],
      },
      {
        id: 'c2',
        text: 'How would you rate your ability to concentrate on a single task for 30+ minutes?',
        options: [
          { label: 'Good — I can focus when needed', score: 0 },
          { label: 'Okay but I get distracted', score: 1 },
          { label: 'Hard — my mind wanders constantly', score: 2 },
          { label: 'Very difficult — I can rarely sustain focus', score: 3 },
        ],
      },
      {
        id: 'c3',
        text: 'How often do you feel overwhelmed by the number of things you need to do?',
        options: [
          { label: 'Rarely', score: 0 },
          { label: 'Sometimes', score: 1 },
          { label: 'Often', score: 2 },
          { label: 'Almost constantly', score: 3 },
        ],
      },
      {
        id: 'c4',
        text: 'How would you describe your memory and recall ability recently?',
        options: [
          { label: 'Sharp and reliable', score: 0 },
          { label: 'Occasionally forgetful', score: 1 },
          { label: 'Noticeably worse than before', score: 2 },
          { label: 'Frequently forgetting things, foggy', score: 3 },
        ],
      },
      {
        id: 'c5',
        text: 'How often do you feel emotionally detached or "going through the motions"?',
        options: [
          { label: 'Rarely', score: 0 },
          { label: 'Sometimes', score: 1 },
          { label: 'Often', score: 2 },
          { label: 'Most of the time', score: 3 },
        ],
      },
    ],
  },
  {
    id: 'appearance',
    label: 'Skin, Hair & Tissue',
    icon: '✨',
    color: '#0891b2',
    description: 'Identifies biological drivers behind changes in skin quality, hair density, and physical appearance markers.',
    basis: 'Dermatological screening criteria for nutritional deficiency (Almohanna et al., 2019) + collagen degradation markers + inflammatory skin pattern mapping',
    questions: [
      {
        id: 'a1',
        text: 'How has your skin quality changed in the past 12 months?',
        options: [
          { label: 'No change or improved', score: 0 },
          { label: 'Slightly more dull or dry', score: 1 },
          { label: 'Noticeably worse — more breakouts, dryness, or uneven texture', score: 2 },
          { label: 'Significantly worse', score: 3 },
        ],
      },
      {
        id: 'a2',
        text: 'How is your hair density compared to 1–2 years ago?',
        options: [
          { label: 'Same or thicker', score: 0 },
          { label: 'Slightly thinner', score: 1 },
          { label: 'Noticeably thinner', score: 2 },
          { label: 'Significantly thinner or shedding heavily', score: 3 },
        ],
      },
      {
        id: 'a3',
        text: 'Do people comment that you look tired or older than your age?',
        options: [
          { label: 'Never or rarely', score: 0 },
          { label: 'Occasionally', score: 1 },
          { label: 'Sometimes, yes', score: 2 },
          { label: 'Often', score: 3 },
        ],
      },
      {
        id: 'a4',
        text: 'Do you experience under-eye darkness, puffiness, or persistent skin dullness?',
        options: [
          { label: 'Rarely', score: 0 },
          { label: 'Sometimes', score: 1 },
          { label: 'Most mornings', score: 2 },
          { label: 'Constantly regardless of sleep', score: 3 },
        ],
      },
    ],
  },
];

// ─── SCORING ─────────────────────────────────────────────────────────────────

function getLevel(score: number, maxScore: number): { label: string; color: string; bg: string; description: string } {
  const pct = score / maxScore;
  if (pct <= 0.25) return { label: 'Optimal', color: '#059669', bg: '#f0fdf4', description: 'No significant concerns detected in this domain.' };
  if (pct <= 0.5) return { label: 'Mild Concern', color: '#d97706', bg: '#fffbeb', description: 'Some patterns suggest room for optimisation in this domain.' };
  if (pct <= 0.75) return { label: 'Moderate Concern', color: '#ea580c', bg: '#fff7ed', description: 'Several indicators suggest this domain may be significantly affecting your wellbeing.' };
  return { label: 'High Priority', color: '#dc2626', bg: '#fef2f2', description: 'Multiple indicators point to significant disruption in this domain. This should be a primary focus.' };
}

// ─── COMPONENT ───────────────────────────────────────────────────────────────

type Answers = Record<string, number>;

export default function QuizPage() {
  const [phase, setPhase] = useState<'intro' | 'gender' | 'quiz' | 'results'>('intro');
  const [gender, setGender] = useState<'female' | 'male' | null>(null);
  const [domainIndex, setDomainIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [selected, setSelected] = useState<number | null>(null);

  const currentDomain = domains[domainIndex];
  const currentQuestion = currentDomain?.questions[questionIndex];
  const totalQuestions = domains.reduce((a, d) => a + d.questions.length, 0);
  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / totalQuestions) * 100;

  const handleAnswer = (score: number) => {
    setSelected(score);
    setTimeout(() => {
      const newAnswers = { ...answers, [currentQuestion.id]: score };
      setAnswers(newAnswers);
      setSelected(null);
      if (questionIndex < currentDomain.questions.length - 1) {
        setQuestionIndex(questionIndex + 1);
      } else if (domainIndex < domains.length - 1) {
        setDomainIndex(domainIndex + 1);
        setQuestionIndex(0);
      } else {
        setPhase('results');
      }
    }, 320);
  };

  const domainScores = domains.map(d => ({
    ...d,
    score: d.questions.reduce((sum, q) => sum + (answers[q.id] ?? 0), 0),
    maxScore: d.questions.length * 3,
  }));

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", minHeight: '100vh', background: '#fafafa', color: '#111' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&display=swap');
        *{margin:0;padding:0;box-sizing:border-box}
        body{font-size:15px}
        .qnav{position:fixed;top:0;left:0;right:0;height:60px;background:rgba(255,255,255,.97);border-bottom:1px solid #eee;display:flex;align-items:center;justify-content:space-between;padding:0 32px;z-index:100}
        .qnav-logo{font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:500;text-decoration:none;color:#111}
        .qnav-logo b{color:#1a56db}
        .progress-track{position:fixed;top:60px;left:0;right:0;height:3px;background:#eee;z-index:100}
        .progress-fill{height:100%;background:linear-gradient(90deg,#1a56db,#6366f1);transition:width .4s ease}
        .page{display:flex;align-items:center;justify-content:center;min-height:100vh;padding:80px 24px 40px}
        .card{background:#fff;border:1px solid #eee;padding:52px 48px;max-width:640px;width:100%}
        .tag{display:inline-block;font-size:9px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;padding:3px 10px;margin-bottom:20px}
        .h1{font-family:'Cormorant Garamond',serif;font-size:38px;font-weight:500;line-height:1.15;margin-bottom:16px}
        .h1 b{font-weight:600}
        .body-text{font-size:14px;color:#666;font-weight:300;line-height:1.8;margin-bottom:12px}
        .body-text b{color:#111;font-weight:500}
        .btn{padding:14px 28px;font-size:13px;font-weight:600;cursor:pointer;border:none;display:inline-block;text-decoration:none;transition:all .15s;letter-spacing:.02em}
        .btn-dark{background:#111;color:#fff}
        .btn-dark:hover{background:#333}
        .btn-blue{background:#1a56db;color:#fff}
        .btn-blue:hover{background:#1447b8}
        .btn-ghost{background:transparent;border:1.5px solid #ddd;color:#666}
        .btn-ghost:hover{border-color:#111;color:#111}
        .divider{height:1px;background:#f0f0f0;margin:28px 0}
        .gender-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:28px 0}
        .gender-card{border:2px solid #eee;padding:24px 20px;cursor:pointer;transition:all .2s;text-align:center}
        .gender-card:hover{border-color:#1a56db;background:#f7f9ff}
        .gender-card.selected{border-color:#1a56db;background:#f0f5ff}
        .gender-icon{font-size:32px;margin-bottom:10px}
        .gender-label{font-size:15px;font-weight:600;color:#111;margin-bottom:6px}
        .gender-desc{font-size:12px;color:#888;font-weight:300;line-height:1.5}
        .domain-pill{display:inline-flex;align-items:center;gap:6px;padding:5px 12px;font-size:11px;font-weight:600;border:1px solid;margin-bottom:28px}
        .question-text{font-size:20px;font-weight:500;line-height:1.45;color:#111;margin-bottom:32px;font-family:'Cormorant Garamond',serif}
        .options{display:flex;flex-direction:column;gap:10px}
        .option{padding:16px 20px;border:1.5px solid #eee;cursor:pointer;font-size:14px;font-weight:400;color:#444;transition:all .18s;display:flex;align-items:center;gap:12px;line-height:1.45}
        .option:hover{border-color:#1a56db;color:#111;background:#f7f9ff}
        .option.selected{border-color:#1a56db;background:#f0f5ff;color:#1a56db;font-weight:500}
        .option-letter{width:24px;height:24px;border-radius:50%;background:#f0f0f0;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;color:#888;transition:all .18s}
        .option:hover .option-letter,.option.selected .option-letter{background:#1a56db;color:#fff}
        .domain-progress{display:flex;gap:6px;margin-bottom:32px;flex-wrap:wrap}
        .domain-pip{height:4px;flex:1;border-radius:2px;background:#eee;transition:background .3s;min-width:20px}
        .domain-pip.done{background:#1a56db}
        .domain-pip.active{background:#93c5fd}
        .q-counter{font-size:12px;color:#aaa;font-weight:500;margin-bottom:8px;letter-spacing:.04em}
        .results-grid{display:grid;gap:1px;background:#eee;margin:32px 0}
        .result-row{background:#fff;padding:20px 24px;display:flex;align-items:center;gap:16px;transition:background .15s}
        .result-row:hover{background:#fafeff}
        .result-icon{font-size:20px;width:32px;text-align:center;flex-shrink:0}
        .result-info{flex:1}
        .result-label{font-size:14px;font-weight:600;color:#111;margin-bottom:3px}
        .result-desc{font-size:12px;color:#888;font-weight:300;line-height:1.5}
        .result-badge{padding:4px 10px;font-size:11px;font-weight:700;letter-spacing:.06em;white-space:nowrap}
        .result-bar-track{height:4px;background:#eee;margin-top:8px;border-radius:2px;overflow:hidden}
        .result-bar-fill{height:100%;border-radius:2px;transition:width 1s ease}
        .cta-box{background:#111;padding:36px;margin-top:8px;text-align:center}
        .cta-box h3{font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:500;color:#fff;margin-bottom:10px}
        .cta-box p{font-size:13px;color:rgba(255,255,255,.5);font-weight:300;margin-bottom:24px;line-height:1.7}
        .methodology-box{background:#f7f8ff;border:1px solid #e0e8ff;padding:20px 24px;margin-top:20px}
        .meth-title{font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#1a56db;margin-bottom:10px}
        .meth-item{font-size:12px;color:#555;font-weight:300;line-height:1.65;padding:4px 0;border-bottom:1px solid #eee;display:flex;gap:8px}
        .meth-item:last-child{border:none}
        .meth-item::before{content:'→';color:#1a56db;flex-shrink:0;font-weight:600}
        @media(max-width:600px){.card{padding:32px 24px}.h1{font-size:28px}.gender-grid{grid-template-columns:1fr}}
      `}</style>

      {/* Nav */}
      <div className="qnav">
        <a href="/" className="qnav-logo">Sci<b>Max</b></a>
        {phase === 'quiz' && (
          <span style={{ fontSize: 12, color: '#aaa', fontWeight: 500 }}>
            {answeredCount} of {totalQuestions} questions
          </span>
        )}
      </div>

      {/* Progress */}
      {phase === 'quiz' && (
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      )}

      {/* ── INTRO ── */}
      {phase === 'intro' && (
        <div className="page">
          <div className="card">
            <div className="tag" style={{ background: '#f0f5ff', color: '#1a56db', border: '1px solid #d0e0ff' }}>Free Assessment</div>
            <h1 className="h1">Let's map <b>your biology.</b></h1>
            <p className="body-text">This assessment covers six physiological domains. Your answers are cross-referenced against frameworks derived from peer-reviewed research to identify where your biological systems may be under pressure.</p>
            <p className="body-text"><b>There are no right or wrong answers.</b> Answer as honestly as you can — the more accurate your responses, the more specific your results.</p>
            <div className="methodology-box">
              <div className="meth-title">How this questionnaire is built</div>
              {[
                'Sleep questions adapted from the Pittsburgh Sleep Quality Index (PSQI) and Insomnia Severity Index (ISI)',
                'Hormonal screening based on adrenal/thyroid symptom mapping from Zulewski et al. and clinical endocrinology literature',
                'Nutritional screening adapted from the MUST tool (Malnutrition Universal Screening Tool) + BDA micronutrient deficiency criteria',
                'Stress and cognitive load based on the Perceived Stress Scale (PSS-10) and Maslach Burnout Inventory indicators',
                'Postural assessment draws on cervical loading research (Hansraj, 2014) and breathing pattern disorder screening',
                'Skin and hair questions mapped against dermatological nutritional deficiency criteria (Almohanna et al., 2019)',
              ].map((m, i) => <div key={i} className="meth-item">{m}</div>)}
            </div>
            <div className="divider" />
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
              <button className="btn btn-dark" onClick={() => setPhase('gender')}>Start Assessment →</button>
              <span style={{ fontSize: 12, color: '#aaa' }}>~8 minutes · {totalQuestions} questions · Free</span>
            </div>
            <p style={{ fontSize: 11, color: '#bbb', marginTop: 16, lineHeight: 1.6 }}>This assessment is for informational purposes only. It does not constitute medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional.</p>
          </div>
        </div>
      )}

      {/* ── GENDER ── */}
      {phase === 'gender' && (
        <div className="page">
          <div className="card">
            <div className="tag" style={{ background: '#f0f5ff', color: '#1a56db', border: '1px solid #d0e0ff' }}>Personalisation</div>
            <h1 className="h1">What is your <b>biological sex?</b></h1>
            <p className="body-text">This determines which research framework your results are mapped against. <b>Male and female physiology differ significantly</b> — the same symptom can have a completely different biological root cause depending on your hormonal architecture.</p>
            <p className="body-text" style={{ fontSize: 12, color: '#aaa' }}>Note: This refers to biological sex, not gender identity. It is used solely to apply the correct hormonal and physiological reference ranges.</p>
            <div className="gender-grid">
              <div className={`gender-card ${gender === 'female' ? 'selected' : ''}`} onClick={() => setGender('female')}>
                <div className="gender-icon">♀</div>
                <div className="gender-label">Female</div>
                <div className="gender-desc">Applies female-specific hormonal ranges, menstrual cycle physiology, and female-weighted research frameworks</div>
              </div>
              <div className={`gender-card ${gender === 'male' ? 'selected' : ''}`} onClick={() => setGender('male')}>
                <div className="gender-icon">♂</div>
                <div className="gender-label">Male</div>
                <div className="gender-desc">Applies male hormonal reference ranges, testosterone-related indicators, and male-weighted research frameworks</div>
              </div>
            </div>
            <button className="btn btn-dark" onClick={() => gender && setPhase('quiz')} style={{ opacity: gender ? 1 : 0.4, cursor: gender ? 'pointer' : 'default' }}>
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* ── QUIZ ── */}
      {phase === 'quiz' && currentQuestion && (
        <div className="page">
          <div className="card">
            {/* Domain progress pills */}
            <div className="domain-progress">
              {domains.map((d, i) => (
                <div key={d.id} className={`domain-pip ${i < domainIndex ? 'done' : i === domainIndex ? 'active' : ''}`} title={d.label} />
              ))}
            </div>

            {/* Domain label */}
            <div className="domain-pill" style={{ color: currentDomain.color, borderColor: currentDomain.color + '40', background: currentDomain.color + '0d' }}>
              <span>{currentDomain.icon}</span>
              <span>{currentDomain.label}</span>
            </div>

            {/* Question counter */}
            <div className="q-counter">Question {questionIndex + 1} of {currentDomain.questions.length}</div>

            {/* Question */}
            <div className="question-text">{currentQuestion.text}</div>

            {/* Options */}
            <div className="options">
              {currentQuestion.options.map((opt, i) => (
                <div
                  key={i}
                  className={`option ${selected === opt.score ? 'selected' : ''}`}
                  onClick={() => handleAnswer(opt.score)}
                >
                  <div className="option-letter">{['A', 'B', 'C', 'D'][i]}</div>
                  {opt.label}
                </div>
              ))}
            </div>

            {/* Domain description */}
            <div style={{ marginTop: 28, padding: '14px 18px', background: '#f7f8ff', borderLeft: '3px solid ' + currentDomain.color }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.13em', textTransform: 'uppercase', color: currentDomain.color, marginBottom: 5 }}>Why we ask this</div>
              <div style={{ fontSize: 12, color: '#666', fontWeight: 300, lineHeight: 1.6 }}>{currentDomain.description}</div>
              <div style={{ fontSize: 11, color: '#aaa', marginTop: 5 }}>Research basis: {currentDomain.basis}</div>
            </div>
          </div>
        </div>
      )}

      {/* ── RESULTS ── */}
      {phase === 'results' && (
        <div className="page">
          <div style={{ maxWidth: 680, width: '100%' }}>
            <div className="card">
              <div className="tag" style={{ background: '#f0f5ff', color: '#1a56db', border: '1px solid #d0e0ff' }}>Your Results</div>
              <h1 className="h1">Your <b>physiological profile</b></h1>
              <p style={{ fontSize: 14, color: '#666', fontWeight: 300, lineHeight: 1.7, marginBottom: 8 }}>
                These results reflect patterns in your responses mapped against peer-reviewed screening frameworks. They are <b>not a diagnosis</b> — they are indicators of where biological optimisation may have the greatest impact.
              </p>
              <p style={{ fontSize: 12, color: '#aaa', marginBottom: 0 }}>Assessed using: PSQI · ISI · PSS-10 · MBI indicators · MUST · BDA micronutrient criteria · Hansraj postural loading research</p>

              <div className="results-grid">
                {domainScores.map(d => {
                  const level = getLevel(d.score, d.maxScore);
                  const pct = (d.score / d.maxScore) * 100;
                  return (
                    <div key={d.id} className="result-row" style={{ borderLeft: `3px solid ${d.color}` }}>
                      <div className="result-icon">{d.icon}</div>
                      <div className="result-info">
                        <div className="result-label">{d.label}</div>
                        <div className="result-desc">{level.description}</div>
                        <div className="result-bar-track">
                          <div className="result-bar-fill" style={{ width: `${pct}%`, background: d.color }} />
                        </div>
                      </div>
                      <div className="result-badge" style={{ background: level.bg, color: level.color }}>{level.label}</div>
                    </div>
                  );
                })}
              </div>

              {/* What this means */}
              <div style={{ background: '#fafafa', border: '1px solid #eee', padding: 20, marginTop: 8 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: '#888', marginBottom: 12 }}>How to read this</div>
                {[
                  { label: 'Optimal', color: '#059669', desc: 'No significant patterns detected. Maintain current habits in this domain.' },
                  { label: 'Mild Concern', color: '#d97706', desc: 'Some indicators suggest room for targeted optimisation.' },
                  { label: 'Moderate Concern', color: '#ea580c', desc: 'Several patterns suggest this domain is meaningfully affecting your wellbeing.' },
                  { label: 'High Priority', color: '#dc2626', desc: 'Multiple indicators point to significant disruption. A personalised protocol is strongly recommended.' },
                ].map((l, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '7px 0', borderBottom: i < 3 ? '1px solid #eee' : 'none' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: l.color, whiteSpace: 'nowrap', paddingTop: 2, minWidth: 120 }}>{l.label}</span>
                    <span style={{ fontSize: 12, color: '#666', fontWeight: 300, lineHeight: 1.5 }}>{l.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="cta-box">
              <h3>Get your full protocol</h3>
              <p>A gender-differentiated, evidence-based action plan covering nutrition, sleep, supplementation, posture, and lifestyle — built specifically for your physiological profile.</p>
              <button className="btn btn-blue" style={{ fontSize: 14, padding: '14px 32px' }}>Unlock Full Report — £29</button>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,.25)', marginTop: 14 }}>14-day satisfaction guarantee · One-time payment · No subscription</p>
            </div>

            <div style={{ textAlign: 'center', marginTop: 20 }}>
              <a href="/" style={{ fontSize: 12, color: '#aaa', textDecoration: 'none' }}>← Back to SciMax</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

