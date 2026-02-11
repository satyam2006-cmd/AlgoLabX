import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------
const SparkleIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
);

const CodeIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
    </svg>
);

const CubeIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
    </svg>
);

const SendIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
    </svg>
);

// ---------------------------------------------------------------------------
// Tab definitions
// ---------------------------------------------------------------------------
const TABS = [
    {
        id: 'doubt',
        label: 'Doubt Solver',
        icon: SparkleIcon,
        placeholder: 'Ask any DSA question… e.g. "How does Dijkstra\'s algorithm work?"',
        description: 'Get clear concept explanations with complexity analysis and real-world analogies.',
        color: 'from-indigo-500/20 to-purple-500/20',
        borderColor: 'border-indigo-500/30',
        accentColor: 'text-indigo-400',
        showCode: false,
    },
    {
        id: 'explain',
        label: 'Code Explainer',
        icon: CodeIcon,
        placeholder: 'Optionally describe what you want to know about this code…',
        description: 'Paste code to get algorithm identification, walkthrough, and optimization tips.',
        color: 'from-emerald-500/20 to-cyan-500/20',
        borderColor: 'border-emerald-500/30',
        accentColor: 'text-emerald-400',
        showCode: true,
    },
    {
        id: 'recommend',
        label: 'DS Recommender',
        icon: CubeIcon,
        placeholder: 'Describe your requirements… e.g. "I need fast insertion and sorted order"',
        description: 'Get the best data structure for your problem with trade-off analysis.',
        color: 'from-amber-500/20 to-orange-500/20',
        borderColor: 'border-amber-500/30',
        accentColor: 'text-amber-400',
        showCode: false,
    },
];

