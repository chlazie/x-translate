"use client";
import { useState, useEffect, useRef } from "react";
import { Volume2, Copy, Check, Languages } from "lucide-react";

interface TranslationBoxesProps {
  input: string;
  output: string;
  isTranslating: boolean;
  sourceLang: string;
  targetLang: string;
  onInputChange: (value: string) => void;
  onTranslate: () => void;
  onCopy: () => void;
  onSpeakInput: (text: string) => void;
  onSpeakOutput: (text: string) => void;
}

export default function TranslationBoxes({
  input,
  output,
  isTranslating,
  sourceLang,
  targetLang,
  onInputChange,
  onTranslate,
  onCopy,
  onSpeakInput,
  onSpeakOutput,
}: TranslationBoxesProps) {
  const [copied, setCopied] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [input]);

  // Update character count
  useEffect(() => {
    setCharCount(input.length);
  }, [input]);

  const handleCopy = async () => {
    await onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      onTranslate();
    }
  };

  const safeText = (text: string) => {
    return text.replace(/<[^>]*>/g, "");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
      {/* Input Box */}
      <div className="bg-[#1B1B1B] rounded-2xl border border-neutral-800 p-4 md:p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-3 md:mb-4">
          <label className="text-gray-400 text-xs md:text-sm font-medium">Source Text</label>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">{charCount}/5000</span>
            <button
              onClick={() => onInputChange("")}
              className="text-xs text-gray-500 hover:text-white transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Enter text to translate... (Ctrl + Enter to translate)"
          className="w-full min-h-[120px] md:min-h-[150px] bg-transparent text-white placeholder-gray-500 resize-none focus:outline-none leading-relaxed text-base md:text-lg"
          maxLength={5000}
          rows={4}
        />

        <div className="flex justify-between items-center mt-3 md:mt-4 pt-3 md:pt-4 border-t border-neutral-800">
          <button
            onClick={() => onSpeakInput(input)}
            disabled={!input}
            className="p-1 md:p-2 hover:bg-neutral-800 rounded-xl transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Listen"
          >
            <Volume2 size={16} className="text-gray-400" />
          </button>

          <div className="text-xs text-gray-500 hidden sm:block">
            Press <kbd className="px-1 py-0.5 bg-neutral-800 rounded text-xs">Ctrl</kbd> +{" "}
            <kbd className="px-1 py-0.5 bg-neutral-800 rounded text-xs">Enter</kbd> to translate
          </div>
        </div>
      </div>

      {/* Output Box */}
      <div className="bg-[#1B1B1B] rounded-2xl border border-neutral-800 p-4 md:p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-3 md:mb-4">
          <label className="text-gray-400 text-xs md:text-sm font-medium">Translation</label>
          <div className="flex items-center gap-2">
            {output && (
              <>
                <button
                  onClick={handleCopy}
                  className="p-1 md:p-2 hover:bg-neutral-800 rounded-xl transition-all duration-200"
                  title="Copy translation"
                >
                  {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} className="text-gray-400" />}
                </button>
                <button
                  onClick={() => onSpeakOutput(output)}
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
                <span className="text-sm md:text-base">Translating with Free API...</span>
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
            onClick={onTranslate}
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
  );
}