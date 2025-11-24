"use client";
import { useState, useRef, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { Mic, Volume2, Play, Square, Download, Menu } from "lucide-react";

export default function AudioPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioBlob(audioBlob);
        setAudioUrl(audioUrl);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Error accessing microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const downloadAudio = () => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'recording.wav';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.onended = () => setIsPlaying(false);
    }
  }, [audioUrl]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0F0F0F] to-[#1A1A1A] relative">
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
              <Mic className="text-[#8F8FFF]" size={28} />
              <h1 className="text-xl font-bold text-white">Audio Translation</h1>
            </div>
            <div className="w-10"></div>
          </div>
        )}

        {/* Audio Content */}
        <div className="max-w-4xl mx-auto w-full">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="p-4 bg-[#8F8FFF] bg-opacity-20 rounded-2xl">
                <Mic className="text-[#8F8FFF]" size={40} />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-[#8F8FFF] bg-clip-text text-transparent">
                Audio Translation
              </h1>
            </div>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Record audio and get instant translations
            </p>
          </div>

          {/* Rest of your audio recording UI remains the same */}
          <div className="bg-[#1B1B1B] rounded-2xl border border-neutral-800 p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Mic size={24} className="text-[#8F8FFF]" />
              Record Audio
            </h2>
            
            <div className="flex flex-col items-center gap-6">
              {/* Recording Controls */}
              <div className="flex items-center gap-4">
                {!isRecording ? (
                  <button
                    onClick={startRecording}
                    className="flex items-center gap-2 px-8 py-4 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-all duration-200"
                  >
                    <Mic size={20} />
                    Start Recording
                  </button>
                ) : (
                  <button
                    onClick={stopRecording}
                    className="flex items-center gap-2 px-8 py-4 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-semibold transition-all duration-200"
                  >
                    <Square size={20} />
                    Stop Recording
                  </button>
                )}
              </div>

              {/* Recording Status */}
              <div className="text-center">
                {isRecording && (
                  <div className="flex items-center gap-2 text-red-400">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span>Recording...</span>
                  </div>
                )}
              </div>

              {/* Audio Playback */}
              {audioUrl && (
                <div className="w-full max-w-md">
                  <div className="bg-neutral-800 rounded-xl p-6">
                    <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                      <Volume2 size={20} className="text-[#8F8FFF]" />
                      Recorded Audio
                    </h3>
                    
                    <audio ref={audioRef} src={audioUrl} className="w-full mb-4" />
                    
                    <div className="flex items-center gap-3">
                      {!isPlaying ? (
                        <button
                          onClick={playAudio}
                          className="flex items-center gap-2 px-4 py-2 bg-[#8F8FFF] text-black rounded-lg font-medium transition-all duration-200"
                        >
                          <Play size={16} />
                          Play
                        </button>
                      ) : (
                        <button
                          onClick={stopAudio}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg font-medium transition-all duration-200"
                        >
                          <Square size={16} />
                          Stop
                        </button>
                      )}
                      
                      <button
                        onClick={downloadAudio}
                        className="flex items-center gap-2 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg font-medium transition-all duration-200"
                      >
                        <Download size={16} />
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Translation Result */}
          {audioUrl && (
            <div className="bg-[#1B1B1B] rounded-2xl border border-neutral-800 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Translation Result</h2>
              <div className="bg-neutral-800 rounded-xl p-6">
                <p className="text-gray-400 italic">
                  Audio translation feature coming soon. Currently recording audio works, 
                  translation will be added in the next update.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}