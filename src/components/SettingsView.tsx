import React, { useState, useEffect } from 'react';
import { ColorTheme, THEME_PRESETS, DEFAULT_THEME } from '../utils/themeHelper';

export type AIPersona = 'executive' | 'concise' | 'diplomatic' | 'socratic';

interface SettingsViewProps {
  aiPersona: AIPersona;
  setAiPersona: (persona: AIPersona) => void;
  notificationsEnabled: boolean;
  setNotificationsEnabled: (enabled: boolean) => void;
  autoSummarize: boolean;
  setAutoSummarize: (enabled: boolean) => void;
  integrations: { [key: string]: boolean };
  toggleIntegration: (key: string) => void;
  theme: ColorTheme;
  setTheme: (theme: ColorTheme) => void;
}

export default function SettingsView({
  aiPersona,
  setAiPersona,
  notificationsEnabled,
  setNotificationsEnabled,
  autoSummarize,
  setAutoSummarize,
  integrations,
  toggleIntegration,
  theme,
  setTheme
}: SettingsViewProps) {
  
  const [localPrimary, setLocalPrimary] = useState(theme.primary);
  const [localSecondary, setLocalSecondary] = useState(theme.secondary);
  const [localAccent, setLocalAccent] = useState(theme.accent);

  useEffect(() => {
    setLocalPrimary(theme.primary);
    setLocalSecondary(theme.secondary);
    setLocalAccent(theme.accent);
  }, [theme]);

  const handleTextChange = (key: 'primary' | 'secondary' | 'accent', value: string) => {
    let val = value;
    if (val.length > 0 && !val.startsWith('#')) {
      val = '#' + val;
    }
    
    if (key === 'primary') setLocalPrimary(val);
    else if (key === 'secondary') setLocalSecondary(val);
    else if (key === 'accent') setLocalAccent(val);

    const isValidHex = /^#[0-9A-Fa-f]{6}$/.test(val) || /^#[0-9A-Fa-f]{3}$/.test(val);
    if (isValidHex) {
      setTheme({
        ...theme,
        [key]: val
      });
    }
  };

  const personaOptions = [
    {
      id: 'executive' as const,
      name: 'Executive Summary',
      desc: 'Delivers high-level summaries focusing strictly on strategic impact and quick action items.',
      icon: 'insights'
    },
    {
      id: 'concise' as const,
      name: 'Hyper-Concise',
      desc: 'Eliminates all filler text. Delivers bullet points and single-sentence answers.',
      icon: 'bolt'
    },
    {
      id: 'diplomatic' as const,
      name: 'Diplomatic & Empathetic',
      desc: 'Focuses on team sentiment, relationship preservation, and warm collaborative tones.',
      icon: 'volunteer_activism'
    },
    {
      id: 'socratic' as const,
      name: 'Socratic Helper',
      desc: 'Asks guiding questions to help you uncover strategic blind spots before final approval.',
      icon: 'psychology'
    }
  ];

  const workspaceApps = [
    { key: 'slack', name: 'Slack Workspaces', desc: 'Sync chats, channels, and threads directly into Cognitive Ease.', icon: 'forum', connectedColor: 'text-purple-600' },
    { key: 'figma', name: 'Figma Comments', desc: 'Pulls asset commentary, layouts, and style proposals.', icon: 'draw', connectedColor: 'text-red-500' },
    { key: 'gmail', name: 'Google Workspace', desc: 'Summarizes Gmail and synchronizes Calendar events seamlessly.', icon: 'mail', connectedColor: 'text-blue-500' },
    { key: 'github', name: 'GitHub Issues', desc: 'Monitors repository PRs and checklist actions.', icon: 'terminal', connectedColor: 'text-gray-800' }
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 no-scrollbar bg-surface max-w-5xl mx-auto font-sans">
      
      {/* Title */}
      <div>
        <h2 className="font-display font-extrabold text-2xl text-primary tracking-tight">System Settings</h2>
        <p className="text-xs text-on-surface-variant mt-1">Configure your message intelligence filters, connected accounts, and Cognitive AI Persona.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 columns: Main Settings */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Section 1: AI Cognitive Persona */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-6 shadow-xs">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              <div>
                <h3 className="font-display font-bold text-base text-on-surface">AI Cognitive Persona</h3>
                <p className="text-[11px] text-outline">Adjust the personality profile of the AI Assistant and contact simulations.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              {personaOptions.map((opt) => {
                const isSelected = aiPersona === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setAiPersona(opt.id)}
                    className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-primary-container/30 border-primary shadow-xs ring-1 ring-primary' 
                        : 'bg-surface-container-low/50 border-outline-variant/20 hover:bg-surface-container-low'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`material-symbols-outlined text-lg ${isSelected ? 'text-primary' : 'text-on-surface-variant'}`}>
                        {opt.icon}
                      </span>
                      <span className="text-xs font-semibold text-on-surface">{opt.name}</span>
                    </div>
                    <p className="text-[11px] text-on-surface-variant leading-relaxed">
                      {opt.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: General Preferences */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-6 shadow-xs space-y-6">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-2xl">tune</span>
              <div>
                <h3 className="font-display font-bold text-base text-on-surface">Message Preferences</h3>
                <p className="text-[11px] text-outline">Manage notifications, summaries, and local cache controls.</p>
              </div>
            </div>

            <div className="divide-y divide-outline-variant/10">
              {/* Push notifications */}
              <div className="py-4 flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-semibold text-on-surface">Real-Time Alerts</h4>
                  <p className="text-[11px] text-on-surface-variant mt-0.5">Show notifications when high-priority summaries require manual approval.</p>
                </div>
                <button
                  onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                  className={`w-11 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                    notificationsEnabled ? 'bg-primary' : 'bg-outline-variant'
                  }`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    notificationsEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}></div>
                </button>
              </div>

              {/* Automatic summarization */}
              <div className="py-4 flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-semibold text-on-surface">Proactive Digest Generation</h4>
                  <p className="text-[11px] text-on-surface-variant mt-0.5">Let Gemini analyze active threads in the background to automatically update briefs.</p>
                </div>
                <button
                  onClick={() => setAutoSummarize(!autoSummarize)}
                  className={`w-11 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                    autoSummarize ? 'bg-primary' : 'bg-outline-variant'
                  }`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    autoSummarize ? 'translate-x-5' : 'translate-x-0'
                  }`}></div>
                </button>
              </div>
            </div>
          </div>

          {/* Section 3: Color Theme Customizer */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>palette</span>
                <div>
                  <h3 className="font-display font-bold text-base text-on-surface">Color Theme Customizer</h3>
                  <p className="text-[11px] text-outline">Personalize the primary, secondary, and accent colors of your workspace.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setTheme(DEFAULT_THEME)}
                className="text-xs font-semibold text-primary hover:underline cursor-pointer flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">restart_alt</span>
                Reset Defaults
              </button>
            </div>

            {/* Presets Grid */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-outline uppercase tracking-wider">Designer presets</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {THEME_PRESETS.map((preset) => {
                  const isSelected = 
                    theme.primary.toLowerCase() === preset.colors.primary.toLowerCase() &&
                    theme.secondary.toLowerCase() === preset.colors.secondary.toLowerCase() &&
                    theme.accent.toLowerCase() === preset.colors.accent.toLowerCase();
                    
                  return (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => setTheme(preset.colors)}
                      className={`p-2.5 rounded-xl border transition-all text-left flex flex-col justify-between cursor-pointer group ${
                        isSelected 
                          ? 'border-primary bg-primary-container/10 ring-1 ring-primary shadow-xs' 
                          : 'border-outline-variant/20 hover:border-outline-variant/40 hover:bg-surface-container-low/40'
                      }`}
                    >
                      <span className="text-[11px] font-bold text-on-surface truncate mb-2 group-hover:text-primary transition-colors">
                        {preset.name}
                      </span>
                      <div className="flex gap-1">
                        <span className="w-4 h-4 rounded-full border border-white shadow-xs shrink-0" style={{ backgroundColor: preset.colors.primary }} title="Primary" />
                        <span className="w-4 h-4 rounded-full border border-white shadow-xs shrink-0" style={{ backgroundColor: preset.colors.secondary }} title="Secondary" />
                        <span className="w-4 h-4 rounded-full border border-white shadow-xs shrink-0" style={{ backgroundColor: preset.colors.accent }} title="Accent" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Fine-Grained Color Controls */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-outline uppercase tracking-wider">Fine-grain customization</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* Primary Color Control */}
                <div className="p-4 bg-surface-container-low/40 rounded-xl border border-outline-variant/15 text-left space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: theme.primary }} />
                    <span className="text-xs font-semibold text-on-surface">Primary Color</span>
                  </div>
                  <p className="text-[10px] text-on-surface-variant leading-relaxed">Used for buttons, main headings, and primary active states.</p>
                  <div className="flex items-center gap-2">
                    <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-outline-variant/40 shrink-0 cursor-pointer">
                      <input 
                        type="color" 
                        value={theme.primary} 
                        onChange={(e) => handleTextChange('primary', e.target.value)}
                        className="absolute inset-0 w-full h-full p-0 border-0 cursor-pointer opacity-0" 
                      />
                      <div className="w-full h-full border border-transparent rounded-lg" style={{ backgroundColor: theme.primary }} />
                    </div>
                    <input 
                      type="text" 
                      value={localPrimary} 
                      onChange={(e) => handleTextChange('primary', e.target.value)}
                      className="flex-1 min-w-0 bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-2 py-1 text-xs font-mono uppercase focus:ring-1 focus:ring-primary focus:outline-none"
                      placeholder="#004349"
                    />
                  </div>
                </div>

                {/* Secondary Color Control */}
                <div className="p-4 bg-surface-container-low/40 rounded-xl border border-outline-variant/15 text-left space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: theme.secondary }} />
                    <span className="text-xs font-semibold text-on-surface">Secondary Color</span>
                  </div>
                  <p className="text-[10px] text-on-surface-variant leading-relaxed">Used for status chips, secondary buttons, and priority accents.</p>
                  <div className="flex items-center gap-2">
                    <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-outline-variant/40 shrink-0 cursor-pointer">
                      <input 
                        type="color" 
                        value={theme.secondary} 
                        onChange={(e) => handleTextChange('secondary', e.target.value)}
                        className="absolute inset-0 w-full h-full p-0 border-0 cursor-pointer opacity-0" 
                      />
                      <div className="w-full h-full border border-transparent rounded-lg" style={{ backgroundColor: theme.secondary }} />
                    </div>
                    <input 
                      type="text" 
                      value={localSecondary} 
                      onChange={(e) => handleTextChange('secondary', e.target.value)}
                      className="flex-1 min-w-0 bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-2 py-1 text-xs font-mono uppercase focus:ring-1 focus:ring-primary focus:outline-none"
                      placeholder="#795900"
                    />
                  </div>
                </div>

                {/* Accent Color Control */}
                <div className="p-4 bg-surface-container-low/40 rounded-xl border border-outline-variant/15 text-left space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: theme.accent }} />
                    <span className="text-xs font-semibold text-on-surface">Accent Color</span>
                  </div>
                  <p className="text-[10px] text-on-surface-variant leading-relaxed">Used for badges, highlights, and secondary background details.</p>
                  <div className="flex items-center gap-2">
                    <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-outline-variant/40 shrink-0 cursor-pointer">
                      <input 
                        type="color" 
                        value={theme.accent} 
                        onChange={(e) => handleTextChange('accent', e.target.value)}
                        className="absolute inset-0 w-full h-full p-0 border-0 cursor-pointer opacity-0" 
                      />
                      <div className="w-full h-full border border-transparent rounded-lg" style={{ backgroundColor: theme.accent }} />
                    </div>
                    <input 
                      type="text" 
                      value={localAccent} 
                      onChange={(e) => handleTextChange('accent', e.target.value)}
                      className="flex-1 min-w-0 bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-2 py-1 text-xs font-mono uppercase focus:ring-1 focus:ring-primary focus:outline-none"
                      placeholder="#22423b"
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* Dynamic Live Preview Swatch */}
            <div className="p-4 bg-surface-container-low/50 rounded-xl border border-outline-variant/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="text-left">
                <span className="text-xs font-semibold text-on-surface">Real-Time Interactive Preview</span>
                <p className="text-[10px] text-on-surface-variant mt-0.5">Below is a live sample of how buttons, badges, and elements look under your theme.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                <button type="button" className="px-3.5 py-1.5 bg-primary text-on-primary font-display font-semibold text-[11px] rounded-lg shadow-xs hover:opacity-90 transition-opacity cursor-default">
                  Primary Button
                </button>
                <button type="button" className="px-3.5 py-1.5 bg-primary-container text-on-primary-container font-display font-semibold text-[11px] rounded-lg cursor-default">
                  Container State
                </button>
                <span className="px-2 py-0.5 text-[10px] font-bold font-mono bg-secondary text-on-secondary rounded-full">
                  Secondary Tag
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold font-mono bg-tertiary-container text-on-tertiary-container rounded-full">
                  Accent Tag
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Right column: Workspace integrations */}
        <div className="space-y-6">
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-6 shadow-xs">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-primary text-2xl">hub</span>
              <div>
                <h3 className="font-display font-bold text-base text-on-surface">Integrations</h3>
                <p className="text-[11px] text-outline">Connected workspace systems.</p>
              </div>
            </div>

            <div className="space-y-4 mt-6">
              {workspaceApps.map((app) => {
                const isConnected = !!integrations[app.key];
                return (
                  <div key={app.key} className="p-3.5 rounded-xl bg-surface-container-low/40 border border-outline-variant/15 flex items-start gap-3">
                    <span className={`material-symbols-outlined text-xl mt-0.5 ${app.connectedColor}`}>
                      {app.icon}
                    </span>
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-on-surface">{app.name}</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                          isConnected ? 'bg-emerald-100 text-emerald-800' : 'bg-surface-container-high text-on-surface-variant/70'
                        }`}>
                          {isConnected ? 'Syncing' : 'Offline'}
                        </span>
                      </div>
                      <p className="text-[10px] text-on-surface-variant/80 leading-relaxed mt-1">
                        {app.desc}
                      </p>
                      
                      <button
                        onClick={() => toggleIntegration(app.key)}
                        className={`mt-2.5 text-[10px] font-bold tracking-wide cursor-pointer flex items-center gap-1 ${
                          isConnected ? 'text-error' : 'text-primary'
                        }`}
                      >
                        {isConnected ? 'Disconnect Feed' : 'Authorize Connection'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
