const Groq = require("groq-sdk");
const fs = require("fs");
const path = require("path");

exports.processVoiceCommand = async (req, res, next) => {
    try {
        console.log("--- Voice Assistant Request Start ---");
        if (!req.file) {
            console.error("No audio file in request");
            return res.status(400).json({ success: false, error: "No audio file provided" });
        }

        const audioPath = req.file.path;
        console.log("Audio file received at:", audioPath);

        const apiKey = process.env.VOICE_ASSISTANT_GROQ_KEY;
        if (!apiKey) {
            throw new Error("VOICE_ASSISTANT_GROQ_KEY is not defined in environment variables");
        }

        const groq = new Groq({ apiKey });

        // 1. STT: Whisper Large V3
        console.log("Starting STT with whisper-large-v3...");
        const transcription = await groq.audio.transcriptions.create({
            file: fs.createReadStream(audioPath),
            model: "whisper-large-v3",
            response_format: "json"
        });

        const transcript = transcription.text;
        console.log("Transcript successful:", transcript);

        // 2. LLM: Llama 3 for Intent Extraction
        console.log("Starting LLM intent extraction...");
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are a helpful farming assistant for Smart Digital Santhe.
                    Analyze the user input and return ONLY a JSON object:
                    - reply: A helpful, concise response.
                    - action: One of [SEARCH_PRODUCT, NAVIGATE, GET_MARKET_TRENDS, SHOW_HELP, NONE].
                    - target: The specific product or page in ENGLISH (e.g., 'Tomato', '/marketplace').
                    IMPORTANT: For action=NAVIGATE, only return a relative path like '/heatmap', NEVER a full URL.`
                },
                {
                    role: "user",
                    content: transcript
                }
            ],
            model: "llama-3.1-8b-instant",
            response_format: { type: "json_object" }
        });

        const aiResponse = JSON.parse(chatCompletion.choices[0].message.content);
        console.log("AI Response successful:", aiResponse);

        // Cleanup audio file
        try {
            fs.unlinkSync(audioPath);
            console.log("Audio file cleaned up");
        } catch (unlinkErr) {
            console.error("Failed to cleanup audio file:", unlinkErr.message);
        }

        console.log("--- Voice Assistant Request Completed Successfully ---");
        res.json({
            success: true,
            transcript,
            ...aiResponse
        });

    } catch (error) {
        console.error("AI Assistant Error:", {
            message: error.message,
            stack: error.stack,
            response: error.response?.data,
            timestamp: new Date().toISOString()
        });
        next(error);
    }
};
