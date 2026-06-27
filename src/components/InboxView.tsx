import React, { useState, useRef, useEffect } from 'react';
import { Contact, Message, Asset, Priority } from '../types';

interface InboxViewProps {
  contacts: Contact[];
  selectedContact: Contact;
  onSelectContact: (contact: Contact) => void;
  searchQuery: string;
  onSendMessage: (text: string, isQuery: boolean) => Promise<void>;
  onAssetClick: (asset: Asset) => void;
  isSending: boolean;
  aiPersona: string;
}

export default function InboxView({
  contacts,
  selectedContact,
  onSelectContact,
  searchQuery,
  onSendMessage,
  onAssetClick,
  isSending,
  aiPersona
}: InboxViewProps) {
  
  const [filterMode, setFilterMode] = useState<'all' | 'priority' | 'unread'>('all');
  const [messageText, setMessageText] = useState('');
  const [smartReplies, setSmartReplies] = useState<string[]>([
    "Approved, let's proceed with the shift.",
    "Let me check the numbers first.",
    "Can we hold off until Monday?"
  ]);
  const [isGeneratingReplies, setIsGeneratingReplies] = useState(false);
  const [showScheduler, setShowScheduler] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('2026-06-29');
  const [scheduleTime, setScheduleTime] = useState('14:00');

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const threadEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat thread
  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedContact.messages]);

  // Handle textarea autosize
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [messageText]);

  // Filter contacts based on search query and selected filterMode
  const filteredContacts = contacts.filter((c) => {
    // 1. Search Query Filter
    const matchesSearch = 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.aiSummary.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    // 2. Category Filter
    if (filterMode === 'priority') {
      return c.priority === 'high' || c.priority === 'medium';
    }
    if (filterMode === 'unread') {
      return c.unread;
    }
    
    return true;
  });

  // Suggest Smart Reply from server-side Gemini
  const handleFetchSmartReplies = async () => {
    try {
      setIsGeneratingReplies(true);
      const res = await fetch('/api/suggest-replies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: selectedContact.messages,
          contactName: selectedContact.name,
          role: selectedContact.role
        })
      });
      const data = await res.json();
      if (data.suggestions && data.suggestions.length > 0) {
        setSmartReplies(data.suggestions);
      }
    } catch (e) {
      console.error("Error fetching smart replies:", e);
    } finally {
      setIsGeneratingReplies(false);
    }
  };

  // Run initial smart replies simulation when contact shifts
  useEffect(() => {
    if (selectedContact.id === 'sarah_chen') {
      setSmartReplies([
        "Approved, let's proceed with the $12k shift.",
        "Could we scale it down to $8k?",
        "Let me review the influencer tier list first."
      ]);
    } else if (selectedContact.id === 'marcus_aurelius') {
      setSmartReplies([
        "I looked at the draft. The typography tracking looks superb.",
        "Let's stick with Inter for body text.",
        "Can we schedule a physical workshop to discuss layout metrics?"
      ]);
    } else {
      setSmartReplies([
        "Received. I will examine this later.",
        "Thanks for the automatic digest.",
        "Are there any pending checklist items left?"
      ]);
    }
  }, [selectedContact.id]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!messageText.trim() || isSending) return;
    
    const textToSend = messageText;
    setMessageText('');
    await onSendMessage(textToSend, false);
  };

  const handleSmartReplyClick = async (reply: string) => {
    if (isSending) return;
    await onSendMessage(reply, false);
  };

  // Schedule visual confirmation
  const handleConfirmSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    const eventText = `📅 Scheduled a Sync meeting with ${selectedContact.name} on ${scheduleDate} at ${scheduleTime}. Calendar invites dispatched.`;
    setShowScheduler(false);
    await onSendMessage(eventText, true); // Send as helper context text
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-surface flex-col md:flex-row">
      
      {/* 1. Chat List Panel (Left/Center narrow) */}
      <section className="w-full md:w-80 lg:w-96 flex flex-col bg-surface-container-lowest border-r border-outline-variant/15 overflow-y-auto no-scrollbar flex-shrink-0">
        
        {/* Inbox header */}
        <div className="p-5 border-b border-outline-variant/10">
          <div className="flex justify-between items-end mb-4">
            <h2 className="font-display font-bold text-lg text-on-surface">Smart Inbox</h2>
            <span className="text-[10px] font-sans font-bold text-primary bg-primary-container/40 px-2.5 py-0.5 rounded-full">
              {contacts.filter(c => c.unread).length} New
            </span>
          </div>

          {/* Chips */}
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
            {(['all', 'priority', 'unread'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setFilterMode(mode)}
                className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wide transition-all select-none cursor-pointer capitalize ${
                  filterMode === mode
                    ? 'bg-on-surface text-surface'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                {mode === 'all' ? 'All Chats' : mode}
              </button>
            ))}
          </div>
        </div>

        {/* Contact items */}
        <div className="flex-1 divide-y divide-outline-variant/10">
          {filteredContacts.length === 0 ? (
            <div className="p-8 text-center text-xs text-outline font-sans">
              No conversations found.
            </div>
          ) : (
            filteredContacts.map((contact) => {
              const isSelected = selectedContact.id === contact.id;
              
              return (
                <div
                  key={contact.id}
                  onClick={() => onSelectContact(contact)}
                  className={`group relative p-4.5 flex gap-4 cursor-pointer hover:bg-surface-container-low/50 transition-all priority-${contact.priority} ${
                    isSelected ? 'bg-surface-container-low border-r-2 border-r-primary' : 'bg-surface-container-lowest'
                  }`}
                >
                  {/* Avatar indicator */}
                  <div className="relative flex-shrink-0">
                    {contact.avatar === 'group_avatar' ? (
                      <div className="h-12 w-12 rounded-full bg-surface-container-high flex items-center justify-center border border-outline-variant/20">
                        <span className="material-symbols-outlined text-outline">group</span>
                      </div>
                    ) : (
                      <div className="h-12 w-12 rounded-full overflow-hidden bg-primary-fixed border border-outline-variant/30">
                        <img 
                          className="w-full h-full object-cover" 
                          src={contact.avatar} 
                          alt={contact.name}
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}
                    {contact.unread && (
                      <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-primary rounded-full border-2 border-surface-container-lowest"></span>
                    )}
                  </div>

                  {/* Text snippet */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-display font-bold text-xs text-on-surface truncate">{contact.name}</h3>
                      <span className="text-[9px] font-mono text-outline">{contact.lastMessageTime}</span>
                    </div>
                    
                    <p className="text-[11px] text-on-surface-variant truncate font-semibold mt-0.5">
                      {contact.role}
                    </p>
                    
                    <p className="text-[11px] text-outline truncate mt-1 leading-normal font-sans">
                      {contact.lastMessageText}
                    </p>

                    {/* AI Summary Stripe */}
                    {contact.aiSummary && (
                      <div className="mt-2 bg-primary-fixed/20 hover:bg-primary-fixed/30 p-2 rounded-lg border border-primary-fixed/40 transition-all">
                        <p className="text-[10px] text-primary italic leading-snug font-sans">
                          {contact.aiSummary}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* 2. Chat Details Panel (Center/Right main) */}
      <section className="flex-1 flex flex-col bg-surface overflow-hidden relative border-r border-outline-variant/10">
        
        {/* AI Brief Header */}
        <div className="p-5 bg-surface-container-lowest/70 backdrop-blur-md border-b border-outline-variant/15">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              <h2 className="font-display font-extrabold text-base text-primary">AI Brief: {selectedContact.name}</h2>
              <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-md font-mono capitalize">
                {selectedContact.priority} Urgency
              </span>
            </div>
            
            {/* AI Persona visual indicator */}
            <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-outline font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
              Persona: {aiPersona}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Status card */}
            <div className="bg-surface-container-low/65 p-3 rounded-xl border border-outline-variant/15 flex flex-col justify-center">
              <span className="font-display text-[9px] text-outline uppercase tracking-wider block font-bold mb-1">Status</span>
              <p className="text-xs font-semibold text-on-surface truncate">{selectedContact.status}</p>
            </div>

            {/* Sentiment card */}
            <div className="bg-surface-container-low/65 p-3 rounded-xl border border-outline-variant/15 flex flex-col justify-center">
              <span className="font-display text-[9px] text-outline uppercase tracking-wider block font-bold mb-1">Sentiment</span>
              <p className="text-xs font-semibold text-on-surface flex items-center gap-2 truncate">
                {selectedContact.sentiment}
                <span className="w-2 h-2 rounded-full bg-error animate-pulse flex-shrink-0"></span>
              </p>
            </div>

            {/* Resolution progress */}
            <div className="bg-surface-container-low/65 p-3 rounded-xl border border-outline-variant/15 flex flex-col justify-center">
              <div className="flex justify-between items-center mb-1">
                <span className="font-display text-[9px] text-outline uppercase tracking-wider font-bold">Resolution Tracker</span>
                <span className="text-[9px] font-bold font-mono text-primary">{selectedContact.resolutionProgress}%</span>
              </div>
              <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-primary to-secondary h-full transition-all duration-500"
                  style={{ width: `${selectedContact.resolutionProgress}%` }}
                ></div>
              </div>
              <p className="text-[9px] text-outline font-mono mt-1">{selectedContact.resolutionTime}</p>
            </div>
          </div>
        </div>

        {/* 3. Conversation Thread (Fluid scrollable area) */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 no-scrollbar">
          
          <div className="flex justify-center">
            <span className="px-3.5 py-1 bg-surface-container-high rounded-full text-[9px] font-display font-semibold text-outline uppercase tracking-wider">
              Tuesday, Oct 24
            </span>
          </div>

          {/* Core thread bento grid layout if initial setup, else standard conversation bubbles */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            
            {/* Left messages block (Col 7-span) */}
            <div className="lg:col-span-7 space-y-4">
              {selectedContact.messages.map((msg) => {
                const isMe = msg.isMe;
                const isAi = msg.isAI;
                
                if (isAi) {
                  return (
                    <div key={msg.id} className="bg-primary-container/10 border border-primary-fixed/40 p-4 rounded-xl flex gap-3 animate-in fade-in duration-300">
                      <span className="material-symbols-outlined text-primary text-xl flex-shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                        auto_awesome
                      </span>
                      <div className="space-y-1 font-sans">
                        <span className="text-[10px] font-bold text-primary block uppercase tracking-wider">Cognitive Ease Assistant</span>
                        <p className="text-xs text-on-surface leading-relaxed italic">{msg.text}</p>
                        <span className="text-[9px] text-outline font-mono block pt-1">{msg.timestamp}</span>
                      </div>
                    </div>
                  );
                }

                return (
                  <div 
                    key={msg.id} 
                    className={`flex gap-3 max-w-[90%] animate-in fade-in duration-300 ${isMe ? 'ml-auto flex-row-reverse' : ''}`}
                  >
                    <div className="h-8 w-8 rounded-full overflow-hidden flex-shrink-0 bg-primary-fixed border border-outline-variant/30">
                      <img 
                        src={msg.senderAvatar} 
                        alt={msg.senderName} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    
                    <div className={`p-4.5 rounded-2xl border font-sans text-xs shadow-xs leading-relaxed ${
                      isMe 
                        ? 'bg-primary text-on-primary border-transparent rounded-tr-xs text-right' 
                        : 'bg-surface-container-lowest text-on-surface border-outline-variant/15 rounded-tl-xs text-left'
                    }`}>
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                      <div className={`mt-2 flex items-center gap-1 text-[9px] font-mono ${isMe ? 'text-on-primary/70 justify-end' : 'text-outline'}`}>
                        <span className="font-semibold">{msg.senderName}</span>
                        <span>•</span>
                        <span>{msg.timestamp}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {isSending && (
                <div className="flex gap-3 max-w-[80%] animate-pulse">
                  <div className="h-8 w-8 rounded-full bg-surface-container-high animate-bounce"></div>
                  <div className="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/15 text-xs text-outline">
                    Typing intelligence response...
                  </div>
                </div>
              )}
              
              <div ref={threadEndRef} />
            </div>

            {/* Right block: Asymmetrical insights + context files (Col 5-span) */}
            <div className="lg:col-span-5 space-y-5 self-start">
              
              {/* Key Insights Asymmetric Card */}
              <div className="bg-primary text-on-primary p-5.5 rounded-2xl shadow-lg relative overflow-hidden flex flex-col justify-between">
                {/* Auto stories icon absolute decoration in top corner */}
                <div className="absolute -right-5 -top-5 opacity-15 rotate-12 select-none pointer-events-none">
                  <span className="material-symbols-outlined text-[130px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    auto_stories
                  </span>
                </div>
                
                <div className="relative z-10">
                  <h4 className="font-display text-xs font-bold uppercase tracking-widest text-primary-fixed mb-4">Key Insights</h4>
                  <ul className="space-y-3.5">
                    {selectedContact.keyInsights.length === 0 ? (
                      <li className="text-xs italic text-primary-fixed/80">No insights compiled. Chat with the user or write a response to auto-compile new milestones.</li>
                    ) : (
                      selectedContact.keyInsights.map((insight, idx) => (
                        <li key={idx} className="flex gap-2.5 items-start text-xs font-sans leading-normal">
                          <span className="material-symbols-outlined text-[16px] text-primary-fixed-dim flex-shrink-0 mt-0.5">check_circle</span>
                          <span>{insight}</span>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
                
                <div className="text-[9px] font-mono text-primary-fixed-dim/80 mt-5 relative z-10">
                  ⚡ Recalculated live by Gemini 3.5
                </div>
              </div>

              {/* Visual Context / Referenced Assets block */}
              {selectedContact.referencedAssets.length > 0 && (
                <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/15 shadow-xs text-left">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-display font-bold text-xs text-on-surface">Referenced Assets</h4>
                    <span className="text-[10px] font-semibold text-outline">
                      {selectedContact.referencedAssets.length} Files
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {selectedContact.referencedAssets.map((asset) => (
                      <div 
                        key={asset.id} 
                        onClick={() => onAssetClick(asset)}
                        className="group flex flex-col cursor-pointer bg-surface-container-low/35 hover:bg-surface-container-low p-2 rounded-xl border border-outline-variant/10 transition-all shadow-2xs hover:shadow-xs"
                      >
                        <div className="h-28 rounded-lg bg-surface-container-high overflow-hidden relative">
                          <img 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                            src={asset.imageUrl} 
                            alt={asset.name}
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="material-symbols-outlined text-white text-lg">open_in_new</span>
                          </div>
                        </div>
                        <p className="text-[10px] mt-2 text-on-surface font-semibold truncate px-1">
                          {asset.name}
                        </p>
                        <span className="text-[9px] text-outline font-mono px-1">
                          {asset.type.toUpperCase()} file
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>

        {/* 4. Suggested Smart Replies Slider */}
        <div className="px-5 pt-3 bg-surface border-t border-outline-variant/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-display font-semibold text-outline uppercase tracking-wider flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              Suggested Replies
            </span>
            <button 
              onClick={handleFetchSmartReplies}
              disabled={isGeneratingReplies}
              className="text-[10px] text-primary hover:opacity-80 font-bold select-none cursor-pointer flex items-center gap-1 disabled:opacity-50"
            >
              <span className={`material-symbols-outlined text-[14px] ${isGeneratingReplies ? 'animate-spin' : ''}`}>sync</span>
              Gemini Regenerate
            </button>
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {smartReplies.map((reply, i) => (
              <button
                key={i}
                onClick={() => handleSmartReplyClick(reply)}
                className="px-3.5 py-1.5 bg-surface-container-lowest border border-outline-variant/15 hover:border-primary text-on-surface-variant hover:text-primary text-[11px] font-medium font-sans rounded-lg whitespace-nowrap select-none cursor-pointer hover:bg-primary-container/5 transition-all max-w-xs truncate"
                title={reply}
              >
                {reply}
              </button>
            ))}
          </div>
        </div>

        {/* 5. Message Input & Action Triggers */}
        <div className="p-5 bg-surface border-t border-outline-variant/10">
          <form onSubmit={handleSend} className="max-w-4xl mx-auto relative flex flex-col">
            
            {/* Input container */}
            <div className="relative">
              {/* Attachment selector icon */}
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex gap-2">
                <button 
                  type="button" 
                  className="text-outline hover:text-primary transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">add</span>
                </button>
              </div>

              {/* Textarea input */}
              <textarea
                ref={textareaRef}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                className="w-full bg-surface-container-low border border-outline-variant/30 rounded-2xl py-3.5 pl-11 pr-20 text-xs text-on-surface placeholder-on-surface-variant/70 focus:ring-2 focus:ring-primary/20 focus:border-primary/40 focus:outline-none focus:bg-surface-container-lowest resize-none transition-all no-scrollbar"
                placeholder="Type your response, talk to contact, or ask AI assistant ('Summarize this')..."
                rows={1}
                disabled={isSending}
              />

              {/* Action buttons on the right inside input */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                <button
                  type="submit"
                  disabled={!messageText.trim() || isSending}
                  className="bg-primary text-on-primary p-2 rounded-xl shadow-md hover:opacity-95 transition-all active:scale-95 disabled:opacity-30 select-none cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">send</span>
                </button>
              </div>
            </div>

            {/* Action suggestions under the input */}
            <div className="flex justify-center mt-3.5 gap-6">
              <button
                type="button"
                onClick={handleFetchSmartReplies}
                className="text-[10px] font-display font-semibold text-outline hover:text-primary transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                Suggest Smart Reply
              </button>

              <button
                type="button"
                onClick={() => setShowScheduler(true)}
                className="text-[10px] font-display font-semibold text-outline hover:text-primary transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px]">event</span>
                Schedule Sync
              </button>
            </div>

          </form>
        </div>

      </section>

      {/* Embedded Meeting Scheduler Popover */}
      {showScheduler && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <form 
            onSubmit={handleConfirmSchedule}
            className="bg-surface-container-lowest p-6 rounded-2xl shadow-xl border border-outline-variant/30 w-full max-w-sm animate-in zoom-in-95 duration-150 text-left"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-display font-bold text-sm text-on-surface flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-xl">event</span>
                Schedule Sync Call
              </h3>
              <button 
                type="button"
                onClick={() => setShowScheduler(false)}
                className="p-1 rounded-full hover:bg-surface-container-high text-outline"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <p className="text-[11px] text-on-surface-variant leading-relaxed mb-4">
              Coordinate a direct calendar sync with <strong>{selectedContact.name}</strong> to resolve final details on the campaign.
            </p>

            <div className="space-y-3 font-sans">
              <div>
                <label className="block text-[10px] font-bold text-outline uppercase tracking-wider mb-1">Proposed Date</label>
                <input 
                  type="date" 
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-3 py-1.5 text-xs focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-outline uppercase tracking-wider mb-1">Proposed Time (UTC)</label>
                <input 
                  type="time" 
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-3 py-1.5 text-xs focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <button
                type="button"
                onClick={() => setShowScheduler(false)}
                className="px-3.5 py-1.5 text-xs font-semibold text-on-surface-variant hover:bg-surface-container-low rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-primary text-on-primary hover:opacity-90 font-semibold text-xs rounded-xl shadow-xs"
              >
                Book and Notify
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
