import React, { useState, useRef, useEffect } from 'react';
import api from '../services/api';
import { useBookstore } from '../context/BookstoreContext';

export const ReadGeniusAI = () => {
  const { setActiveModalBook, showToast } = useBookstore();
  const [messages, setMessages] = useState([
    {
      id: 1,
      isUser: false,
      text: "Greetings, bibliophile. I am <strong>ReadGenius</strong>, trained on PageHaven's rare archives and canonical publishing records. Click any suggested query below or ask about literary themes, folio editions, or order policies."
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [suggestedBooks, setSuggestedBooks] = useState([]);
  const chatBottomRef = useRef(null);

  const suggestedPrompts = [
    "What books explore philosophical depth like The Midnight Library?",
    "Which graphic novel should I start with for rich sequential storytelling?",
    "How does PageHaven 14-day doorstep return service work?",
    "What are the best motivational and mindset folios available?"
  ];

  const scrollToBottom = () => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (queryText) => {
    const text = (queryText || inputVal).trim();
    if (!text) return;

    setInputVal('');
    const userMsg = { id: Date.now(), isUser: true, text };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    const res = await api.askConcierge(text);
    setIsTyping(false);

    let reply = "Thank you for consulting PageHaven. Based on our rare collections, I recommend browsing our curated departments or checking out this month’s spotlight folios—each inspected with acid-free archival standards.";
    if (res && res.success && res.data?.reply) {
      reply = res.data.reply;
      if (res.data.suggestedBooks) {
        setSuggestedBooks(res.data.suggestedBooks);
      }
    }

    const aiMsg = { id: Date.now() + 1, isUser: false, text: reply };
    setMessages(prev => [...prev, aiMsg]);
  };

  const handleReset = () => {
    setMessages([
      {
        id: 1,
        isUser: false,
        text: "Greetings, bibliophile. I am <strong>ReadGenius</strong>, trained on classical publishing archives and PageHaven's current catalog. Ask me for book suggestions, author critiques, or customer support."
      }
    ]);
    setSuggestedBooks([]);
    showToast('ReadGenius dialogue reset.');
  };

  return (
    <div className="rounded-2xl bg-surface-container p-6 flex flex-col gap-5 shadow-sm border border-surface-container">
      {/* Title & Reset */}
      <div className="flex items-center gap-3 justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-sm">
            <span className="material-symbols-outlined text-[24px]">psychology</span>
          </div>
          <div className="flex flex-col">
            <h2 className="font-headline-md text-2xl text-primary font-bold leading-tight">
              ReadGenius AI Literary Guide
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant">
              Your bespoke bibliophilic advisor for curated readings, literary analysis & concierge queries.
            </p>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="px-3 py-1.5 bg-surface-container-lowest hover:bg-surface text-primary rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer border border-surface-container"
        >
          <span className="material-symbols-outlined text-[16px]">restart_alt</span>
          <span>Reset Dialogue</span>
        </button>
      </div>

      {/* Suggested Prompt Pills */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="text-[11px] font-bold text-outline uppercase tracking-wider">
          Suggested Queries:
        </span>
        {suggestedPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="px-3 py-1 bg-surface-container-lowest hover:bg-surface text-primary rounded-full text-xs shadow-sm transition-colors border border-surface-container cursor-pointer"
          >
            {prompt} →
          </button>
        ))}
      </div>

      {/* Chat Dialogue Box */}
      <div className="bg-surface-container-lowest rounded-xl p-4 flex flex-col gap-3 min-h-[360px] max-h-[480px] overflow-y-auto shadow-inner border border-surface-container">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-3 ${m.isUser ? 'justify-end' : ''}`}
          >
            {!m.isUser && (
              <div className="w-8 h-8 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center shrink-0 shadow-sm">
                <span className="material-symbols-outlined text-[18px]">auto_stories</span>
              </div>
            )}
            <div
              className={`rounded-2xl p-3.5 max-w-xl text-xs sm:text-sm leading-relaxed ${
                m.isUser
                  ? 'bg-primary text-on-primary rounded-tr-none font-medium'
                  : 'bg-surface-container-low text-on-surface rounded-tl-none shadow-sm'
              }`}
              dangerouslySetInnerHTML={{ __html: m.text }}
            />
          </div>
        ))}

        {isTyping && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center shrink-0 shadow-sm">
              <span className="material-symbols-outlined text-[18px]">psychology</span>
            </div>
            <div className="bg-surface-container-low rounded-2xl rounded-tl-none px-3.5 py-2.5 text-on-surface text-xs italic flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] animate-spin text-primary">
                progress_activity
              </span>
              <span>ReadGenius is consulting the archive...</span>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Suggested Books Shelf (if returned by AI) */}
      {suggestedBooks.length > 0 && (
        <div className="bg-surface-container-low rounded-xl p-3 border border-surface-container">
          <span className="text-[11px] font-bold text-outline uppercase tracking-wider block mb-2">
            Archival Folios Mentioned by ReadGenius:
          </span>
          <div className="flex items-center gap-3 overflow-x-auto pb-1">
            {suggestedBooks.map((b) => (
              <div
                key={b._id}
                onClick={() => setActiveModalBook(b)}
                className="flex items-center gap-2.5 p-2 rounded-lg bg-surface-container-lowest hover:bg-surface border border-surface-container cursor-pointer shrink-0 transition-transform hover:scale-102"
              >
                <img src={b.coverImage} alt={b.title} className="w-8 h-11 object-cover rounded shadow-sm" />
                <div className="text-left">
                  <h4 className="text-xs font-bold text-on-surface truncate max-w-[130px]">{b.title}</h4>
                  <span className="text-[10px] text-outline block">{b.author}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex gap-2"
      >
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Ask ReadGenius about authors, themes, archival editions, or return policies..."
          className="flex-1 px-4 py-2.5 rounded-xl bg-surface-container-lowest text-on-surface text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-primary shadow-sm border border-surface-container"
        />
        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-semibold text-xs sm:text-sm hover:bg-primary-container flex items-center gap-1.5 shadow transition-all shrink-0 cursor-pointer"
        >
          <span>Consult</span>
          <span className="material-symbols-outlined text-[18px]">send</span>
        </button>
      </form>
    </div>
  );
};

export default ReadGeniusAI;
