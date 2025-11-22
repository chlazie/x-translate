"use client";
import { useState, useEffect, useRef } from "react";
import Sidebar from "./components/Sidebar";
import {
  Languages,
  Volume2,
  Copy,
  Check,
  Sparkles,
  Zap,
  Globe,
  ArrowRightLeft,
  Menu,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

// Supported languages with flags
const LANGUAGES = [
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "it", name: "Italian", flag: "🇮🇹" },
  { code: "pt", name: "Portuguese", flag: "🇵🇹" },
  { code: "ja", name: "Japanese", flag: "🇯🇵" },
  { code: "ko", name: "Korean", flag: "🇰🇷" },
  { code: "zh", name: "Chinese", flag: "🇨🇳" },
  { code: "ar", name: "Arabic", flag: "🇦🇪" },
  { code: "ru", name: "Russian", flag: "🇷🇺" },
];

interface TranslationHistoryItem {
  id: number;
  input: string;
  output: string;
  sourceLang: string;
  targetLang: string;
  timestamp: string;
  isMock?: boolean;
}

export default function Home() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("fr");
  const [isTranslating, setIsTranslating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [translationHistory, setTranslationHistory] = useState<
    TranslationHistoryItem[]
  >([]);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [translationSource, setTranslationSource] = useState<
    "free" | "mock" | null
  >(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [input]);

  // Update character count
  useEffect(() => {
    setCharCount(input.length);
  }, [input]);

  async function translate() {
    if (!input.trim()) return;

    setIsTranslating(true);
    setApiError(null);
    setTranslationSource(null);

    try {
      console.log("Using free translation API");

      const res = await fetch("/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: input,
          from: sourceLang,
          to: targetLang,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      const translatedText = data[0].translations[0].text;
      setOutput(translatedText);

      // Determine translation source based on response format
      if (translatedText.includes("[") && translatedText.includes("]")) {
        setTranslationSource("mock");
      } else {
        setTranslationSource("free");
      }

      // Add to history
      const newHistoryItem: TranslationHistoryItem = {
        id: Date.now(),
        input,
        output: translatedText,
        sourceLang,
        targetLang,
        timestamp: new Date().toLocaleTimeString(),
        isMock: translationSource === "mock",
      };

      setTranslationHistory((prev) => [newHistoryItem, ...prev.slice(0, 4)]);
    } catch (error) {
      console.error("Translation error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Translation failed";
      setApiError(errorMessage);
      setOutput("❌ Translation failed. Please try again.");
      setTranslationSource("mock");
    } finally {
      setIsTranslating(false);
    }
  }

  const copyToClipboard = async () => {
    if (!output) return;

    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const speakText = (text: string, lang: string) => {
    if (!text || !("speechSynthesis" in window)) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === "en" ? "en-US" : lang;
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
  };

  const swapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setInput(output);
    setOutput(input);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      translate();
    }
  };

  const getLanguageName = (code: string) => {
    return (
      LANGUAGES.find((lang) => lang.code === code)?.name || code.toUpperCase()
    );
  };

  const getLanguageFlag = (code: string) => {
    return LANGUAGES.find((lang) => lang.code === code)?.flag || "🌐";
  };

  const clearError = () => {
    setApiError(null);
  };

  const retryTranslation = () => {
    if (input.trim()) {
      translate();
    }
  };

  const safeText = (text: string) => {
    return text.replace(/<[^>]*>/g, "");
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0F0F0F] to-[#1A1A1A] relative">
      {/* Mobile Sidebar Overlay */}
      {isMobile && showMobileSidebar && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setShowMobileSidebar(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        ${
          isMobile
            ? "fixed inset-y-0 left-0 z-50 transform transition-transform duration-300"
            : "relative"
        }
        ${
          isMobile && !showMobileSidebar ? "-translate-x-full" : "translate-x-0"
        }
      `}
      >
        <Sidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center p-4 md:p-6 lg:p-8 transition-all duration-300 w-full">
        {/* Mobile Header */}
        {isMobile && (
          <div className="flex items-center justify-between w-full mb-6">
            <button
              onClick={() => setShowMobileSidebar(!showMobileSidebar)}
              className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <Menu size={24} className="text-white" />
            </button>
            <div className="flex items-center gap-2">
              <Languages className="text-[#8F8FFF]" size={28} />
              <h1 className="text-xl font-bold text-white">X-Translate</h1>
            </div>
            <div className="w-10"></div>
          </div>
        )}

        {/* Header */}
        {(!isMobile || !showMobileSidebar) && (
          <div className="text-center mb-6 md:mb-8 lg:mb-12 w-full">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-2 bg-[#8F8FFF] bg-opacity-20 rounded-xl">
                <Languages className="text-[#8F8FFF]" size={32} />
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                X-Translate
              </h1>
            </div>
            <p className="text-base md:text-lg lg:text-xl text-gray-400 max-w-2xl">
              Real-time translation powered by{" "}
              <span className="text-[#8F8FFF]">Free Translation APIs</span>
            </p>
            <div className="flex items-center justify-center gap-2 mt-3 text-sm text-gray-500 flex-wrap">
              <Zap size={14} className="text-yellow-500" />
              <span>Fast & Accurate</span>
              <Sparkles size={14} className="text-[#8F8FFF] ml-2 md:ml-4" />
              <span>100% Free</span>
            </div>
          </div>
        )}

        {/* Translation Source Indicator */}
        {translationSource === "free" && (
          <div className="w-full max-w-4xl mb-4">
            <div className="bg-green-500 bg-opacity-20 border border-green-500 border-opacity-30 rounded-xl p-3 text-center">
              <p className="text-green-200 text-sm">
                🌐 <strong>Free Translation API</strong> - Using LibreTranslate
                for real translations
              </p>
            </div>
          </div>
        )}

        {translationSource === "mock" && !apiError && (
          <div className="w-full max-w-4xl mb-4">
            <div className="bg-blue-500 bg-opacity-20 border border-blue-500 border-opacity-30 rounded-xl p-3 text-center">
              <p className="text-blue-200 text-sm">
                ⚡ <strong>Demo Mode</strong> - Using mock translations (Free
                APIs temporarily unavailable)
              </p>
            </div>
          </div>
        )}

        {/* API Error Alert */}
        {apiError && (
          <div className="w-full max-w-4xl mb-4">
            <div className="bg-red-500 bg-opacity-20 border border-red-500 border-opacity-30 rounded-xl p-3 flex items-center gap-3">
              <AlertCircle size={20} className="text-red-500 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-red-200 text-sm">{apiError}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={retryTranslation}
                  className="p-1 hover:bg-red-600 rounded transition-colors"
                  title="Retry translation"
                >
                  <RefreshCw size={16} className="text-red-200" />
                </button>
                <button
                  onClick={clearError}
                  className="text-red-200 hover:text-white transition-colors text-lg"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Translation Container */}
        {(!isMobile || !showMobileSidebar) && (
          <div className="w-full max-w-4xl space-y-4 md:space-y-6">
            {/* Language Selector */}
            <div className="flex flex-col md:flex-row md:items-center justify-between bg-[#1B1B1B] p-3 md:p-4 rounded-2xl border border-neutral-800 gap-3 md:gap-0">
              <div className="flex items-center justify-between md:justify-start gap-2 md:gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl md:text-2xl">
                    {getLanguageFlag(sourceLang)}
                  </span>
                  <span className="text-white font-medium text-sm md:text-base">
                    {getLanguageName(sourceLang)}
                  </span>
                </div>

                <button
                  onClick={swapLanguages}
                  className="p-1 md:p-2 hover:bg-neutral-800 rounded-xl transition-all duration-200 hover:scale-110"
                  title="Swap languages"
                >
                  <ArrowRightLeft size={16} className="text-gray-400" />
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-xl md:text-2xl">
                    {getLanguageFlag(targetLang)}
                  </span>
                  <span className="text-white font-medium text-sm md:text-base">
                    {getLanguageName(targetLang)}
                  </span>
                </div>
              </div>

              <div className="relative w-full md:w-auto">
                <select
                  value={targetLang}
                  onChange={(e) => setTargetLang(e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-700 text-white rounded-xl px-3 py-2 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-[#8F8FFF] focus:ring-opacity-50 text-sm md:text-base"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
                <Globe
                  size={14}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>

            {/* Translation Boxes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              {/* Input Box */}
              <div className="bg-[#1B1B1B] rounded-2xl border border-neutral-800 p-4 md:p-6 shadow-2xl">
                <div className="flex justify-between items-center mb-3 md:mb-4">
                  <label className="text-gray-400 text-xs md:text-sm font-medium">
                    Source Text
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">
                      {charCount}/5000
                    </span>
                    <button
                      onClick={() => setInput("")}
                      className="text-xs text-gray-500 hover:text-white transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Enter text to translate... (Ctrl + Enter to translate)"
                  className="w-full min-h-[120px] md:min-h-[150px] bg-transparent text-white placeholder-gray-500 resize-none focus:outline-none leading-relaxed text-base md:text-lg"
                  maxLength={5000}
                  rows={4}
                />

                <div className="flex justify-between items-center mt-3 md:mt-4 pt-3 md:pt-4 border-t border-neutral-800">
                  <button
                    onClick={() => speakText(input, sourceLang)}
                    disabled={!input}
                    className="p-1 md:p-2 hover:bg-neutral-800 rounded-xl transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Listen"
                  >
                    <Volume2 size={16} className="text-gray-400" />
                  </button>

                  <div className="text-xs text-gray-500 hidden sm:block">
                    Press{" "}
                    <kbd className="px-1 py-0.5 bg-neutral-800 rounded text-xs">
                      Ctrl
                    </kbd>{" "}
                    +{" "}
                    <kbd className="px-1 py-0.5 bg-neutral-800 rounded text-xs">
                      Enter
                    </kbd>{" "}
                    to translate
                  </div>
                </div>
              </div>

              {/* Output Box */}
              <div className="bg-[#1B1B1B] rounded-2xl border border-neutral-800 p-4 md:p-6 shadow-2xl">
                <div className="flex justify-between items-center mb-3 md:mb-4">
                  <label className="text-gray-400 text-xs md:text-sm font-medium">
                    Translation
                  </label>
                  <div className="flex items-center gap-2">
                    {output && (
                      <>
                        <button
                          onClick={copyToClipboard}
                          className="p-1 md:p-2 hover:bg-neutral-800 rounded-xl transition-all duration-200"
                          title="Copy translation"
                        >
                          {copied ? (
                            <Check size={14} className="text-green-400" />
                          ) : (
                            <Copy size={14} className="text-gray-400" />
                          )}
                        </button>
                        <button
                          onClick={() => speakText(output, targetLang)}
                          className="p-1 md:p-2 hover:bg-neutral-800 rounded-xl transition-all duration-200"
                          title="Listen"
                        >
                          <Volume2 size={14} className="text-gray-400" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="min-h-[120px] md:min-h-[150px] text-white leading-relaxed text-base md:text-lg whitespace-pre-wrap">
                  {isTranslating ? (
                    <div className="flex items-center justify-center h-24 md:h-32">
                      <div className="flex items-center gap-2 md:gap-3 text-[#8F8FFF]">
                        <div className="animate-spin rounded-full h-4 w-4 md:h-6 md:w-6 border-2 border-[#8F8FFF] border-t-transparent"></div>
                        <span className="text-sm md:text-base">
                          Translating with Free API...
                        </span>
                      </div>
                    </div>
                  ) : output ? (
                    safeText(output)
                  ) : (
                    <div className="text-gray-500 h-24 md:h-32 flex items-center justify-center text-center text-sm md:text-base">
                      Translation will appear here
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center mt-3 md:mt-4 pt-3 md:pt-4 border-t border-neutral-800">
                  <div className="text-xs text-gray-500">
                    {output && `${output.length} characters`}
                  </div>
                  <button
                    onClick={translate}
                    disabled={!input.trim() || isTranslating}
                    className="px-4 py-2 md:px-6 md:py-3 bg-[#8F8FFF] text-black font-semibold rounded-xl hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 flex items-center gap-2 text-sm md:text-base"
                  >
                    {isTranslating ? (
                      <>
                        <div className="animate-spin rounded-full h-3 w-3 md:h-4 md:w-4 border-2 border-black border-t-transparent"></div>
                        <span className="hidden sm:inline">Translating...</span>
                        <span className="sm:hidden">...</span>
                      </>
                    ) : (
                      <>
                        <Languages size={16} />
                        <span>Translate</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Translations */}
            {translationHistory.length > 0 && (
              <div className="bg-[#1B1B1B] rounded-2xl border border-neutral-800 p-4 md:p-6">
                <h3 className="text-white font-semibold mb-3 md:mb-4 flex items-center gap-2">
                  <Sparkles size={16} className="text-[#8F8FFF]" />
                  Recent Translations
                  {translationHistory.some((item) => item.isMock) && (
                    <span className="text-xs text-blue-500 ml-2">
                      Some demo translations
                    </span>
                  )}
                </h3>
                <div className="space-y-2 md:space-y-3">
                  {translationHistory.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 p-3 hover:bg-neutral-800 rounded-xl transition-colors duration-200"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-gray-400 text-xs md:text-sm mb-1 truncate">
                          {item.input}
                        </div>
                        <div className="text-white text-xs md:text-sm">
                          {item.output}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 whitespace-nowrap">
                        <span>
                          {getLanguageName(item.sourceLang)} →{" "}
                          {getLanguageName(item.targetLang)}
                        </span>
                        {item.isMock && (
                          <span className="text-blue-500">• Demo</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
