import { useState } from "react";
import Editor from "@monaco-editor/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function App() {

    const [code, setCode] = useState("");
    const [review, setReview] = useState("");
    const [loading, setLoading] = useState(false);
    const [language, setLanguage] = useState("javascript");

    const lineCount = Math.max(code.split("\n").length, 10);


    /* ---------- LANGUAGE DETECTION ---------- */

    const detectLanguage = (code) => {

        if (/^\s*#include\s*</m.test(code)) return "cpp";

        if (/^\s*def\s+\w+\(/m.test(code)) return "python";

        if (/\b(console\.log|const|let|var|function)\b/.test(code)) return "javascript";

        return "plaintext";
    };


    const handleChange = (value) => {

        const text = value || "";

        setCode(text);

        const detected = detectLanguage(text);

        setLanguage(detected);
    };


    const parseReview = (text) => {
        const sections = {
            issues: "",
            why: "",
            fixes: "",
            code: ""
        };

        const issueMatch = text.match(/### Issues Found([\s\S]*?)###/);
        const whyMatch = text.match(/### Why They Matter([\s\S]*?)###/);
        const fixMatch = text.match(/### Suggested Fixes([\s\S]*?)###/);
        const codeMatch = text.match(/### Improved Code([\s\S]*)/);

        if (issueMatch) sections.issues = issueMatch[1].trim();
        if (whyMatch) sections.why = whyMatch[1].trim();
        if (fixMatch) sections.fixes = fixMatch[1].trim();
        if (codeMatch) sections.code = codeMatch[1].trim();

        return sections;
    };

    const parsed = review ? parseReview(review) : null;


    /* ---------- API CALL ---------- */

    const reviewCode = async () => {

        if (!code.trim()) return;

        setLoading(true);

        try {

            const response = await fetch("http://localhost:3001/get-response/ai", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ code })
            });

            if (!response.ok) {
                throw new Error("Server error");
            }

            const data = await response.text();

            setReview(data);

        } catch (error) {

            console.error(error);
            setReview("Error reviewing code.");

        } finally {

            setLoading(false);
        }
    };



    return (

        <div className="min-h-screen bg-[#0f172a] text-gray-200 px-10 py-12">

            {/* HEADER */}

            <div className="text-center mb-12">

                <span className="inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-4 py-1.5 rounded-full mb-5">

                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />

                    AI Powered

                </span>

                <h1 className="text-5xl font-bold tracking-tight">

                    Code <span className="text-emerald-400">Review</span>

                </h1>

                <p className="mt-3 text-sm font-mono text-gray-500">

                    // paste your code → get instant AI feedback

                </p>

            </div>



            {/* GRID */}
            <div className="grid grid-cols-2 gap-6 max-w-7xl mx-auto">

                {/* INPUT PANEL */}
                <div className="flex flex-col h-150 rounded-xl border border-gray-800 bg-[#020617] overflow-hidden shadow-2xl">

                    {/* TAB */}
                    <div className="flex items-center justify-between bg-[#020617] border-b border-gray-800 px-4 h-11 shrink-0">
                        <div className="flex items-center gap-4">
                            <div className="flex gap-1.5">
                                <span className="w-3 h-3 rounded-full bg-red-400" />
                                <span className="w-3 h-3 rounded-full bg-yellow-400" />
                                <span className="w-3 h-3 rounded-full bg-emerald-400" />
                            </div>
                            <span className="text-xs font-mono text-gray-300">
                                input code
                            </span>
                        </div>

                        <span className="text-xs font-mono text-gray-500">
                            {language}
                        </span>
                    </div>

                    {/* EDITOR */}
                    <div className="flex-1 overflow-y-auto">
                        <Editor
                            height="100%"
                            theme="vs-dark"
                            language={language}
                            value={code}
                            onChange={handleChange}
                            options={{
                                fontSize: 14,
                                fontFamily: "JetBrains Mono, monospace",
                                minimap: { enabled: false },
                                automaticLayout: true,
                                scrollBeyondLastLine: false,
                                wordWrap: "on"
                            }}
                        />
                    </div>

                    {/* FOOTER */}
                    <div className="flex items-center justify-between px-4 py-3 bg-[#020617] border-t border-gray-800 shrink-0">
                        <span className="text-xs font-mono text-gray-500">
                            {code.length} chars · {lineCount} lines
                        </span>

                        <button
                            onClick={reviewCode}
                            disabled={loading || !code.trim()}
                            className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold tracking-wide transition-all bg-emerald-400 text-gray-950 hover:bg-emerald-300 disabled:opacity-40"
                        >
                            {loading ? "Analyzing..." : "⚡ Review Code"}
                        </button>
                    </div>

                </div>



                {/* OUTPUT PANEL */}
                <div className="flex flex-col h-150 rounded-xl border border-gray-800 bg-[#020617] overflow-hidden shadow-2xl">

                    {/* HEADER */}
                    <div className="flex items-center bg-[#020617] border-b border-gray-800 px-4 h-11 shrink-0">

                        <div className="flex gap-1.5 mr-4">
                            <span className="w-3 h-3 rounded-full bg-red-400" />
                            <span className="w-3 h-3 rounded-full bg-yellow-400" />
                            <span className="w-3 h-3 rounded-full bg-emerald-400" />
                        </div>

                        <span className="text-xs font-mono text-gray-300">
                            review.md
                        </span>

                    </div>

                    {/* REVIEW CONTENT */}
                    <div className="flex-1 overflow-y-auto bg-[#020617] p-6 text-sm">

                        {review ? (

                            <div className="space-y-6">

                                {/* Issues */}
                                <div className="bg-[#020617] border border-red-500/20 rounded-lg p-4">
                                    <h3 className="text-red-400 font-semibold mb-2">Issues Found</h3>
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {parsed.issues}
                                    </ReactMarkdown>
                                </div>

                                {/* Why */}
                                <div className="bg-[#020617] border border-yellow-500/20 rounded-lg p-4">
                                    <h3 className="text-yellow-400 font-semibold mb-2">Why They Matter</h3>
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {parsed.why}
                                    </ReactMarkdown>
                                </div>

                                {/* Fixes */}
                                <div className="bg-[#020617] border border-blue-500/20 rounded-lg p-4">
                                    <h3 className="text-blue-400 font-semibold mb-2">Suggested Fixes</h3>
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {parsed.fixes}
                                    </ReactMarkdown>
                                </div>

                                {/* Improved Code */}
                                <div className="bg-[#020617] border border-emerald-500/20 rounded-lg p-4">
                                    <h3 className="text-emerald-400 font-semibold mb-3">Improved Code</h3>

                                    <pre className="bg-black/40 p-4 rounded-md overflow-x-auto text-xs font-mono">
                                        <code>{parsed.code}</code>
                                    </pre>
                                </div>

                            </div>

                        ) : (

                            <div className="h-full flex flex-col items-center justify-center gap-3 text-gray-700">
                                <span className="text-4xl opacity-30">🤖</span>
                                <p className="text-xs tracking-widest uppercase">
                                    AI review will appear here
                                </p>
                            </div>

                        )}

                    </div>

                </div>

            </div>

        </div>

    );
}

export default App;