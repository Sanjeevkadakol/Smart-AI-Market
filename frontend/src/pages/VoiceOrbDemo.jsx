import React, { useState, useEffect } from "react";
import { VoicePoweredOrb } from "../components/ui/voice-powered-orb";
import { Button } from "../components/ui/button";
import { Mic, MicOff, Brain, MessageSquareQuote } from "lucide-react";
import { cn } from "../lib/utils";

export default function VoiceOrbDemo() {
  const [isRecording, setIsRecording] = useState(false);
  const [voiceDetected, setVoiceDetected] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [muttering, setMuttering] = useState("");

  useEffect(() => {
    let recognition;
    if (isRecording) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-IN'; // Dual lang or auto would be better, but sticking to basics

        recognition.onresult = (event) => {
          let interimTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              setTranscript(prev => prev + " " + event.results[i][0].transcript);
              setMuttering("");
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }
          setMuttering(interimTranscript);
        };

        recognition.start();
      }
    }
    return () => {
      if (recognition) recognition.stop();
    };
  }, [isRecording]);

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-8 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.05),transparent)] pointer-events-none" />
      
      <div className="flex flex-col items-center space-y-12 max-w-2xl w-full z-10">
        
        {/* Title */}
        <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-emerald-600 font-black uppercase tracking-widest text-[10px]">
                <Brain className="w-4 h-4" />
                <span>AI Neural Sensory Interface</span>
            </div>
            <h1 className="text-4xl font-black text-zinc-900 tracking-tight">AI <span className="text-emerald-500">Santhe</span> Voice</h1>
            <p className="text-zinc-400 font-medium text-sm">Speak naturally to interact with the marketplace intelligence.</p>
        </div>

        {/* Orb Container */}
        <div className="relative w-80 h-80 group">
          <div className="absolute inset-0 bg-emerald-500/10 blur-[100px] rounded-full scale-150 animate-pulse" />
          <div className="absolute -inset-4 border-2 border-emerald-500/5 rounded-full animate-[spin_20s_linear_infinite]" />
          <div className="absolute -inset-8 border border-emerald-500/5 rounded-full animate-[spin_30s_linear_infinite_reverse]" />
          
          <div className="w-full h-full relative z-10 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 shadow-2xl overflow-hidden ring-1 ring-zinc-100">
            <VoicePoweredOrb
              enableVoiceControl={isRecording}
              hue={140} // Emerald/Green hue
              className="w-full h-full"
              onVoiceDetected={setVoiceDetected}
            />
          </div>

          {/* Detecting Feedback */}
          {voiceDetected && isRecording && (
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-zinc-900 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2 animate-bounce">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                    Voice Active
                </div>
          )}
        </div>

        {/* Real-time Muttering Display */}
        <div className="w-full space-y-4">
             <div className={cn(
                 "min-h-[120px] w-full p-8 rounded-[2.5rem] border border-zinc-100 transition-all duration-500 shadow-sm flex flex-col items-center justify-center text-center",
                 isRecording ? "bg-white shadow-xl shadow-emerald-100/50 border-emerald-100" : "bg-zinc-50/50"
             )}>
                {!isRecording && !transcript && (
                    <div className="text-zinc-300 italic text-sm font-medium flex items-center gap-2">
                        <MessageSquareQuote className="w-4 h-4" />
                        Awaiting neural sync...
                    </div>
                )}
                
                {transcript && (
                    <p className="text-zinc-500 text-sm font-medium leading-relaxed italic mb-2">
                        {transcript}
                    </p>
                )}

                {muttering && (
                    <p className="text-emerald-600 text-xl font-bold italic tracking-tight animate-in fade-in slide-in-from-bottom-2">
                        {muttering}...
                    </p>
                )}
             </div>

             {/* Control */}
             <div className="flex justify-center pt-4">
                <Button
                    onClick={() => setIsRecording(!isRecording)}
                    variant={isRecording ? "destructive" : "default"}
                    size="lg"
                    className={cn(
                        "rounded-full px-12 py-8 text-lg font-bold shadow-2xl transition-all active:scale-95 group",
                        !isRecording && "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200"
                    )}
                >
                    {isRecording ? (
                        <>
                        <MicOff className="w-6 h-6 mr-3" />
                        Neural Link Active
                        </>
                    ) : (
                        <>
                        <Mic className="w-6 h-6 mr-3 group-hover:animate-bounce" />
                        Initiate Neural Sync
                        </>
                    )}
                </Button>
             </div>
        </div>

        {/* Feedback Bar */}
        <div className="flex gap-1">
            {[...Array(50)].map((_, i) => (
                <div 
                    key={i} 
                    className={cn(
                        "w-1 bg-zinc-100 rounded-full transition-all duration-300",
                        isRecording && voiceDetected ? "bg-emerald-400" : "h-1"
                    )} 
                    style={{ 
                        height: isRecording && voiceDetected ? `${Math.random() * 40 + 5}px` : '4px',
                        opacity: isRecording ? 1 : 0.2
                    }} 
                />
            ))}
        </div>

      </div>
    </div>
  );
}
