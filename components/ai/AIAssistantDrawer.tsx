'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FullBusinessReport, AIChatMessage, FinancialAssumptions } from '@/types/business';
import { processAssistantChat } from '@/lib/ai/aiService';
import { Sparkles, Send, Bot, User, ArrowRight, CheckCircle2, MessageSquare, X } from 'lucide-react';

interface AIAssistantDrawerProps {
  report: FullBusinessReport;
  isOpen: boolean;
  onClose: () => void;
  onApplyAssistantAction?: (changes: Partial<FinancialAssumptions> & { budget?: number }) => void;
}

const SAMPLE_QUESTIONS = [
  'I only have ₹3 lakh.',
  'What if sales decrease by 30%?',
  'What if I sell to gyms instead of retail shops?',
  'What if I increase the price to ₹15 per unit?',
  'How can I cut fixed operating costs?'
];

export function AIAssistantDrawer({
  report,
  isOpen,
  onClose,
  onApplyAssistantAction
}: AIAssistantDrawerProps) {
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: 'init-1',
      role: 'assistant',
      content: `Hello! I am your **Startup Sheild Strategic Decision Assistant**. I have your active business model for **${report.idea.businessType}** in **${report.idea.location.city}** loaded into memory.

I don't just chat — I am linked directly to your financial calculation engine. You can ask me to test budget constraints, simulate demand shocks, or evaluate new customer segments, and I will execute the adjustments.`,
      timestamp: new Date().toISOString()
    }
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isTyping) return;

    const userMsg: AIChatMessage = {
      id: 'usr-' + Date.now(),
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // Process through our AI Engine
      const aiResponse = await processAssistantChat(textToSend.trim(), report);
      setMessages(prev => [...prev, aiResponse]);

      // If the assistant executed a mutation on the simulation, propagate to master!
      if (aiResponse.appliedAction && onApplyAssistantAction) {
        onApplyAssistantAction({
          ...aiResponse.appliedAction.modifiedAssumptions,
          budget: aiResponse.appliedAction.modifiedBudget
        });
      }
    } catch (e) {
      console.error('AI chat failed:', e);
      setMessages(prev => [
        ...prev,
        {
          id: 'err-' + Date.now(),
          role: 'assistant',
          content: 'Sorry, I encountered an issue updating the simulation. Please try again.',
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
      {/* Drawer Header */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-850">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>Startup Sheild AI Assistant</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Live Engine
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Context: {report.idea.businessType} (₹{(report.idea.budget / 100000).toFixed(1)}L)
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
          Quick Strategic Queries
        </span>
        <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
          {SAMPLE_QUESTIONS.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(q)}
              className="px-2.5 py-1 rounded-full whitespace-nowrap bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[11px] hover:border-emerald-500 hover:text-emerald-600 transition-colors shrink-0"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-6 h-6 rounded-md bg-emerald-600/10 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-2xl p-3.5 ${
                msg.role === 'user'
                  ? 'bg-emerald-600 text-white rounded-tr-none'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200/80 dark:border-slate-700/80'
              }`}
            >
              <div className="whitespace-pre-wrap leading-relaxed space-y-1">
                {msg.content}
              </div>

              {msg.appliedAction && (
                <div className="mt-3 pt-2.5 border-t border-emerald-500/20 flex items-start gap-1.5 text-[11px] font-medium text-emerald-800 dark:text-emerald-300 bg-emerald-50/60 dark:bg-emerald-950/40 p-2 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Engine Updated Simulation:</span>
                    <span>{msg.appliedAction.description}</span>
                  </div>
                </div>
              )}

              <span className={`block text-[9px] mt-1.5 ${msg.role === 'user' ? 'text-emerald-100' : 'text-slate-400'}`}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            {msg.role === 'user' && (
              <div className="w-6 h-6 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-slate-400 text-xs italic">
            <Sparkles className="w-3.5 h-3.5 animate-spin text-emerald-500" />
            <span>Startup Sheild Engine calculating financial formulas...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Footer */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(input);
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask anything, e.g. 'I only have ₹3 lakh'..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white shadow-sm transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
