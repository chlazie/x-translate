import { Globe, ArrowRightLeft } from "lucide-react";

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

interface LanguageSelectorProps {
  sourceLang: string;
  targetLang: string;
  onSourceLangChange: (lang: string) => void;
  onTargetLangChange: (lang: string) => void;
  onSwapLanguages: () => void;
}

export default function LanguageSelector({
  sourceLang,
  targetLang,
  onSourceLangChange,
  onTargetLangChange,
  onSwapLanguages,
}: LanguageSelectorProps) {
  const getLanguageName = (code: string) => {
    return LANGUAGES.find((lang) => lang.code === code)?.name || code.toUpperCase();
  };

  const getLanguageFlag = (code: string) => {
    return LANGUAGES.find((lang) => lang.code === code)?.flag || "🌐";
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between bg-[#1B1B1B] p-3 md:p-4 rounded-2xl border border-neutral-800 gap-3 md:gap-0">
      <div className="flex items-center justify-between md:justify-start gap-2 md:gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xl md:text-2xl">{getLanguageFlag(sourceLang)}</span>
          <span className="text-white font-medium text-sm md:text-base">
            {getLanguageName(sourceLang)}
          </span>
        </div>

        <button
          onClick={onSwapLanguages}
          className="p-1 md:p-2 hover:bg-neutral-800 rounded-xl transition-all duration-200 hover:scale-110"
          title="Swap languages"
        >
          <ArrowRightLeft size={16} className="text-gray-400" />
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xl md:text-2xl">{getLanguageFlag(targetLang)}</span>
          <span className="text-white font-medium text-sm md:text-base">
            {getLanguageName(targetLang)}
          </span>
        </div>
      </div>

      <div className="relative w-full md:w-auto">
        <select
          value={targetLang}
          onChange={(e) => onTargetLangChange(e.target.value)}
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
  );
}