// ---------------------------------------------------------------------------
// Markdown-like formatter (lightweight, no external dependency)
// ---------------------------------------------------------------------------
function formatMarkdown(text) {
    if (!text) return '';
    // Convert markdown to simple HTML
    let html = text
        // Code blocks with language
        .replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) =>
            `<pre class="ai-code-block"><code class="language-${lang || 'text'}">${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`)
        // Inline code
        .replace(/`([^`]+)`/g, '<code class="ai-inline-code">$1</code>')
        // Headers
        .replace(/^### (.+)$/gm, '<h4 class="ai-h4">$1</h4>')
        .replace(/^## (.+)$/gm, '<h3 class="ai-h3">$1</h3>')
        .replace(/^# (.+)$/gm, '<h2 class="ai-h2">$1</h2>')
        // Bold
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        // Italic
        .replace(/\*([^*]+)\*/g, '<em>$1</em>')
        // Horizontal rule
        .replace(/^---$/gm, '<hr class="ai-hr" />')
        // Tables
        .replace(/^\|(.+)\|$/gm, (match) => {
            const cells = match.split('|').filter(c => c.trim());
            if (cells.every(c => /^[\s-:]+$/.test(c))) {
                return ''; // separator row
            }
            const isHeader = cells.some(c => /^[\s-:]+$/.test(c)) ? false : true;
            const tag = isHeader ? 'th' : 'td';
            const row = cells.map(c => `<${tag} class="ai-table-cell">${c.trim()}</${tag}>`).join('');
            return `<tr>${row}</tr>`;
        })
        // Unordered lists
        .replace(/^[-*] (.+)$/gm, '<li class="ai-li">$1</li>')
        // Ordered lists
        .replace(/^\d+\. (.+)$/gm, '<li class="ai-li-ordered">$1</li>')
        // Paragraphs (double newline)
        .replace(/\n\n/g, '</p><p class="ai-p">')
        // Single newlines
        .replace(/\n/g, '<br />');

    // Wrap list items
    html = html.replace(/((<li class="ai-li">.*?<\/li>\s*)+)/g, '<ul class="ai-ul">$1</ul>');
    html = html.replace(/((<li class="ai-li-ordered">.*?<\/li>\s*)+)/g, '<ol class="ai-ol">$1</ol>');
    // Wrap table rows
    html = html.replace(/((<tr>.*?<\/tr>\s*)+)/g, '<table class="ai-table"><tbody>$1</tbody></table>');

    return `<div class="ai-response-content"><p class="ai-p">${html}</p></div>`;
}

// ---------------------------------------------------------------------------
// Loading skeleton
// ---------------------------------------------------------------------------
const LoadingSkeleton = () => (
    <div className="space-y-4 animate-pulse">
        <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-dark-700 shimmer" />
            <div className="h-5 w-48 rounded bg-dark-700 shimmer" />
        </div>
        {[80, 100, 60, 90, 70].map((w, i) => (
            <div key={i} className="space-y-2">
                <div className={`h-4 rounded bg-dark-700 shimmer`} style={{ width: `${w}%` }} />
                {i % 2 === 0 && <div className="h-4 rounded bg-dark-750 shimmer" style={{ width: `${w - 20}%` }} />}
            </div>
        ))}
        <div className="h-24 rounded-xl bg-dark-700/50 shimmer mt-4" />
    </div>
);

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------
const AIMentor = () => {
    const [activeTab, setActiveTab] = useState('doubt');
    const [query, setQuery] = useState('');
    const [codeSnippet, setCodeSnippet] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const responseRef = useRef(null);

    const currentTab = TABS.find((t) => t.id === activeTab);

    const handleSubmit = async () => {
        // Validate
        if (activeTab === 'explain' && !codeSnippet.trim()) {
            setError('Please paste a code snippet to explain.');
            return;
        }
        if (activeTab !== 'explain' && !query.trim()) {
            setError('Please enter a question.');
            return;
        }

        setError('');
        setLoading(true);
        setResponse('');

        try {
            const body = {
                mode: activeTab,
                user_query: query.trim(),
                code_snippet: codeSnippet.trim(),
                context: '',
            };

            const res = await fetch('/api/ai/mentor', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Something went wrong. Please try again.');
                return;
            }

            setResponse(data.response);
            // Scroll to response
            setTimeout(() => {
                responseRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        } catch {
            setError('Could not reach the AI server. Make sure the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            handleSubmit();
        }
    };

    const switchTab = (tabId) => {
        setActiveTab(tabId);
        setResponse('');
        setError('');
    };

    // Example questions for quick start
    const examples = {
        doubt: [
            'How does quicksort work?',
            'Explain BFS vs DFS',
            'What is dynamic programming?',
        ],
        explain: [],
        recommend: [
            'Fast lookup + ordered traversal',
            'FIFO queue with priority support',
            'Frequent insertions & deletions in middle',
        ],
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/30 to-purple-500/30 border border-indigo-500/20 flex items-center justify-center">
                        <SparkleIcon />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-white">AI DSA Mentor</h1>
                        <p className="text-dark-300 text-sm">Your intelligent DSA teaching assistant</p>
                    </div>
                </div>
            </motion.div>

            {/* Tab Switcher */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-wrap gap-2 sm:gap-3 mb-6"
            >
                {TABS.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = tab.id === activeTab;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => switchTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 border ${isActive
                                ? `bg-gradient-to-r ${tab.color} ${tab.borderColor} text-white shadow-lg`
                                : 'bg-dark-800/50 border-dark-600/50 text-dark-300 hover:bg-dark-750/70 hover:text-white hover:border-dark-500'
                                }`}
                        >
                            <Icon />
                            <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                    );
                })}
            </motion.div>

            {/* Active Tab Description */}
            <motion.p
                key={activeTab}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`text-sm mb-6 ${currentTab.accentColor}`}
            >
                {currentTab.description}
            </motion.p>

            {/* Input Area */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className={`rounded-2xl border bg-dark-800/60 backdrop-blur-sm p-4 sm:p-6 mb-6 ${currentTab.borderColor}`}
                >
                    {/* Code input for explain mode */}
                    {currentTab.showCode && (
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-dark-200 mb-2">
                                Code Snippet <span className="text-red-400">*</span>
                            </label>
                            <textarea
                                value={codeSnippet}
                                onChange={(e) => setCodeSnippet(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Paste your C/C++/Java/Python code here…"
                                className="w-full h-40 bg-dark-900 border border-dark-600/50 rounded-xl p-4 text-sm font-mono text-dark-100 placeholder-dark-400 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 resize-none transition-all"
                            />
                        </div>
                    )}

                    {/* Query input */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-dark-200 mb-2">
                            {activeTab === 'explain' ? 'Additional Question (optional)' : 'Your Question'}{' '}
                            {activeTab !== 'explain' && <span className="text-red-400">*</span>}
                        </label>
                        <textarea
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={currentTab.placeholder}
                            rows={3}
                            className="w-full bg-dark-900 border border-dark-600/50 rounded-xl p-4 text-sm text-dark-100 placeholder-dark-400 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 resize-none transition-all"
                        />
                    </div>

                    {/* Example prompts */}
                    {examples[activeTab]?.length > 0 && !query && (
                        <div className="mb-4 flex flex-wrap gap-2">
                            <span className="text-xs text-dark-400">Try:</span>
                            {examples[activeTab].map((ex, i) => (
                                <button
                                    key={i}
                                    onClick={() => setQuery(ex)}
                                    className="text-xs px-3 py-1.5 rounded-lg bg-dark-750/60 border border-dark-600/40 text-dark-300 hover:text-white hover:border-dark-500 transition-all"
                                >
                                    {ex}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Submit button */}
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-dark-400 hidden sm:inline">
                            Ctrl + Enter to send
                        </span>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleSubmit}
                            disabled={loading}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${loading
                                ? 'bg-dark-700 text-dark-400 cursor-not-allowed'
                                : `bg-gradient-to-r ${currentTab.color} border ${currentTab.borderColor} text-white hover:shadow-lg hover:shadow-indigo-500/10`
                                }`}
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Thinking…
                                </>
                            ) : (
                                <>
                                    <SendIcon />
                                    Ask Mentor
                                </>
                            )}
                        </motion.button>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Error */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm"
                    >
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                            </svg>
                            {error}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Response Area */}
            <div ref={responseRef}>
                <AnimatePresence mode="wait">
                    {loading && (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className={`rounded-2xl border bg-dark-800/40 backdrop-blur-sm p-6 sm:p-8 ${currentTab.borderColor}`}
                        >
                            <LoadingSkeleton />
                        </motion.div>
                    )}

                    {!loading && response && (
                        <motion.div
                            key="response"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            className={`rounded-2xl border bg-dark-800/40 backdrop-blur-sm p-6 sm:p-8 ${currentTab.borderColor}`}
                        >
                            {/* Response header */}
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-dark-600/30">
                                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${currentTab.color} flex items-center justify-center`}>
                                    <SparkleIcon />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-white">AI Mentor Response</h3>
                                    <p className="text-xs text-dark-400">Powered by Gemini</p>
                                </div>
                            </div>

                            {/* Rendered markdown */}
                            <div
                                className="ai-response prose prose-invert max-w-none"
                                dangerouslySetInnerHTML={{ __html: formatMarkdown(response) }}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AIMentor;
