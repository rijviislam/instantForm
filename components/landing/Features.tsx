"use client";

import {
  AlertCircle,
  BarChart3,
  Calendar,
  Check,
  CheckCircle2,
  CheckSquare,
  Clock,
  FileText,
  Flame,
  GripVertical,
  ListFilter,
  Mail,
  Palette,
  Phone,
  Share2,
  Sliders,
  Sparkles,
  Star,
} from "lucide-react";
import { useRef, useState } from "react";
import { Badge } from "../ui/Badge";

export function Features() {
  const sectionRef = useRef<HTMLDivElement>(null);

  // 1. Drag & Drop state
  const [fieldsList, setFieldsList] = useState([
    { id: "1", name: "Company Name", type: "Short Text" },
    { id: "2", name: "Work Email", type: "Email" },
    { id: "3", name: "Team Size", type: "Dropdown" },
  ]);

  const moveField = (index: number, direction: "up" | "down") => {
    const newList = [...fieldsList];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newList.length) return;
    const temp = newList[index];
    newList[index] = newList[targetIdx];
    newList[targetIdx] = temp;
    setFieldsList(newList);
  };

  // 2. Field Types selection
  const [activeFieldType, setActiveFieldType] = useState("Rating");

  const fieldTypes = [
    { name: "Short Text", icon: <FileText className="w-3.5 h-3.5" /> },
    { name: "Email Input", icon: <Mail className="w-3.5 h-3.5" /> },
    { name: "Phone Number", icon: <Phone className="w-3.5 h-3.5" /> },
    { name: "Rating", icon: <Star className="w-3.5 h-3.5" /> },
    { name: "Multiple Choice", icon: <CheckSquare className="w-3.5 h-3.5" /> },
    { name: "Date & Time", icon: <Calendar className="w-3.5 h-3.5" /> },
    { name: "Dropdown", icon: <ListFilter className="w-3.5 h-3.5" /> },
    { name: "Time Slot", icon: <Clock className="w-3.5 h-3.5" /> },
  ];

  // 3. Theme switch state
  const [activeTheme, setActiveTheme] = useState<"cream" | "velvet" | "sunset" | "sage">("cream");

  const themes = [
    {
      id: "cream" as const,
      name: "Warm Cream",
      bg: "bg-[#FAF8F5]",
      accent: "bg-[#FF5A36]",
      card: "bg-white border-[#EAE3D6] text-[#1C1917]",
    },
    {
      id: "velvet" as const,
      name: "Velvet Dark",
      bg: "bg-[#1C1917]",
      accent: "bg-[#FFA07A]",
      card: "bg-[#292524] border-[#3F3A36] text-white",
    },
    {
      id: "sunset" as const,
      name: "Sunset Coral",
      bg: "bg-[#FFF4EE]",
      accent: "bg-[#E44825]",
      card: "bg-[#FFF8F5] border-[#FFD8CC] text-[#1C1917]",
    },
    {
      id: "sage" as const,
      name: "Sage Mint",
      bg: "bg-[#F3F6F4]",
      accent: "bg-[#2D6A4F]",
      card: "bg-white border-[#D8E2DC] text-[#1C1917]",
    },
  ];

  // 4. Share link state
  const [copiedLink, setCopiedLink] = useState(false);
  const handleCopyLink = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // 5. Smart Validation interactive state
  const [testEmail, setTestEmail] = useState("alex@company.com");
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // 6. Live Responses counter state
  const [liveCounter, setLiveCounter] = useState(1420);
  const [recentLive, setRecentLive] = useState("Just now: +1 from London, UK");

  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setLiveCounter((prev) => prev + 1);
  //     const cities = ["Tokyo, JP", "San Francisco, US", "Berlin, DE", "Sydney, AU", "Dhaka, BD", "Toronto, CA"];
  //     const city = cities[Math.floor(Math.random() * cities.length)];
  //     setRecentLive(`Just now: +1 from ${city}`);
  //   }, 4500);

  //   return () => clearInterval(timer);
  // }, []);

  // useEffect(() => {
  //   registerGSAP();
  //   if (prefersReducedMotion()) return;

  //   const ctx = gsap.context(() => {
  //     gsap.from(".feature-box", {
  //       scrollTrigger: {
  //         trigger: sectionRef.current,
  //         start: "top 75%",
  //       },
  //       y: 40,
  //       opacity: 0,
  //       stagger: 0.12,
  //       duration: 0.7,
  //       ease: "power3.out",
  //     });
  //   }, sectionRef);

  //   return () => ctx.revert();
  // }, []);

  return (
    <section
      ref={sectionRef}
      id="features"
      className="py-24 md:py-32 bg-white relative border-y border-[#EAE3D6]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <Badge
            variant="coral"
            icon={<Sparkles className="w-3.5 h-3.5" />}
            className="mb-4"
          >
            Built for Better Forms
          </Badge>
          <h2 className="font-serif-editorial text-3xl sm:text-5xl md:text-6xl text-[#1C1917] tracking-tight font-normal leading-[1.1]">
            Everything you need.{" "}
            <span className="italic font-medium text-[#FF5A36]">Nothing</span> getting in the way.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#57534E] leading-relaxed">
            Every feature has been meticulously crafted to save hours of setup while giving respondents an unforgettable, responsive experience.
          </p>
        </div>

        {/* 6 Feature Cards Grid with Interactive UI Mockups */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* FEATURE 01: Drag & Drop */}
          <div className="feature-box flex flex-col justify-between bg-[#FAF8F5] rounded-3xl p-6 sm:p-7 border border-[#EAE3D6] hover:border-[#D9CFBE] hover:bg-white card-shadow transition-all duration-300">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-white border border-[#EAE3D6] text-[#FF5A36] flex items-center justify-center mb-4 shadow-xs">
                <GripVertical className="w-5 h-5" />
              </div>
              <h3 className="font-serif-editorial text-2xl text-[#1C1917] font-medium">
                Drag & Drop
              </h3>
              <p className="text-xs sm:text-sm text-[#57534E] mt-1.5 leading-relaxed">
                Build forms visually by arranging fields exactly where you want them. Instant reordering with smooth tactile feedback.
              </p>
            </div>

            {/* Interactive Mockup 01 */}
            <div className="mt-6 pt-4 border-t border-[#EAE3D6]/70">
              <div className="bg-white rounded-2xl p-3 border border-[#EAE3D6] space-y-2">
                <p className="text-[10px] font-semibold text-[#78716C] uppercase tracking-wider px-1">
                  Reorder Playground
                </p>
                {fieldsList.map((item, idx) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2 rounded-xl bg-[#FAF8F5] border border-[#EAE3D6] text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[#A8A29E]">
                        <GripVertical className="w-3.5 h-3.5" />
                      </span>
                      <span className="font-medium text-[#1C1917]">
                        {item.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveField(idx, "up")}
                        disabled={idx === 0}
                        className="p-1 rounded-md bg-white border border-[#EAE3D6] text-[10px] text-[#57534E] disabled:opacity-30 hover:bg-[#FFF0EB] cursor-pointer"
                        title="Move Up"
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        onClick={() => moveField(idx, "down")}
                        disabled={idx === fieldsList.length - 1}
                        className="p-1 rounded-md bg-white border border-[#EAE3D6] text-[10px] text-[#57534E] disabled:opacity-30 hover:bg-[#FFF0EB] cursor-pointer"
                        title="Move Down"
                      >
                        ▼
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* FEATURE 02: 20+ Field Types */}
          <div className="feature-box flex flex-col justify-between bg-[#FAF8F5] rounded-3xl p-6 sm:p-7 border border-[#EAE3D6] hover:border-[#D9CFBE] hover:bg-white card-shadow transition-all duration-300">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-white border border-[#EAE3D6] text-[#FF5A36] flex items-center justify-center mb-4 shadow-xs">
                <Sliders className="w-5 h-5" />
              </div>
              <h3 className="font-serif-editorial text-2xl text-[#1C1917] font-medium">
                20+ Field Types
              </h3>
              <p className="text-xs sm:text-sm text-[#57534E] mt-1.5 leading-relaxed">
                Text, email, phone, rating, choice, date, time, dropdown, matrix and signature—all available out of the box.
              </p>
            </div>

            {/* Interactive Mockup 02 */}
            <div className="mt-6 pt-4 border-t border-[#EAE3D6]/70">
              <div className="bg-white rounded-2xl p-3 border border-[#EAE3D6] space-y-2">
                <p className="text-[10px] font-semibold text-[#78716C] uppercase tracking-wider px-1">
                  Click to inspect field
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {fieldTypes.map((type) => (
                    <button
                      key={type.name}
                      type="button"
                      onClick={() => setActiveFieldType(type.name)}
                      className={`p-2 rounded-xl border text-[11px] font-medium flex items-center gap-1.5 transition-all text-left cursor-pointer ${
                        activeFieldType === type.name
                          ? "bg-[#FFF0EB] border-[#FF5A36] text-[#FF5A36] shadow-xs"
                          : "bg-[#FAF8F5] border-[#EAE3D6] text-[#57534E] hover:bg-white"
                      }`}
                    >
                      {type.icon}
                      <span className="truncate">{type.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* FEATURE 03: Beautiful Themes */}
          <div className="feature-box flex flex-col justify-between bg-[#FAF8F5] rounded-3xl p-6 sm:p-7 border border-[#EAE3D6] hover:border-[#D9CFBE] hover:bg-white card-shadow transition-all duration-300">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-white border border-[#EAE3D6] text-[#FF5A36] flex items-center justify-center mb-4 shadow-xs">
                <Palette className="w-5 h-5" />
              </div>
              <h3 className="font-serif-editorial text-2xl text-[#1C1917] font-medium">
                Beautiful Themes
              </h3>
              <p className="text-xs sm:text-sm text-[#57534E] mt-1.5 leading-relaxed">
                Choose visual styles that match your brand, event, survey, or use case. Instant palette swapping in 1 click.
              </p>
            </div>

            {/* Interactive Mockup 03 */}
            <div className="mt-6 pt-4 border-t border-[#EAE3D6]/70">
              <div className="bg-white rounded-2xl p-3 border border-[#EAE3D6] space-y-2.5">
                {/* Theme Switcher buttons */}
                <div className="flex items-center gap-1.5 justify-between">
                  {themes.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setActiveTheme(t.id)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border transition-all cursor-pointer ${
                        activeTheme === t.id
                          ? "bg-[#1C1917] text-white border-[#1C1917]"
                          : "bg-[#FAF8F5] text-[#57534E] border-[#EAE3D6] hover:border-[#D6CEC1]"
                      }`}
                    >
                      {t.name.split(" ")[0]}
                    </button>
                  ))}
                </div>

                {/* Preview Mini Form in Selected Theme */}
                {(() => {
                  const currentTheme = themes.find((t) => t.id === activeTheme) || themes[0];
                  return (
                    <div
                      className={`p-3 rounded-xl border transition-all duration-300 ${currentTheme.bg} ${currentTheme.card}`}
                    >
                      <p className="text-xs font-serif-editorial font-medium">
                        Instant Theme Preview
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-[10px] opacity-75">Theme active</span>
                        <span
                          className={`w-4 h-4 rounded-full ${currentTheme.accent} flex items-center justify-center text-white text-[8px]`}
                        >
                          ✓
                        </span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>

          {/* FEATURE 04: Instant Sharing */}
          <div className="feature-box flex flex-col justify-between bg-[#FAF8F5] rounded-3xl p-6 sm:p-7 border border-[#EAE3D6] hover:border-[#D9CFBE] hover:bg-white card-shadow transition-all duration-300">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-white border border-[#EAE3D6] text-[#FF5A36] flex items-center justify-center mb-4 shadow-xs">
                <Share2 className="w-5 h-5" />
              </div>
              <h3 className="font-serif-editorial text-2xl text-[#1C1917] font-medium">
                Instant Sharing
              </h3>
              <p className="text-xs sm:text-sm text-[#57534E] mt-1.5 leading-relaxed">
                Publish your form and share a clean public link. Embed anywhere with a lightweight script or iframe.
              </p>
            </div>

            {/* Interactive Mockup 04 */}
            <div className="mt-6 pt-4 border-t border-[#EAE3D6]/70">
              <div className="bg-white rounded-2xl p-3 border border-[#EAE3D6] space-y-2">
                <div className="flex items-center justify-between text-[10px] font-semibold text-[#78716C] uppercase px-1">
                  <span>Clean Shortlink</span>
                  <span className="text-[#22C55E] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" /> Active
                  </span>
                </div>

                <div className="flex items-center gap-1.5 bg-[#FAF8F5] p-2 rounded-xl border border-[#EAE3D6]">
                  <span className="text-xs font-mono text-[#292524] truncate flex-1">
                    instantform.io/f/user-research
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="px-2.5 py-1 rounded-lg bg-white border border-[#EAE3D6] text-xs font-medium text-[#1C1917] hover:bg-[#FFF0EB] hover:text-[#FF5A36] transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-3 h-3 text-[#22C55E]" />
                        <span className="text-[#22C55E]">Copied!</span>
                      </>
                    ) : (
                      <>
                        <span className="text-xs">Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* FEATURE 05: Smart Validation */}
          <div className="feature-box flex flex-col justify-between bg-[#FAF8F5] rounded-3xl p-6 sm:p-7 border border-[#EAE3D6] hover:border-[#D9CFBE] hover:bg-white card-shadow transition-all duration-300">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-white border border-[#EAE3D6] text-[#FF5A36] flex items-center justify-center mb-4 shadow-xs">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="font-serif-editorial text-2xl text-[#1C1917] font-medium">
                Smart Validation
              </h3>
              <p className="text-xs sm:text-sm text-[#57534E] mt-1.5 leading-relaxed">
                Make sure respondents provide the information you actually need with gentle, real-time inline validation.
              </p>
            </div>

            {/* Interactive Mockup 05 */}
            <div className="mt-6 pt-4 border-t border-[#EAE3D6]/70">
              <div className="bg-white rounded-2xl p-3 border border-[#EAE3D6] space-y-2">
                <div className="flex items-center justify-between text-[10px] font-semibold text-[#78716C] uppercase px-1">
                  <span>Live Input Validator</span>
                  {isValidEmail(testEmail) ? (
                    <span className="text-[#22C55E] flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-3 h-3" /> Valid
                    </span>
                  ) : (
                    <span className="text-[#EF4444] flex items-center gap-1 font-semibold">
                      <AlertCircle className="w-3 h-3" /> Enter valid email
                    </span>
                  )}
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    className={`w-full text-xs p-2.5 rounded-xl border transition-all focus:outline-hidden ${
                      isValidEmail(testEmail)
                        ? "bg-[#FAF8F5] border-[#22C55E]/60 text-[#1C1917] focus:ring-1 focus:ring-[#22C55E]"
                        : "bg-[#FFF5F5] border-[#EF4444] text-[#B91C1C] focus:ring-1 focus:ring-[#EF4444]"
                    }`}
                    placeholder="Type an email..."
                  />
                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
                    {isValidEmail(testEmail) ? (
                      <Check className="w-3.5 h-3.5 text-[#22C55E]" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 text-[#EF4444]" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FEATURE 06: Live Responses */}
          <div className="feature-box flex flex-col justify-between bg-[#FAF8F5] rounded-3xl p-6 sm:p-7 border border-[#EAE3D6] hover:border-[#D9CFBE] hover:bg-white card-shadow transition-all duration-300">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-white border border-[#EAE3D6] text-[#FF5A36] flex items-center justify-center mb-4 shadow-xs">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="font-serif-editorial text-2xl text-[#1C1917] font-medium">
                Live Responses
              </h3>
              <p className="text-xs sm:text-sm text-[#57534E] mt-1.5 leading-relaxed">
                See responses clearly without fighting through a spreadsheet. Instant visual metrics, export, and trends.
              </p>
            </div>

            {/* Interactive Mockup 06 */}
            <div className="mt-6 pt-4 border-t border-[#EAE3D6]/70">
              <div className="bg-white rounded-2xl p-3 border border-[#EAE3D6] space-y-2">
                <div className="flex items-center justify-between text-[10px] font-semibold text-[#78716C] uppercase px-1">
                  <span>Stream Monitor</span>
                  <span className="flex items-center gap-1 text-[#FF5A36]">
                    <Flame className="w-3 h-3" /> Live
                  </span>
                </div>

                <div className="p-2.5 bg-[#FAF8F5] rounded-xl border border-[#EAE3D6] flex items-center justify-between">
                  <div>
                    <div className="font-serif-editorial text-xl font-bold text-[#1C1917] leading-none">
                      {liveCounter.toLocaleString()}
                    </div>
                    <p className="text-[10px] text-[#78716C] mt-1">
                      {recentLive}
                    </p>
                  </div>
                  <span className="w-3 h-3 rounded-full bg-[#22C55E] animate-ping opacity-75" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
