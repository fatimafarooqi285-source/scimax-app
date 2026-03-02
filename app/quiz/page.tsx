"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ALL_CATEGORIES } from "@/lib/questions";
import { QuizAnswer, Question } from "@/lib/types";

function getVisibleQuestions(category: (typeof ALL_CATEGORIES)[0], answers: QuizAnswer[]): Question[] {
  return category.questions.filter((q) => {
    if (!q.showIf) return true;
    const depAnswer = answers.find((a) => a.questionId === q.showIf!.questionId);
    if (!depAnswer) return false;
    const val = depAnswer.answer;
    if (Array.isArray(val)) {
      return val.some((v) => q.showIf!.values.includes(v));
    }
    return q.showIf!.values.includes(val as string);
  });
}

export default function QuizPage() {
  const router = useRouter();
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [currentSelections, setCurrentSelections] = useState<string[]>([]);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [animating, setAnimating] = useState(false);

  const currentCategory = ALL_CATEGORIES[categoryIndex];
  const visibleQuestions = getVisibleQuestions(currentCategory, answers);
  const currentQuestion = visibleQuestions[questionIndex];

  const totalCategories = ALL_CATEGORIES.length;
  const overallProgress = ((categoryIndex / totalCategories) * 100) + ((questionIndex / (visibleQuestions.length * totalCategories)) * 100);

  // Load existing answer for this question (for back navigation)
  useEffect(() => {
    if (!currentQuestion) return;
    const existing = answers.find((a) => a.questionId === currentQuestion.id);
    if (existing) {
      const val = existing.answer;
      setCurrentSelections(Array.isArray(val) ? val : [val as string]);
    } else {
      setCurrentSelections([]);
    }
  }, [currentQuestion?.id, categoryIndex, questionIndex]);

  function handleSelect(value: string) {
    if (currentQuestion.type === "single") {
      setCurrentSelections([value]);
    } else {
      setCurrentSelections((prev) => {
        if (value === "none") return ["none"];
        const without_none = prev.filter((v) => v !== "none");
        if (without_none.includes(value)) {
          return without_none.filter((v) => v !== value);
        } else {
          return [...without_none, value];
        }
      });
    }
  }

  function saveCurrentAnswer() {
    if (currentSelections.length === 0) return;
    const answerValue =
      currentQuestion.type === "single" ? currentSelections[0] : currentSelections;

    const newAnswer: QuizAnswer = {
      categoryId: currentCategory.id,
      categoryName: currentCategory.name,
      questionId: currentQuestion.id,
      question: currentQuestion.text,
      answer: answerValue,
    };

    setAnswers((prev) => {
      const filtered = prev.filter((a) => a.questionId !== currentQuestion.id);
      return [...filtered, newAnswer];
    });
    return newAnswer;
  }

  function navigate(dir: "forward" | "backward") {
    if (animating) return;
    setAnimating(true);
    setDirection(dir);
    setTimeout(() => setAnimating(false), 350);
  }

  function handleNext() {
    if (currentSelections.length === 0) return;
    saveCurrentAnswer();
    navigate("forward");

    // Move to next question or category
    if (questionIndex < visibleQuestions.length - 1) {
      setQuestionIndex((q) => q + 1);
    } else if (categoryIndex < ALL_CATEGORIES.length - 1) {
      setCategoryIndex((c) => c + 1);
      setQuestionIndex(0);
    } else {
      // Done! Save to sessionStorage and go to results
      const finalAnswer: QuizAnswer = {
        categoryId: currentCategory.id,
        categoryName: currentCategory.name,
        questionId: currentQuestion.id,
        question: currentQuestion.text,
        answer: currentQuestion.type === "single" ? currentSelections[0] : currentSelections,
      };
      const allAnswers = [
        ...answers.filter((a) => a.questionId !== currentQuestion.id),
        finalAnswer,
      ];
      sessionStorage.setItem("scimax_answers", JSON.stringify(allAnswers));
      router.push("/results");
    }
  }

  function handleBack() {
    navigate("backward");
    if (questionIndex > 0) {
      setQuestionIndex((q) => q - 1);
    } else if (categoryIndex > 0) {
      setCategoryIndex((c) => c - 1);
      const prevCat = ALL_CATEGORIES[categoryIndex - 1];
      const prevVisible = getVisibleQuestions(prevCat, answers);
      setQuestionIndex(prevVisible.length - 1);
    }
  }

  if (!currentQuestion) return null;

  const isFirst = categoryIndex === 0 && questionIndex === 0;
  const isLast =
    categoryIndex === ALL_CATEGORIES.length - 1 &&
    questionIndex === visibleQuestions.length - 1;
  const canProceed = currentSelections.length > 0;

  const animClass = animating
    ? direction === "forward"
      ? "translate-x-8 opacity-0"
      : "-translate-x-8 opacity-0"
    : "translate-x-0 opacity-100";

  return (
    <div className="min-h-screen bg-[#050B14] flex flex-col">
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#050B14]/95 backdrop-blur-md border-b border-[#1E3A5F]/50">
        <div className="max-w-2xl mx-auto px-6 py-4">
          {/* Header row */}
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 text-[#475569] hover:text-white transition-colors text-sm"
            >
              <div className="w-6 h-6 rounded bg-gradient-to-br from-[#00D4FF] to-[#0099CC] flex items-center justify-center text-[#050B14] font-black text-xs">
                Sx
              </div>
              SciMax
            </button>

            <div className="text-center">
              <div className="text-xs text-[#475569] uppercase tracking-widest mb-0.5">
                {currentCategory.name}
              </div>
              <div className="flex items-center gap-1.5">
                {ALL_CATEGORIES.map((cat, i) => (
                  <div
                    key={cat.id}
                    className={`h-1 rounded-full transition-all duration-500 ${
                      i < categoryIndex
                        ? "bg-[#00D4FF] w-4"
                        : i === categoryIndex
                        ? "bg-[#00D4FF]/60 w-6"
                        : "bg-[#1E3A5F] w-2"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="text-xs text-[#475569]">
              {Math.round(overallProgress)}% complete
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1 bg-[#1E3A5F] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#0099CC] to-[#00D4FF] rounded-full transition-all duration-700 ease-out"
              style={{ width: `${Math.max(2, overallProgress)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 pt-28 pb-32">
        <div
          className={`w-full max-w-2xl transition-all duration-300 ease-out ${animClass}`}
        >
          {/* Category badge */}
          <div className="flex items-center gap-2 mb-6">
            <span className="text-2xl">{currentCategory.icon}</span>
            <span
              className="text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full border"
              style={{
                color: currentCategory.color,
                borderColor: currentCategory.color + "40",
                background: currentCategory.color + "10",
              }}
            >
              {currentCategory.name}
            </span>
            <span className="text-[#475569] text-xs ml-auto">
              {questionIndex + 1} / {visibleQuestions.length}
            </span>
          </div>

          {/* Question */}
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight">
            {currentQuestion.text}
          </h2>
          {currentQuestion.subtext && (
            <p className="text-[#64748B] text-sm mb-8 leading-relaxed">
              {currentQuestion.subtext}
            </p>
          )}
          {!currentQuestion.subtext && <div className="mb-8" />}

          {/* Type indicator */}
          {currentQuestion.type === "multi" && (
            <div className="flex items-center gap-2 mb-4 text-xs text-[#F5A623]">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Select all that apply
            </div>
          )}

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((opt) => {
              const isSelected = currentSelections.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  onClick={() => handleSelect(opt.value)}
                  className={`w-full text-left p-5 rounded-xl border transition-all duration-200 group ${
                    isSelected
                      ? "option-selected"
                      : "bg-[#0D1B2A] border-[#1E3A5F] hover:border-[#2a4a7f] hover:bg-[#112240]"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Checkbox / Radio indicator */}
                    <div
                      className={`flex-shrink-0 transition-all duration-200 ${
                        currentQuestion.type === "multi"
                          ? `w-5 h-5 rounded border-2 flex items-center justify-center ${
                              isSelected
                                ? "bg-[#00D4FF] border-[#00D4FF]"
                                : "border-[#2a4a7f] group-hover:border-[#00D4FF]/50"
                            }`
                          : `w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              isSelected
                                ? "border-[#00D4FF]"
                                : "border-[#2a4a7f] group-hover:border-[#00D4FF]/50"
                            }`
                      }`}
                    >
                      {currentQuestion.type === "multi" && isSelected && (
                        <svg className="w-3 h-3 text-[#050B14]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                      {currentQuestion.type === "single" && isSelected && (
                        <div className="w-2.5 h-2.5 rounded-full bg-[#00D4FF]" />
                      )}
                    </div>

                    <div className="flex-1">
                      <span
                        className={`font-medium transition-colors ${
                          isSelected ? "text-white" : "text-[#94A3B8]"
                        }`}
                      >
                        {opt.label}
                      </span>
                      {opt.description && (
                        <p className="text-xs text-[#475569] mt-1">
                          {opt.description}
                        </p>
                      )}
                    </div>

                    {isSelected && (
                      <div className="flex-shrink-0 w-2 h-2 rounded-full bg-[#00D4FF] animate-pulse" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#050B14]/95 backdrop-blur-md border-t border-[#1E3A5F]/50">
        <div className="max-w-2xl mx-auto px-6 py-5 flex items-center justify-between">
          {!isFirst ? (
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-[#475569] hover:text-white transition-colors py-3 px-4 rounded-xl hover:bg-[#0D1B2A]"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={handleNext}
            disabled={!canProceed}
            className="btn-primary px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isLast ? "View My Protocol" : "Continue"}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
