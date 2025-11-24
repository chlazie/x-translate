import { AlertCircle, RefreshCw } from "lucide-react";

interface StatusIndicatorsProps {
  translationSource: "free" | "mock" | null;
  apiError: string | null;
  onRetry: () => void;
  onClearError: () => void;
}

export default function StatusIndicators({ 
  translationSource, 
  apiError, 
  onRetry, 
  onClearError 
}: StatusIndicatorsProps) {
  return (
    <>
      {translationSource === "free" && (
        <div className="w-full max-w-4xl mb-4">
          <div className="bg-green-500 bg-opacity-20 border border-green-500 border-opacity-30 rounded-xl p-3 text-center">
            <p className="text-green-200 text-sm">
              🌐 <strong>Free Translation API</strong> - Using LibreTranslate for real translations
            </p>
          </div>
        </div>
      )}

      {translationSource === "mock" && !apiError && (
        <div className="w-full max-w-4xl mb-4">
          <div className="bg-blue-500 bg-opacity-20 border border-blue-500 border-opacity-30 rounded-xl p-3 text-center">
            <p className="text-blue-200 text-sm">
              ⚡ <strong>Demo Mode</strong> - Using mock translations (Free APIs temporarily unavailable)
            </p>
          </div>
        </div>
      )}

      {apiError && (
        <div className="w-full max-w-4xl mb-4">
          <div className="bg-red-500 bg-opacity-20 border border-red-500 border-opacity-30 rounded-xl p-3 flex items-center gap-3">
            <AlertCircle size={20} className="text-red-500 shrink-0" />
            <div className="flex-1">
              <p className="text-red-200 text-sm">{apiError}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={onRetry}
                className="p-1 hover:bg-red-600 rounded transition-colors"
                title="Retry translation"
              >
                <RefreshCw size={16} className="text-red-200" />
              </button>
              <button
                onClick={onClearError}
                className="text-red-200 hover:text-white transition-colors text-lg"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}