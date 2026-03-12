const Groq = require("groq-sdk");
const fs = require("fs");
const path = require("path");

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

// @desc    Process Voice Command using Groq Whisper and Llama
// @route   POST /api/ai/voice-assistant
exports.processVoiceCommand = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, error: "No audio file provided" });
        }

        const audioPath = req.file.path;

        // 1. STT: Whisper Large V3 with bilingual hinting
        const transcription = await groq.audio.transcriptions.create({
            file: fs.createReadStream(audioPath),
            model: "whisper-large-v3",
            prompt: "User is speaking about 'AI Sante' agricultural marketplace in English or Kannada (ಕನ್ನಡ). Identify terms like 'Tomato' (ಟೊಮೆಟೊ), 'Onion' (ಈರುಳ್ಳಿ), 'Price' (ಬೆಲೆ), 'Market' (ಮಾರುಕಟ್ಟೆ).",
            response_format: "json"
            // Language auto-detection is preferred for bilingual scenarios
        });

        const transcript = transcription.text;
        console.log("Transcript:", transcript);

        // 2. LLM: Llama 3 for Multilingual Intent Extraction
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are the AI Sante Bilingual Voice Assistant. You understand English and Kannada (ಕನ್ನಡ).
                    Analyze the transcript (which might be in Kannada, English, or mixed) and return ONLY a JSON object:
                    - reply: A helpful, concise response in the language the user used (if they asked in Kannada, reply in Kannada script).
                    - action: One of [SEARCH_PRODUCT, NAVIGATE, GET_MARKET_TRENDS, SHOW_HELP, NONE].
                    - target: The specific product or page in ENGLISH (e.g., 'Tomato', '/marketplace').
                    
                    Intents:
                    - Search/Price: action='SEARCH_PRODUCT', target='Crop Name in English'.
                    - Navigation: action='NAVIGATE', target='Route Path'.
                    
                    Examples:
                    - "ಟೊಮೆಟೊ ಬೆಲೆ ಎಷ್ಟು?" -> {"reply": "ಟೊಮೆಟೊ ಬೆಲೆಯನ್ನು ಹುಡುಕಲಾಗುತ್ತಿದೆ...", "action": "SEARCH_PRODUCT", "target": "Tomato"}
                    - "Show me onion prices" -> {"reply": "Searching for onion prices...", "action": "SEARCH_PRODUCT", "target": "Onion"}`
                },

                {
                    role: "user",
                    content: transcript
                }
            ],
            model: "llama3-70b-8192",
            response_format: { type: "json_object" }
        });

        const response = JSON.parse(chatCompletion.choices[0].message.content);

        // Cleanup audio file
        fs.unlinkSync(audioPath);

        res.json({
            success: true,
            transcript,
            ...response
        });

    } catch (error) {
        console.error("AI Assistant Error:", error);
        next(error);
    }
};
