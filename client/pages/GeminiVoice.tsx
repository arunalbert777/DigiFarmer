import React, { useEffect, useRef, useState } from "react";

export default function GeminiVoice() {
  const [isListening, setIsListening] = useState(false);
  const [status, setStatus] = useState("Click the mic to start speaking.");
  const [language, setLanguage] = useState("en-US");
  const conversationRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.onresult = null;
          recognitionRef.current.onend = null;
          recognitionRef.current.onerror = null;
          recognitionRef.current.stop();
        } catch (e) {}
        recognitionRef.current = null;
      }
    };
  }, []);

  function showMessage(text: string) {
    const el = document.getElementById("messageBox");
    if (!el) return;
    el.textContent = text;
    el.classList.add("show");
    setTimeout(() => el.classList.remove("show"), 2000);
  }

  function addMessage(text: string, sender: "user" | "gemini") {
    const conv = conversationRef.current;
    if (!conv) return;
    const div = document.createElement("div");
    div.textContent = text;
    div.className = `chat-message ${sender === "user" ? "user-message" : "gemini-message"}`;
    conv.appendChild(div);
    conv.scrollTop = conv.scrollHeight;
  }

  function initializeRecognition() {
    const win: any = window as any;
    const SR = win.SpeechRecognition || win.webkitSpeechRecognition;
    if (!SR) {
      showMessage(
        "Speech recognition not supported in this browser. Use Chrome/Edge.",
      );
      return null;
    }
    const rec = new SR();
    recognitionRef.current = rec;
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = language;

    rec.onstart = () => {
      setIsListening(true);
      setStatus("Listening... Speak now.");
    };

    rec.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      // Validate transcript before sending
      if (transcript && transcript.trim().length > 0) {
        addMessage(transcript, "user");
        setStatus("Thinking...");
        getGeminiResponse(transcript);
      } else {
        addMessage("Sorry, I didn't catch that. Please try again.", "gemini");
        speakText("Sorry, I didn't catch that. Please try again.");
        setStatus("Click the mic to start speaking.");
      }
    };

    rec.onerror = (e: any) => {
      console.error("Speech recognition error:", e);
      setStatus(`Error: ${e.error}. Please try again.`);
      setIsListening(false);
    };

    rec.onend = () => {
      setIsListening(false);
      setStatus("Click the mic to start speaking.");
    };

    return rec;
  }

  async function fetchWithRetry(
    url: string,
    options: any,
    retries = 3,
    delay = 1000,
  ) {
    for (let i = 0; i < retries; i++) {
      try {
        const res = await fetch(url, options);
        if (res.status !== 429) return res;
        await new Promise((r) => setTimeout(r, delay));
        delay *= 2;
      } catch (err) {
        if (i === retries - 1) throw err;
        await new Promise((r) => setTimeout(r, delay));
        delay *= 2;
      }
    }
    throw new Error("Max retries exceeded");
  }

  async function getGeminiResponse(prompt: string) {
    // Call Netlify function proxy
    const url = "./.netlify/functions/gemini-proxy";
    const shortLang = language && language.startsWith("kn") ? "kn" : "en";
    // For Kannada, request server-side TTS audio when available; otherwise request text
    const wantAudio = shortLang === "kn";
    const payload = {
      type: wantAudio ? "audio" : "text",
      text: prompt,
      lang: shortLang,
    };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        cache: "no-store",
      });

      if (!res.ok) {
        const bodyText = await res.text();
        throw new Error(`Upstream error: ${bodyText || res.statusText}`);
      }

      const contentType = (res.headers.get("content-type") || "").toLowerCase();

      // If server returned audio (e.g., audio/mpeg, audio/wav), play it directly
      if (contentType.startsWith("audio/")) {
        try {
          const blob = await res.blob();
          const audioUrl = URL.createObjectURL(blob);
          stopSpeech();
          addMessage("(Voice response)", "gemini");
          const audio = new Audio(audioUrl);
          audioRef.current = audio;
          setStatus("Playing audio...");
          audio.play().catch((err) => console.warn("Audio play failed:", err));
          audio.onended = () => {
            setStatus("Click the mic to start speaking.");
            try {
              URL.revokeObjectURL(audioUrl);
            } catch (e) {}
            audioRef.current = null;
          };
          return;
        } catch (e) {
          console.warn("Failed to play server audio, falling back to text:", e);
        }
      }

      // Otherwise assume textual response
      const bodyText = await res.text();
      const text = bodyText || "";
      if (!text.trim()) {
        addMessage("Sorry, no response from the AI.", "gemini");
        speakText("Sorry, no response from the AI.");
        return;
      }

      addMessage(text, "gemini");
      speakText(text);
    } catch (e: any) {
      console.error("Error calling Gemini:", e);
      addMessage(`An error occurred: ${e.message || String(e)}`, "gemini");
      speakText("An error occurred while processing your request.");
    }
  }

  function stopSpeech() {
    try {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      if (audioRef.current) {
        try {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
          URL.revokeObjectURL(audioRef.current.src);
        } catch (e) {}
        audioRef.current = null;
      }
      setStatus("Click the mic to start speaking.");
    } catch (e) {
      console.warn("stopSpeech error", e);
    }
  }

  function speakText(text: string) {
    try {
      if (!("speechSynthesis" in window)) {
        showMessage("Text-to-speech not supported in this browser.");
        return;
      }
      const utt = new SpeechSynthesisUtterance(text);
      utt.lang = language;
      const voices = window.speechSynthesis.getVoices() || [];
      const match = voices.find((v) => v.lang && v.lang.startsWith(language));
      if (match) utt.voice = match as any;
      utt.onstart = () => setStatus("Speaking...");
      utt.onend = () => setStatus("Click the mic to start speaking.");
      utt.onerror = () => setStatus("Error during speech synthesis.");
      // Ensure any previous speech/audio is stopped before speaking
      stopSpeech();
      window.speechSynthesis.speak(utt);
    } catch (e) {
      console.warn(e);
    }
  }

  const onMicClick = () => {
    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch (e) {}
      setIsListening(false);
      return;
    }
    if (!recognitionRef.current) {
      const rec = initializeRecognition();
      if (!rec) return;
    }
    try {
      recognitionRef.current.lang = language;
      recognitionRef.current.start();
    } catch (e) {
      console.error(e);
    }
  };

  // Send text messages from the input box
  async function sendTextMessage(message: string) {
    if (!message || !message.trim()) return;
    addMessage(message, "user");
    setStatus("Thinking...");
    // show loader
    const loaderEl = document.getElementById("loader");
    if (loaderEl) loaderEl.style.display = "block";
    try {
      await getGeminiResponse(message);
    } catch (e) {
      console.error(e);
    } finally {
      if (loaderEl) loaderEl.style.display = "none";
      setStatus("Click the mic to start speaking.");
    }
  }

  return (
    <div className="p-6 flex justify-center">
      <div className="container w-full flex flex-col h-[80vh]">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
          Agro Voice Assistant
        </h1>
        <p className="text-center text-gray-600 mb-4">
          Click the mic to speak in English or Kannada.
        </p>

        <div className="mb-4 text-center">
          <label htmlFor="language" className="font-semibold text-gray-700">
            Select Language:
          </label>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="ml-2 p-2 rounded-lg border border-gray-300"
          >
            <option value="en-US">English</option>
            <option value="kn-IN">ಕನ್ನಡ (Kannada)</option>
          </select>
        </div>

        <div id="chat-container" className="flex-1 flex flex-col">
          <div
            id="conversation"
            ref={conversationRef}
            className="flex-1 overflow-y-auto p-4 border border-gray-300 rounded-lg mb-4 bg-gray-50 flex flex-col space-y-3"
          />

          <div className="flex items-center space-x-2 mt-2">
            <input
              id="user-input"
              placeholder="Type your message..."
              className="flex-1 p-2 border border-gray-300 rounded-lg"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  const val = (e.target as HTMLInputElement).value?.trim();
                  if (val) {
                    sendTextMessage(val);
                    (e.target as HTMLInputElement).value = "";
                  }
                }
              }}
            />
            <button
              id="send-button"
              onClick={() => {
                const el = document.getElementById(
                  "user-input",
                ) as HTMLInputElement | null;
                const val = el?.value?.trim();
                if (val) {
                  sendTextMessage(val);
                  if (el) el.value = "";
                }
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg"
            >
              Send
            </button>
            <div id="loader" style={{ display: "none" }} className="ml-2">
              <div className="loading-spinner" />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center space-y-2">
          <div className="flex items-center space-x-4">
            <button
              id="micBtn"
              onClick={onMicClick}
              className={`bg-blue-600 text-white w-20 h-20 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50`}
              aria-pressed={isListening}
            >
              <svg
                className={`h-10 w-10 ${isListening ? "hidden" : ""}`}
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.41-3.59c.14-.14.28-.29.41-.44L17 10.97V11c0 2.76-2.24 5-5 5s-5-2.24-5-5v-.03l.18.23c.13.14.27.29.41.44C7.79 12.26 9.87 13 12 13s4.21-.74 5.41-1.59zM12 17c-2.32 0-4.49-1.07-5.91-2.74L6 14.15V19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2v-4.85l-.09.11C16.49 15.93 14.32 17 12 17z" />
              </svg>
              <svg
                className={`h-10 w-10 text-red-500 ${isListening ? "" : "hidden"}`}
                viewBox="0 0 24 24"
              >
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.41-3.59c.14-.14.28-.29.41-.44L17 10.97V11c0 2.76-2.24 5-5 5s-5-2.24-5-5v-.03l.18.23c.13.14.27.29.41.44C7.79 12.26 9.87 13 12 13s4.21-.74 5.41-1.59zM12 17c-2.32 0-4.49-1.07-5.91-2.74L6 14.15V19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2v-4.85l-.09.11C16.49 15.93 14.32 17 12 17z" />
              </svg>
            </button>

            <button
              id="stopBtn"
              onClick={stopSpeech}
              className="px-3 py-2 bg-red-500 text-white rounded-md shadow-sm hover:bg-red-600"
            >
              Stop
            </button>
          </div>
          <p id="status" className="mt-2 text-gray-600 text-sm font-semibold">
            {status}
          </p>
        </div>

        <div id="messageBox" className="message-box" />
      </div>

      <style>{` .container{max-width:800px;margin:2rem auto;padding:2rem;background:#fff;border-radius:1rem;box-shadow:0 4px 12px rgba(0,0,0,0.1)} .message-box{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#333;color:#fff;padding:1rem 2rem;border-radius:.75rem;box-shadow:0 4px 12px rgba(0,0,0,0.2);z-index:1000;opacity:0;transition:opacity .3s} .message-box.show{opacity:1} .chat-message{padding:.75rem 1rem;border-radius:.75rem;margin-bottom:.75rem;max-width:85%} .user-message{background:#e0f2fe;color:#1e40af;align-self:flex-end;margin-left:auto} .gemini-message{background:#f0f4f8;color:#374151;align-self:flex-start;margin-right:auto}`}</style>
    </div>
  );
}
