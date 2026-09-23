"use client";

import confetti from "canvas-confetti";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  MousePointer2,
  Palette,
  RotateCcw,
  Sliders,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

export function HeroVisual() {
  const [selectedRating, setSelectedRating] = useState<string>("excellent");
  const [step, setStep] = useState<number>(1);
  const [feedbackText, setFeedbackText] = useState<string>("");
  const [category, setCategory] = useState<string>("Speed & Design");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const options = [
    { id: "excellent", label: "Excellent", emoji: "✨", desc: "Fast, elegant & seamless" },
    { id: "good", label: "Good", emoji: "👍", desc: "Clean & easy to navigate" },
    { id: "okay", label: "Okay", emoji: "🤔", desc: "Met basic expectations" },
    { id: "needs_work", label: "Needs work", emoji: "🛠️", desc: "Could be improved" },
  ];

  const handleContinue = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setStep(3);
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ["#FF5A36", "#FFA07A", "#292524", "#F4EFE6"],
        });
      }, 400);
    }
  };

  const handleReset = () => {
    setStep(1);
    setSelectedRating("excellent");
    setFeedbackText("");
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto border-4 border-black">
      {/* Ambient background glow behind card */}
      <div className="absolute -inset-4 bg-gradient-to-tr from-[#FF5A36]/15 via-[#FFA07A]/10 to-amber-200/20 rounded-3xl blur-2xl -z-10 pointer-events-none" />

      {/* Floating Badge 1: Top Right */}
      <div
        id="hero-floating-1"
        className="hidden sm:flex absolute -top-5 -right-6 z-20 items-center gap-2.5 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-[#EAE3D6] shadow-lg shadow-stone-900/5 transform rotate-2 hover:rotate-0 transition-transform duration-200"
      >
        <div className="w-7 h-7 rounded-lg bg-[#FFF0EB] text-[#FF5A36] flex items-center justify-center">
          <TrendingUp className="w-4 h-4" />
        </div>
        <div>
          <p className="text-[11px] font-semibold text-[#1C1917] leading-none">
            +94.2% Completion
          </p>
          <p className="text-[10px] text-[#78716C] mt-0.5">
            2.4x higher than industry avg
          </p>
        </div>
      </div>

      {/* Floating Badge 2: Bottom Left */}
      <div
        id="hero-floating-2"
        className="hidden sm:flex absolute -bottom-5 -left-6 z-20 items-center gap-2.5 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-[#EAE3D6] shadow-lg shadow-stone-900/5 transform -rotate-2 hover:rotate-0 transition-transform duration-200"
      >
        <div className="w-7 h-7 rounded-lg bg-[#F4EFE6] text-[#292524] flex items-center justify-center">
          <Palette className="w-4 h-4 text-[#FF5A36]" />
        </div>
        <div>
          <p className="text-[11px] font-semibold text-[#1C1917] leading-none">
            Theme: Warm Studio
          </p>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FAF8F5] border border-[#D6CEC1]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF5A36]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#1C1917]" />
            <span className="text-[10px] text-[#78716C] ml-1">Custom CSS</span>
          </div>
        </div>
      </div>

      {/* Floating Badge 3: Live Indicator */}
      <div
        id="hero-floating-3"
        className="hidden md:flex absolute top-1/2 -right-10 z-20 items-center gap-2 bg-[#1C1917] text-white px-3 py-1.5 rounded-full shadow-lg text-[11px] font-medium"
      >
        <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
        Live interactive demo
      </div>

      {/* Main Canvas Card */}
      <div
        id="hero-form-card"
        className="relative bg-white rounded-3xl border border-[#EAE3D6] shadow-[0_15px_40px_-10px_rgba(28,25,23,0.07)] overflow-hidden transition-all duration-300"
      >
        {/* Canvas Header / Browser bar */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#FAF8F5] border-b border-[#EAE3D6]">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E5DEC7]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#E5DEC7]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#E5DEC7]" />
            </div>
            <span className="text-xs font-semibold text-[#57534E] ml-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#FF5A36]" />
              InstantForm Preview
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#78716C] bg-white px-2.5 py-1 rounded-full border border-[#EAE3D6] flex items-center gap-1">
              <Eye className="w-3 h-3 text-[#FF5A36]" /> Step {step} of 2
            </span>
            {step > 1 && (
              <button
                type="button"
                onClick={handleReset}
                className="text-[11px] text-[#57534E] hover:text-[#1C1917] flex items-center gap-1 bg-white px-2.5 py-1 rounded-full border border-[#EAE3D6] transition-colors cursor-pointer"
                title="Restart demo"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            )}
          </div>
        </div>

        {/* Form Body Canvas */}
        <div className="p-6 sm:p-8 bg-[#FDFBF9]">
          {step === 1 && (
            <div className="space-y-6">
              {/* Form Title & Tagline */}
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFF0EB] text-[#FF5A36] text-[11px] font-semibold tracking-wide uppercase mb-2">
                  <Sparkles className="w-3 h-3" /> Customer Feedback Form
                </div>
                <h3 className="font-serif-editorial text-2xl sm:text-3xl text-[#1C1917] font-medium leading-tight">
                  How was your experience building with us?
                </h3>
                <p className="text-sm text-[#78716C] mt-1">
                  We use your honest thoughts to polish every interaction. Takes 30 seconds.
                </p>
              </div>

              {/* Interactive Radio Choice Options */}
              <div className="space-y-2.5">
                {options.map((option) => {
                  const isSelected = selectedRating === option.id;
                  return (
                    <div
                      key={option.id}
                      onClick={() => setSelectedRating(option.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setSelectedRating(option.id);
                        }
                      }}
                      tabIndex={0}
                      role="radio"
                      aria-checked={isSelected}
                      aria-label={`${option.label}: ${option.desc}`}
                      className={`group flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? "bg-white border-[#FF5A36] shadow-sm shadow-[#FF5A36]/10"
                          : "bg-white/70 border-[#EAE3D6] hover:bg-white hover:border-[#D6CEC1]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl flex items-center justify-center w-7 h-7">
                          {option.emoji}
                        </span>
                        <div>
                          <div className="text-sm font-semibold text-[#1C1917] flex items-center gap-2">
                            {option.label}
                            {isSelected && (
                              <span className="text-[10px] bg-[#FFF0EB] text-[#FF5A36] font-medium px-2 py-0.5 rounded-full">
                                Selected
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#78716C]">{option.desc}</p>
                        </div>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                          isSelected
                            ? "border-[#FF5A36] bg-[#FF5A36] text-white"
                            : "border-[#D6CEC1] bg-white group-hover:border-[#A8A29E]"
                        }`}
                      >
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Action bar */}
              <div className="flex items-center justify-between pt-3 border-t border-[#EAE3D6]/70">
                <div className="flex items-center gap-2 text-xs text-[#78716C]">
                  <MousePointer2 className="w-3.5 h-3.5 text-[#FF5A36]" />
                  <span>Click options to test interactive flow</span>
                </div>

                <button
                  type="button"
                  onClick={handleContinue}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FF5A36] text-white text-xs sm:text-sm font-semibold hover:bg-[#E44825] active:scale-95 transition-all shadow-sm cursor-pointer"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-200">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFF0EB] text-[#FF5A36] text-[11px] font-semibold tracking-wide uppercase mb-2">
                  <Sliders className="w-3 h-3" /> Question 2 of 2
                </div>
                <h3 className="font-serif-editorial text-2xl sm:text-3xl text-[#1C1917] font-medium leading-tight">
                  What stood out to you most?
                </h3>
                <p className="text-sm text-[#78716C] mt-1">
                  Pick a topic and add any optional comments.
                </p>
              </div>

              {/* Category tags */}
              <div className="flex flex-wrap gap-2">
                {[
                  "Speed & Design",
                  "No-Code Workflow",
                  "Form Aesthetics",
                  "Analytics View",
                ].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCategory(item)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                      category === item
                        ? "bg-[#1C1917] text-white border-[#1C1917]"
                        : "bg-white text-[#57534E] border-[#EAE3D6] hover:border-[#D6CEC1]"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>

              {/* Text Input */}
              <div className="space-y-2">
                <label
                  htmlFor="hero-feedback-input"
                  className="block text-xs font-semibold text-[#57534E] uppercase tracking-wider"
                >
                  Your thoughts (Optional)
                </label>
                <textarea
                  id="hero-feedback-input"
                  rows={3}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="InstantForm creates the cleanest forms I have ever published..."
                  className="w-full p-3.5 rounded-2xl bg-white border border-[#EAE3D6] text-sm text-[#1C1917] placeholder-[#A8A29E] focus:outline-hidden focus:border-[#FF5A36] focus:ring-2 focus:ring-[#FF5A36]/15 resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#EAE3D6]/70">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-[#57534E] hover:text-[#1C1917] font-medium transition-colors cursor-pointer"
                >
                  ← Back
                </button>

                <button
                  type="button"
                  onClick={handleContinue}
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FF5A36] text-white text-xs sm:text-sm font-semibold hover:bg-[#E44825] active:scale-95 transition-all shadow-sm cursor-pointer disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <span>Submitting...</span>
                  ) : (
                    <>
                      <span>Submit response</span>
                      <Sparkles className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-10 space-y-4 animate-in zoom-in-95 fade-in duration-300">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-[#FFF0EB] text-[#FF5A36] flex items-center justify-center shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif-editorial text-2xl sm:text-3xl text-[#1C1917]">
                Thank you for the feedback!
              </h3>
              <p className="text-sm text-[#78716C] max-w-sm mx-auto">
                Your response was recorded in real-time. Notice how smooth and pleasant the form journey feels.
              </p>
              <div className="pt-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FAF8F5] border border-[#EAE3D6] text-xs font-semibold text-[#1C1917] hover:bg-[#F4EFE6] transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#FF5A36]" />
                  Try demo again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
