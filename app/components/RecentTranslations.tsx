import { Sparkles } from "lucide-react";

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

interface RecentTranslationsProps {
  translationHistory: TranslationHistoryItem[];
}

export default function RecentTranslations({ translationHistory }: RecentTranslationsProps) {
  const getLanguageName = (code: string) => {
    return LANGUAGES.find((lang) => lang.code === code)?.name || code.toUpperCase();
  };

  if (translationHistory.length === 0) return null;

  return (
    <div className="bg-[#1B1B1B] rounded-2xl border border-neutral-800 p-4 md:p-6">
      <h3 className="text-white font-semibold mb-3 md:mb-4 flex items-center gap-2">
        <Sparkles size={16} className="text-[#8F8FFF]" />
        Recent Translations
        {translationHistory.some((item) => item.isMock) && (
          <span className="text-xs text-blue-500 ml-2">Some demo translations</span>
        )}
      </h3>
      <div className="space-y-2 md:space-y-3">
        {translationHistory.map((item) => (
          <div
            key={item.id}
            className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 p-3 hover:bg-neutral-800 rounded-xl transition-colors duration-200"
          >
            <div className="flex-1 min-w-0">
              <div className="text-gray-400 text-xs md:text-sm mb-1 truncate">{item.input}</div>
              <div className="text-white text-xs md:text-sm">{item.output}</div>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 whitespace-nowrap">
              <span>
                {getLanguageName(item.sourceLang)} → {getLanguageName(item.targetLang)}
              </span>
              {item.isMock && <span className="text-blue-500">• Demo</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}