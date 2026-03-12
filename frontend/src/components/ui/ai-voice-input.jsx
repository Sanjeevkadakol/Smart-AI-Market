"use client";

import React, { useState, useEffect } from "react";
import { Mic } from "lucide-react";
import { cn } from "../../lib/utils";

export function AIVoiceInput({
    onStart,
    onStop,
    visualizerBars = 48,
    demoMode = false,
    demoInterval = 3000,
    className
}) {
    const [submitted, setSubmitted] = useState(false);
    const [time, setTime] = useState(0);
    const [isClient, setIsClient] = useState(false);
    const [isDemo, setIsDemo] = useState(demoMode);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        let intervalId;

        if (submitted) {
            onStart?.();
            intervalId = setInterval(() => {
                setTime((t) => t + 1);
            }, 1000);
        } else {
            if (time > 0) onStop?.(time);
            setTime(0);
        }

        return () => clearInterval(intervalId);
    }, [submitted]);

    useEffect(() => {
        if (!isDemo) return;

        let timeoutId;
        const runAnimation = () => {
            setSubmitted(true);
            timeoutId = setTimeout(() => {
                setSubmitted(false);
                timeoutId = setTimeout(runAnimation, 1000);
            }, demoInterval);
        };

        const initialTimeout = setTimeout(runAnimation, 100);
        return () => {
            clearTimeout(timeoutId);
            clearTimeout(initialTimeout);
        };
    }, [isDemo, demoInterval]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const handleClick = () => {
        if (isDemo) {
            setIsDemo(false);
            setSubmitted(false);
        } else {
            setSubmitted((prev) => !prev);
        }
    };

    return (
        <div className={cn("w-full py-4", className)}>
            <div className="relative max-w-xl w-full mx-auto flex items-center flex-col gap-4">
                <button
                    className={cn(
                        "group w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 shadow-lg",
                        submitted
                            ? "bg-blue-600 scale-110 shadow-blue-200"
                            : "bg-white hover:bg-zinc-50 border border-zinc-100 shadow-zinc-200"
                    )}
                    type="button"
                    onClick={handleClick}
                >
                    {submitted ? (
                        <div
                            className="w-8 h-8 rounded-full animate-ping bg-white"
                        />
                    ) : (
                        <Mic className="w-8 h-8 text-zinc-900" />
                    )}
                </button>

                <div className="flex flex-col items-center gap-1">
                    <span
                        className={cn(
                            "font-mono text-lg transition-opacity duration-300",
                            submitted ? "text-blue-600 font-bold" : "text-zinc-300"
                        )}
                    >
                        {formatTime(time)}
                    </span>
                    <p className="text-sm font-medium text-zinc-500 uppercase tracking-widest">
                        {submitted ? "Listening..." : "Click to speak"}
                    </p>
                </div>

                <div className="h-6 w-full max-w-sm flex items-center justify-center gap-1">
                    {[...Array(visualizerBars)].map((_, i) => (
                        <div
                            key={i}
                            className={cn(
                                "w-1 rounded-full transition-all duration-300",
                                submitted
                                    ? "bg-blue-400 animate-pulse"
                                    : "bg-zinc-100 h-1"
                            )}
                            style={
                                submitted && isClient
                                    ? {
                                        height: `${30 + Math.random() * 70}%`,
                                        animationDelay: `${i * 0.05}s`,
                                    }
                                    : undefined
                            }
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
