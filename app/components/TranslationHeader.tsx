import { Languages, Menu, Zap, Sparkles, Globe } from "lucide-react";

interface TranslationHeaderProps {
  isMobile: boolean;
  showMobileSidebar: boolean;
  setShowMobileSidebar: (show: boolean) => void;
}

export default function TranslationHeader({ 
  isMobile, 
  showMobileSidebar, 
  setShowMobileSidebar 
}: TranslationHeaderProps) {
  return (
    <>
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

      {/* Main Header */}
      {(!isMobile || !showMobileSidebar) && (
        <div className="text-center mb-6 md:mb-8 lg:mb-12 w-full">
          <div className="flex flex-col items-center justify-center gap-4 mb-6">
            <div className="flex items-center justify-center gap-4">
              <div className="p-3 bg-[#8F8FFF] bg-opacity-20 rounded-2xl shadow-lg">
                <Languages className="text-[#8F8FFF]" size={36} />
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-linear-to-r from-white via-[#8F8FFF] to-gray-300 bg-clip-text text-transparent">
                X-Translate
              </h1>
            </div>

            <p className="text-lg md:text-xl lg:text-2xl text-gray-300 max-w-2xl leading-relaxed">
              Real-time translation powered by{" "}
              <span className="text-[#8F8FFF] font-semibold">Free Translation APIs</span>
            </p>
          </div>

          <div className="flex items-center justify-center gap-4 md:gap-6 mt-4 text-sm md:text-base text-gray-400">
            <div className="flex items-center gap-2 bg-neutral-800 px-3 py-2 rounded-full">
              <Zap size={16} className="text-yellow-500" />
              <span>Fast & Accurate</span>
            </div>
            <div className="flex items-center gap-2 bg-neutral-800 px-3 py-2 rounded-full">
              <Sparkles size={16} className="text-[#8F8FFF]" />
              <span>100% Free</span>
            </div>
            <div className="flex items-center gap-2 bg-neutral-800 px-3 py-2 rounded-full">
              <Globe size={16} className="text-green-500" />
              <span>100+ Languages</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}