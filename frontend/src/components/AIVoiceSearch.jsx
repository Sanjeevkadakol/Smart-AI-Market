import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Loader2, MessageSquare } from 'lucide-react';
import axios from 'axios';
import { cn } from '../lib/utils';
import { VoicePoweredOrb } from './ui/voice-powered-orb';

const AIVoiceSearch = ({ onResult, className }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [loading, setLoading] = useState(false);
    const [muttering, setMuttering] = useState("");
    const [voiceDetected, setVoiceDetected] = useState(false);
    
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const recognitionRef = useRef(null);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };

            mediaRecorderRef.current.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                await processVoice(audioBlob);
            };

            // Setup real-time muttering
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognition) {
                recognitionRef.current = new SpeechRecognition();
                recognitionRef.current.continuous = true;
                recognitionRef.current.interimResults = true;
                recognitionRef.current.onresult = (event) => {
                    let interim = "";
                    for (let i = event.resultIndex; i < event.results.length; ++i) {
                        if (!event.results[i].isFinal) interim += event.results[i][0].transcript;
                    }
                    setMuttering(interim);
                };
                recognitionRef.current.start();
            }

            mediaRecorderRef.current.start();
            setIsRecording(true);
            setMuttering("");
        } catch (err) {
            console.error("Mic access error:", err);
            alert("Please enable microphone access.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
    };

    const processVoice = async (blob) => {
        setLoading(true);
        const formData = new FormData();
        formData.append('audio', blob);

        try {
            const res = await axios.post('/api/ai/voice-assistant', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const resultText = res.data.target || res.data.transcript;
            if (resultText) onResult(resultText);
        } catch (err) {
            console.error("Voice processing error:", err);
        } finally {
            setLoading(false);
            setMuttering("");
        }
    };

    return (
        <div className="relative">
            <button
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                className={cn(
                    "p-2 rounded-xl transition-all duration-300 relative group z-50",
                    isRecording ? "bg-red-500 text-white shadow-lg shadow-red-200" : "bg-zinc-100 text-zinc-400 hover:bg-zinc-200 hover:text-zinc-600",
                    className
                )}
            >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {isRecording && (
                <div className="absolute top-full right-0 mt-4 w-64 bg-white/90 backdrop-blur-2xl border border-zinc-100 shadow-2xl rounded-[2rem] p-6 z-[60] animate-in fade-in zoom-in slide-in-from-top-4 duration-300 flex flex-col items-center space-y-4">
                    <div className="w-24 h-24 relative">
                        <VoicePoweredOrb 
                            enableVoiceControl={true} 
                            hue={200} 
                            className="w-full h-full" 
                            onVoiceDetected={setVoiceDetected}
                        />
                        {voiceDetected && (
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                        )}
                    </div>
                    
                    <div className="text-center space-y-2 w-full">
                        <div className="flex items-center justify-center gap-1.5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                            <MessageSquare className="w-3 h-3 text-blue-500" />
                            <span>Listening</span>
                        </div>
                        <p className="text-sm font-bold text-zinc-900 italic line-clamp-2 min-h-[1.25rem]">
                            {muttering || "Syncing..."}
                        </p>
                    </div>

                    <div className="flex gap-0.5 w-full justify-center">
                        {[...Array(20)].map((_, i) => (
                            <div 
                                key={i} 
                                className={cn("w-1 rounded-full transition-all duration-300", voiceDetected ? "bg-blue-400" : "bg-zinc-100 h-1")} 
                                style={{ height: voiceDetected ? `${Math.random() * 20 + 2}px` : '4px' }} 
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AIVoiceSearch;

