import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, X, Brain, Send, Navigation, Search, MessageSquare, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import { VoicePoweredOrb } from './ui/voice-powered-orb';

const GlobalAIAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [muttering, setMuttering] = useState("");
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [voiceDetected, setVoiceDetected] = useState(false);
    
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const recognitionRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    // Auto-close on location change or when closing modal
    useEffect(() => {
        if (!isOpen && isRecording) {
            stopRecording();
        }
    }, [isOpen]);

    useEffect(() => {
        setIsOpen(false);
        stopRecording();
    }, [location.pathname]);

    const startRecording = async () => {
        if (loading) return;
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };

            mediaRecorderRef.current.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                stream.getTracks().forEach(track => track.stop()); // Explicitly stop the local stream
                await sendAudioToAI(audioBlob);
            };

            // Setup real-time muttering
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognition) {
                try {
                    if (recognitionRef.current) recognitionRef.current.stop();
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
                } catch (recErr) {
                    console.warn("Speech recognition busy:", recErr);
                }
            }

            mediaRecorderRef.current.start();
            setIsRecording(true);
            setResponse(null);
            setTranscript('');
            setMuttering("");
        } catch (err) {
            console.error("Error accessing microphone:", err);
            alert("Microphone access denied or not supported.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
        }
        setIsRecording(false);
        if (recognitionRef.current) {
            try {
                recognitionRef.current.stop();
            } catch (e) {}
        }
    };

    const sendAudioToAI = async (blob) => {
        setLoading(true);
        const formData = new FormData();
        formData.append('audio', blob);

        try {
            const res = await axios.post('/api/ai/voice-assistant', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const data = res.data;
            setTranscript(data.transcript);
            setResponse(data);

            // Execute Actions with delay
            if (data.action === 'NAVIGATE' && data.target) {
                setTimeout(() => {
                    navigate(data.target);
                    setIsOpen(false);
                }, 2000);
            } else if (data.action === 'SEARCH_PRODUCT' && data.target) {
                setTimeout(() => {
                    navigate(`/marketplace?search=${encodeURIComponent(data.target)}`);
                    setIsOpen(false);
                }, 2000);
            }

        } catch (err) {
            console.error("AI Assistant Error:", err);
            setResponse({ reply: "Sorry, I encountered an error processing your request." });
        } finally {
            setLoading(false);
            setMuttering("");
        }
    };

    return (
        <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-4 font-sans">
            {/* Chat Bubble */}
            {isOpen && (
                <div className="bg-white/95 backdrop-blur-3xl border border-zinc-200 shadow-2xl rounded-[3rem] w-80 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500 ring-1 ring-zinc-200/50">
                    <div className="p-6 space-y-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-zinc-950 rounded-2xl shadow-lg ring-1 ring-white/10">
                                    <Brain className="w-4 h-4 text-white" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-black text-zinc-900 text-sm tracking-tight leading-none uppercase">AI Neural Core</span>
                                    <div className="flex items-center gap-1 mt-1">
                                        <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                                        <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest leading-none">Status: Ready</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-zinc-100 rounded-full transition-colors group">
                                <X className="w-4 h-4 text-zinc-400 group-hover:rotate-90 transition-transform duration-300" />
                            </button>
                        </div>

                        <div className="min-h-[160px] flex flex-col justify-center items-center text-center px-4 py-6 relative">
                            {loading ? (
                                <div className="space-y-6 w-full flex flex-col items-center">
                                    <div className="w-20 h-20 relative flex items-center justify-center">
                                        <div className="absolute inset-0 border-4 border-blue-500/10 rounded-full" />
                                        <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                        <Brain className="w-8 h-8 text-blue-500 animate-pulse" />
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] animate-pulse">Analyzing Neural Patterns</p>
                                        <p className="text-xs text-zinc-400 font-medium italic">"{transcript || "Computing..."}"</p>
                                    </div>
                                </div>
                            ) : isRecording ? (
                                <div className="space-y-6 w-full flex flex-col items-center">
                                    <div className="w-28 h-28 relative">
                                        <VoicePoweredOrb 
                                            enableVoiceControl={true} 
                                            hue={210} 
                                            className="w-full h-full" 
                                            onVoiceDetected={setVoiceDetected}
                                        />
                                        {voiceDetected && (
                                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping" />
                                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping delay-75" />
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="space-y-2 w-full">
                                        <div className="flex items-center justify-center gap-1.5 text-[9px] font-black text-zinc-400 uppercase tracking-widest opacity-60">
                                            <MessageSquare className="w-3 h-3 text-blue-500" />
                                            <span>Muttering Stream</span>
                                        </div>
                                        <p className="text-sm font-bold text-zinc-900 italic line-clamp-2 min-h-[1.25rem] leading-snug">
                                            {muttering || "Listening for command..."}
                                        </p>
                                    </div>
                                </div>
                            ) : response ? (
                                <div className="space-y-4 animate-in fade-in zoom-in duration-300 w-full text-left">
                                    {transcript && (
                                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Input: <span className="text-zinc-500 italic font-medium">"{transcript}"</span></p>
                                    )}
                                    <div className="bg-zinc-900 text-zinc-100 p-5 rounded-[2rem] shadow-xl relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-150 transition-transform">
                                            <Brain className="w-12 h-12" />
                                        </div>
                                        <p className="text-[13px] font-medium leading-relaxed relative z-10">
                                            {response.reply}
                                        </p>
                                    </div>
                                    {response.action !== 'NONE' && (
                                        <div className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.1em] shadow-lg shadow-blue-200 animate-in slide-in-from-left-4">
                                            <Loader2 className="w-3 h-3 animate-spin" />
                                            Targeting: {response.target}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto">
                                        <Brain className="w-8 h-8 text-blue-600" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-zinc-900 font-black uppercase tracking-tight">Sync Established</p>
                                        <p className="text-xs text-zinc-500 font-medium px-4">
                                            Ready to assist with marketplace navigation and inquiries.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            disabled={loading}
                            onClick={isRecording ? stopRecording : startRecording}
                            className={cn(
                                "w-full py-5 rounded-[2rem] font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 transition-all duration-500 transform active:scale-95 group relative overflow-hidden",
                                isRecording 
                                    ? "bg-red-600 text-white shadow-2xl shadow-red-200" 
                                    : "bg-zinc-950 text-white hover:bg-zinc-900 shadow-2xl shadow-zinc-300 disabled:opacity-50"
                            )}
                        >
                            {isRecording ? (
                                <>
                                    <MicOff className="w-4 h-4" />
                                    <span>Sever Neural Link</span>
                                </>
                            ) : loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Processing Node</span>
                                </>
                            ) : (
                                <>
                                    <Mic className="w-4 h-4 group-hover:animate-bounce" />
                                    <span>Initialize Sync</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}

            {/* FAB */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 hover:scale-110 active:scale-95 group relative overflow-hidden",
                    isOpen ? "bg-white ring-1 ring-zinc-200" : "bg-zinc-950"
                )}
            >
                <div className={cn(
                    "absolute inset-0 bg-gradient-to-tr from-blue-600 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                    !isOpen && "opacity-20"
                )} />
                {isOpen ? (
                    <X className="w-6 h-6 text-zinc-900 relative z-10" />
                ) : (
                    <>
                        <Brain className="w-7 h-7 text-white group-hover:animate-pulse relative z-10" />
                        <div className="absolute top-3 right-3 w-3 h-3 bg-emerald-500 border-2 border-zinc-950 rounded-full z-20 animate-pulse" />
                    </>
                )}
            </button>
        </div>
    );
};

export default GlobalAIAssistant;


