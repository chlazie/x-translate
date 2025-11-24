"use client";
import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import TranslationHeader from "./components/TranslationHeader";
import LanguageSelector from "./components/LanguageSelector";
import TranslationBoxes from "./components/TranslationBoxes";
import RecentTranslations from "./components/RecentTranslations";
import StatusIndicators from "./components/StatusIndicators";

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
  const [translationHistory, setTranslationHistory] = useState<TranslationHistoryItem[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [translationSource, setTranslationSource] = useState<"free" | "mock" | null>(null);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  async function translate() {
    if (!input.trim()) return;

    setIsTranslating(true);
    setApiError(null);
    setTranslationSource(null);

    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input, from: sourceLang, to: targetLang }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      const translatedText = data[0].translations[0].text;
      setOutput(translatedText);

      // Determine translation source
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
      saveToHistory(input, translatedText, sourceLang, targetLang);
    } catch (error) {
      console.error("Translation error:", error);
      const errorMessage = error instanceof Error ? error.message : "Translation failed";
      setApiError(errorMessage);
      setOutput("❌ Translation failed. Please try again.");
      setTranslationSource("mock");
    } finally {
      setIsTranslating(false);
    }
  }

  const saveToHistory = (input: string, output: string, sourceLang: string, targetLang: string) => {
    const historyItem = {
      id: Date.now().toString(),
      title: input.slice(0, 30) + (input.length > 30 ? "..." : ""),
      preview: output.slice(0, 50) + (output.length > 50 ? "..." : ""),
      timestamp: new Date().toLocaleTimeString(),
      date: new Date().toLocaleDateString(),
      sourceLang,
      targetLang,
      input,
      output,
    };

    const existingHistory = JSON.parse(localStorage.getItem("translationHistory") || "[]");
    const newHistory = [historyItem, ...existingHistory.slice(0, 19)];
    localStorage.setItem("translationHistory", JSON.stringify(newHistory));
  };

  const swapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setInput(output);
    setOutput(input);
  };

  const clearError = () => setApiError(null);
  const retryTranslation = () => input.trim() && translate();

  return (
    <div className="flex min-h-screen bg-linear-to-br from-[#0F0F0F] to-[#1A1A1A] relative">
      {/* Mobile Sidebar Overlay */}
      {isMobile && showMobileSidebar && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setShowMobileSidebar(false)}
        />
      )}

      {/* Sidebar - FIXED POSITION */}
      <div className={`
        fixed left-0 top-0 h-screen z-30
        ${isMobile ? "transform transition-transform duration-300" : ""}
        ${isMobile && !showMobileSidebar ? "-translate-x-full" : "translate-x-0"}
      `}>
        <Sidebar />
      </div>

      {/* Main Content with offset for sidebar */}
      <main className="flex-1 flex flex-col items-center p-4 md:p-6 lg:p-8 transition-all duration-300 w-full ml-0 md:ml-20 lg:ml-64">
        <TranslationHeader 
          isMobile={isMobile}
          showMobileSidebar={showMobileSidebar}
          setShowMobileSidebar={setShowMobileSidebar}
        />

        <StatusIndicators 
          translationSource={translationSource}
          apiError={apiError}
          onRetry={retryTranslation}
          onClearError={clearError}
        />

        <div className="w-full max-w-4xl space-y-4 md:space-y-6">
          <LanguageSelector
            sourceLang={sourceLang}
            targetLang={targetLang}
            onSourceLangChange={setSourceLang}
            onTargetLangChange={setTargetLang}
            onSwapLanguages={swapLanguages}
          />

          <TranslationBoxes
            input={input}
            output={output}
            isTranslating={isTranslating}
            sourceLang={sourceLang}
            targetLang={targetLang}
            onInputChange={setInput}
            onTranslate={translate}
            onCopy={() => navigator.clipboard.writeText(output)}
            onSpeakInput={(text) => {
              if (!text || !("speechSynthesis" in window)) return;
              const utterance = new SpeechSynthesisUtterance(text);
              utterance.lang = sourceLang === "en" ? "en-US" : sourceLang;
              utterance.rate = 0.8;
              speechSynthesis.speak(utterance);
            }}
            onSpeakOutput={(text) => {
              if (!text || !("speechSynthesis" in window)) return;
              const utterance = new SpeechSynthesisUtterance(text);
              utterance.lang = targetLang === "en" ? "en-US" : targetLang;
              utterance.rate = 0.8;
              speechSynthesis.speak(utterance);
            }}
          />

          <RecentTranslations translationHistory={translationHistory} />
        </div>
      </main>
    </div>
  );
}