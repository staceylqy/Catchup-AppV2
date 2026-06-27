import React, { useState, useEffect } from 'react';
import { Contact, Message, Asset, Task, Priority } from './types';
import { INITIAL_CONTACTS, INITIAL_TASKS, ME_AVATAR } from './data/mockData';
import SideNavBar from './components/SideNavBar';
import TopAppBar from './components/TopAppBar';
import InboxView from './components/InboxView';
import TaskListView from './components/TaskListView';
import SettingsView, { AIPersona } from './components/SettingsView';
import AssetModal from './components/AssetModal';
import { ColorTheme, DEFAULT_THEME, applyTheme } from './utils/themeHelper';

export default function App() {
  // Color theme customizer state
  const [theme, setTheme] = useState<ColorTheme>(() => {
    try {
      const saved = localStorage.getItem('cognitive-ease-theme');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load saved theme:', e);
    }
    return DEFAULT_THEME;
  });

  // Apply theme dynamically
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const handleSetTheme = (newTheme: ColorTheme) => {
    setTheme(newTheme);
    try {
      localStorage.setItem('cognitive-ease-theme', JSON.stringify(newTheme));
    } catch (e) {
      console.error('Failed to save theme:', e);
    }
  };

  // Navigation tab state
  const [activeTab, setActiveTab] = useState<'inbox' | 'tasks' | 'settings'>('inbox');
  
  // Search query state (filters inbox conversations)
  const [searchQuery, setSearchQuery] = useState('');

  // Primary contacts and active contact states
  const [contacts, setContacts] = useState<Contact[]>(INITIAL_CONTACTS);
  const [selectedContact, setSelectedContact] = useState<Contact>(INITIAL_CONTACTS[0]);

  // Primary task checklist states
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);

  // Asset preview states
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  // AI Persona and workspace integration preference states
  const [aiPersona, setAiPersona] = useState<AIPersona>('concise');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoSummarize, setAutoSummarize] = useState(true);
  const [integrations, setIntegrations] = useState<{ [key: string]: boolean }>({
    slack: true,
    figma: true,
    gmail: false,
    github: true
  });

  // Action loading indicators
  const [isSending, setIsSending] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);

  // Compose new contact modal state
  const [showCompose, setShowCompose] = useState(false);
  const [composeName, setComposeName] = useState('');
  const [composeRole, setComposeRole] = useState('');
  const [composeMessage, setComposeMessage] = useState('');

  // Mobile navigation responsiveness
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle selecting a conversation card and clearing unread status
  const handleSelectContact = (contact: Contact) => {
    setSelectedContact(contact);
    
    // Clear unread indicator
    setContacts(prev => prev.map(c => c.id === contact.id ? { ...c, unread: false } : c));
  };

  // Toggle checklist items
  const handleToggleTask = (taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
  };

  // Add tasks manually
  const handleAddTask = (text: string, priority: Priority, dueDate: string) => {
    const newTask: Task = {
      id: 'task_' + Date.now(),
      text,
      priority,
      completed: false,
      dueDate,
      contactName: "Manual Entry"
    };
    setTasks(prev => [newTask, ...prev]);
  };

  // Integrate toggle logic for setting integrations
  const handleToggleIntegration = (key: string) => {
    setIntegrations(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Trigger Gemini API server-side to extract tasks from the currently active conversation
  const handleExtractTasksWithGemini = async () => {
    if (isExtracting) return;
    try {
      setIsExtracting(true);
      
      // We will feed the conversation context to ask Gemini to extract any milestone
      const messagesText = selectedContact.messages.map(m => `${m.senderName}: ${m.text}`).join("\n");
      
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: selectedContact.messages,
          contactName: selectedContact.name,
          role: selectedContact.role,
          userMessage: "Can you analyze this conversation and generate a detailed checklist of exact actionable tasks? Make sure to format them as brief list items so I can tackle them."
        })
      });

      const data = await res.json();
      
      if (data.extractedTasks && data.extractedTasks.length > 0) {
        const newTasks: Task[] = data.extractedTasks.map((tText: string, idx: number) => ({
          id: `task_extracted_${Date.now()}_${idx}`,
          text: tText,
          priority: selectedContact.priority,
          completed: false,
          dueDate: "Pending action",
          contactName: selectedContact.name
        }));

        setTasks(prev => {
          // Avoid appending exact text duplicates to keep it neat
          const existingTexts = prev.map(t => t.text.toLowerCase());
          const filteredNew = newTasks.filter(t => !existingTexts.includes(t.text.toLowerCase()));
          return [...filteredNew, ...prev];
        });

        alert(`Successfully extracted ${newTasks.length} task(s) from thread using Gemini AI!`);
      } else {
        alert("Gemini scanned the conversation but found no outstanding action items at this moment.");
      }
    } catch (error) {
      console.error("Failed to extract tasks:", error);
      alert("Intelligence engine failed to synchronize tasks. Please try again.");
    } finally {
      setIsExtracting(false);
    }
  };

  // Main client-side driver to send a message and retrieve standard/roleplay answers from Express
  const handleSendMessage = async (text: string, isQuery: boolean) => {
    if (!text.trim() || isSending) return;

    // 1. Create and append the user's message card
    const userMsg: Message = {
      id: 'user_' + Date.now(),
      senderName: 'You',
      senderAvatar: ME_AVATAR,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text,
      isMe: true
    };

    const updatedMessages = [...selectedContact.messages, userMsg];

    // Build temporary updated contact representation
    const tempContact = {
      ...selectedContact,
      messages: updatedMessages,
      lastMessageText: text,
      lastMessageTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setSelectedContact(tempContact);
    setContacts(prev => prev.map(c => c.id === selectedContact.id ? tempContact : c));
    setIsSending(true);

    try {
      // 2. Call server-side chat simulation (Gemini API)
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages,
          contactName: selectedContact.name,
          role: selectedContact.role,
          userMessage: text,
          aiPersona
        })
      });

      const data = await res.json();

      // 3. Create the contact/AI reply message
      const replyMsg: Message = {
        id: 'reply_' + Date.now(),
        senderName: data.senderName || selectedContact.name,
        senderAvatar: data.isAI 
          ? "https://fonts.gstatic.com/s/i/productlogos/googleg/v6/web-24dp/logo_googleg_color_2x_web_24dp.png" // AI icon placeholder
          : selectedContact.avatar,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: data.replyText,
        isAI: data.isAI
      };

      const finalMessages = [...updatedMessages, replyMsg];

      // 4. Update the contact history state
      let updatedContact: Contact = {
        ...tempContact,
        messages: finalMessages,
        lastMessageText: replyMsg.text,
        lastMessageTime: replyMsg.timestamp
      };

      // 5. Append any auto-extracted tasks from this message
      if (data.extractedTasks && data.extractedTasks.length > 0) {
        const autoTasks: Task[] = data.extractedTasks.map((tText: string, idx: number) => ({
          id: `task_auto_${Date.now()}_${idx}`,
          text: tText,
          priority: selectedContact.priority,
          completed: false,
          dueDate: "Review requested",
          contactName: selectedContact.name
        }));
        setTasks(prev => [...autoTasks, ...prev]);
      }

      // 6. Proactively trigger background brief/summary update via `/api/summarize-thread`
      if (autoSummarize) {
        try {
          const summaryRes = await fetch('/api/summarize-thread', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              messages: finalMessages,
              contactName: selectedContact.name,
              role: selectedContact.role
            })
          });
          const summaryData = await summaryRes.json();
          
          if (summaryData && !summaryData.error) {
            // Gradually progress the tracker bar
            let newProgress = selectedContact.resolutionProgress;
            if (summaryData.status.toLowerCase().includes("resolved") || summaryData.status.toLowerCase().includes("complete")) {
              newProgress = 100;
            } else {
              newProgress = Math.min(newProgress + 5, 95);
            }

            updatedContact = {
              ...updatedContact,
              status: summaryData.status,
              sentiment: summaryData.sentiment,
              resolutionTime: summaryData.resolutionTime,
              keyInsights: summaryData.keyInsights,
              priority: summaryData.priority as Priority,
              resolutionProgress: newProgress,
              aiSummary: `AI Summary: ${summaryData.keyInsights[0] || 'Thread evaluated.'}`
            };
          }
        } catch (sumErr) {
          console.error("Background summary failed:", sumErr);
        }
      }

      // Update state arrays
      setSelectedContact(updatedContact);
      setContacts(prev => prev.map(c => c.id === selectedContact.id ? updatedContact : c));

    } catch (err) {
      console.error("Error communicating with Cognitive backend:", err);
    } finally {
      setIsSending(false);
    }
  };

  // Compose a brand new conversation
  const handleCreateCompose = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeName.trim() || !composeRole.trim() || !composeMessage.trim()) return;

    const newContactId = 'c_' + Date.now();
    
    const initialMsg: Message = {
      id: 'm_init_' + Date.now(),
      senderName: composeName,
      senderAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&q=80",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: composeMessage
    };

    const newContact: Contact = {
      id: newContactId,
      name: composeName,
      role: composeRole,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&q=80",
      lastMessageTime: initialMsg.timestamp,
      lastMessageText: initialMsg.text,
      unread: false,
      priority: 'medium',
      aiSummary: 'AI: New conversation initialized.',
      status: 'Under Evaluation',
      sentiment: 'Neutral / Information request',
      resolutionTime: 'Est. 1 day',
      resolutionProgress: 20,
      keyInsights: [
        'New external message channel opened',
        'Awaiting strategic analysis'
      ],
      messages: [initialMsg],
      referencedAssets: []
    };

    setContacts(prev => [newContact, ...prev]);
    setSelectedContact(newContact);
    
    // Reset compose states
    setComposeName('');
    setComposeRole('');
    setComposeMessage('');
    setShowCompose(false);
    setActiveTab('inbox');

    // Trigger AI Brief generation for the new contact in background
    try {
      const summaryRes = await fetch('/api/summarize-thread', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [initialMsg],
          contactName: composeName,
          role: composeRole
        })
      });
      const summaryData = await summaryRes.json();
      if (summaryData && !summaryData.error) {
        const completedContact = {
          ...newContact,
          status: summaryData.status,
          sentiment: summaryData.sentiment,
          resolutionTime: summaryData.resolutionTime,
          keyInsights: summaryData.keyInsights,
          priority: summaryData.priority as Priority,
          aiSummary: `AI Summary: ${summaryData.keyInsights[0]}`
        };
        setSelectedContact(completedContact);
        setContacts(prev => prev.map(c => c.id === newContactId ? completedContact : c));
      }
    } catch (err) {
      console.error("New contact background brief generation failed:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface font-sans text-on-surface antialiased">
      
      {/* Sidebar Navigation */}
      <SideNavBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        unreadChatsCount={contacts.filter(c => c.unread).length}
        incompleteTasksCount={tasks.filter(t => !t.completed).length}
        onNewMessageClick={() => setShowCompose(true)}
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Primary Top App Bar */}
      <TopAppBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        unreadCount={contacts.filter(c => c.unread).length}
      />

      {/* Main Content Pane */}
      <main className="pt-16 md:pl-64 h-screen flex flex-col overflow-hidden">
        {activeTab === 'inbox' && (
          <InboxView
            contacts={contacts}
            selectedContact={selectedContact}
            onSelectContact={handleSelectContact}
            searchQuery={searchQuery}
            onSendMessage={handleSendMessage}
            onAssetClick={setSelectedAsset}
            isSending={isSending}
            aiPersona={aiPersona}
          />
        )}

        {activeTab === 'tasks' && (
          <TaskListView
            tasks={tasks}
            onToggleTask={handleToggleTask}
            onAddTask={handleAddTask}
            onExtractTasksFromConversations={handleExtractTasksWithGemini}
            isExtracting={isExtracting}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            aiPersona={aiPersona}
            setAiPersona={setAiPersona}
            notificationsEnabled={notificationsEnabled}
            setNotificationsEnabled={setNotificationsEnabled}
            autoSummarize={autoSummarize}
            setAutoSummarize={setAutoSummarize}
            integrations={integrations}
            toggleIntegration={handleToggleIntegration}
            theme={theme}
            setTheme={handleSetTheme}
          />
        )}
      </main>

      {/* Immersive Asset Preview Modal */}
      {selectedAsset && (
        <AssetModal
          asset={selectedAsset}
          onClose={() => setSelectedAsset(null)}
        />
      )}

      {/* Compose New Message Modal Popover */}
      {showCompose && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <form 
            onSubmit={handleCreateCompose}
            className="bg-surface-container-lowest p-6 rounded-2xl shadow-xl border border-outline-variant/30 w-full max-w-md animate-in zoom-in-95 duration-150 text-left font-sans"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-display font-bold text-sm text-on-surface flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-xl">add_comment</span>
                New Communication Channel
              </h3>
              <button 
                type="button"
                onClick={() => setShowCompose(false)}
                className="p-1 rounded-full hover:bg-surface-container-high text-outline"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-outline uppercase tracking-wider mb-1">Contact Name</label>
                <input 
                  type="text" 
                  required
                  value={composeName}
                  onChange={(e) => setComposeName(e.target.value)}
                  placeholder="e.g. Elena Rostova"
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-primary/20 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-outline uppercase tracking-wider mb-1">Business Role</label>
                <input 
                  type="text" 
                  required
                  value={composeRole}
                  onChange={(e) => setComposeRole(e.target.value)}
                  placeholder="e.g. Lead Designer"
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-primary/20 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-outline uppercase tracking-wider mb-1">Initial Incoming Message</label>
                <textarea 
                  required
                  rows={3}
                  value={composeMessage}
                  onChange={(e) => setComposeMessage(e.target.value)}
                  placeholder="Type the message that this person has sent to you..."
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-primary/20 focus:outline-none resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <button
                type="button"
                onClick={() => setShowCompose(false)}
                className="px-4 py-2 text-xs font-semibold text-on-surface-variant hover:bg-surface-container-low rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-on-primary hover:opacity-90 font-semibold text-xs rounded-xl shadow-xs active:scale-95 transition-transform"
              >
                Establish Channel
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
