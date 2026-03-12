import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Languages } from 'lucide-react';
import { cn } from '../../lib/utils';

export function VoiceInput({ onTranscript, className }) {
    const [isListening, setIsListening] = useState(false);
    const [lang, setLang] = useState('kn-IN'); // Default Kannada
    const [transcript, setTranscript] = useState('');

    const startListening = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert('Your browser does not support Speech Recognition.');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = lang;
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
            setIsListening(true);
        };

        recognition.onresult = (event) => {
            const current = event.resultIndex;
            const text = event.results[current][0].transcript;
            setTranscript(text);
            onTranscript?.(text);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.start();
    };

    return (
        <div className={cn("flex flex-col items-center gap-4 p-6 bg-white/50 backdrop-blur-md rounded-3xl border border-zinc-100 shadow-xl", className)}>
            <div className="flex items-center gap-4 mb-2">
                <button
                    onClick={() => setLang('kn-IN')}
                    className={cn("px-4 py-1.5 rounded-full text-xs font-bold transition-all", lang === 'kn-IN' ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-400")}
                >
                    ಕನ್ನಡ
                </button>
                <button
                    onClick={() => setLang('hi-IN')}
                    className={cn("px-4 py-1.5 rounded-full text-xs font-bold transition-all", lang === 'hi-IN' ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-400")}
                >
                    हिंदी
                </button>
                <button
                    onClick={() => setLang('en-IN')}
                    className={cn("px-4 py-1.5 rounded-full text-xs font-bold transition-all", lang === 'en-IN' ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-400")}
                >
                    English
                </button>
            </div>

            <button
                onClick={startListening}
                className={cn(
                    "w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500",
                    isListening ? "bg-red-500 animate-pulse scale-110 shadow-lg shadow-red-200" : "bg-zinc-900 text-white hover:scale-105"
                )}
            >
                {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </button>

            <div className="text-center space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 italic">
                    {isListening ? "Listening..." : "Click mic to speak"}
                </p>
                {transcript && (
                    <p className="text-sm font-medium text-zinc-900 bg-white px-4 py-2 rounded-xl border border-zinc-100 italic">
                        "{transcript}"
                    </p>
                )}
            </div>
        </div>
    );
}
