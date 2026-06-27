import React, { useState } from 'react';
import { Task, Priority } from '../types';

interface TaskListViewProps {
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  onAddTask: (text: string, priority: Priority, dueDate: string, contactName?: string) => void;
  onExtractTasksFromConversations: () => Promise<void>;
  isExtracting: boolean;
}

export default function TaskListView({
  tasks,
  onToggleTask,
  onAddTask,
  onExtractTasksFromConversations,
  isExtracting
}: TaskListViewProps) {
  
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [newText, setNewText] = useState('');
  const [newPriority, setNewPriority] = useState<Priority>('medium');
  const [newDueDate, setNewDueDate] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'pending') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;
    
    onAddTask(
      newText, 
      newPriority, 
      newDueDate.trim() || 'No due date'
    );
    
    // Reset form
    setNewText('');
    setNewPriority('medium');
    setNewDueDate('');
    setIsAdding(false);
  };

  const getPriorityBadgeClass = (priority: Priority) => {
    switch (priority) {
      case 'high': return 'bg-error-container text-on-error-container';
      case 'medium': return 'bg-secondary-container text-on-secondary-container';
      case 'low': return 'bg-primary-container/20 text-primary';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 no-scrollbar bg-surface max-w-5xl mx-auto font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-extrabold text-2xl text-primary tracking-tight">Extracted Action Items</h2>
          <p className="text-xs text-on-surface-variant mt-1">Checklist of tasks compiled dynamically from incoming threads and AI analysis.</p>
        </div>

        {/* AI Action Trigger */}
        <button
          onClick={onExtractTasksFromConversations}
          disabled={isExtracting}
          className="flex items-center justify-center gap-2 bg-primary text-on-primary hover:opacity-95 font-display text-xs font-semibold py-2.5 px-4 rounded-xl cursor-pointer disabled:opacity-50 select-none shadow-xs transition-all active:scale-95 whitespace-nowrap self-start sm:self-auto"
        >
          <span className={`material-symbols-outlined text-[18px] ${isExtracting ? 'animate-spin' : ''}`} style={{ fontVariationSettings: "'FILL' 1" }}>
            {isExtracting ? 'sync' : 'auto_awesome'}
          </span>
          {isExtracting ? 'Extracting via Gemini...' : 'Extract Tasks with Gemini'}
        </button>
      </div>

      {/* Task Filters + Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-surface-container-low/40 p-4 rounded-2xl border border-outline-variant/15">
        <div className="flex gap-1.5 bg-surface-container rounded-full p-1 border border-outline-variant/10">
          {(['all', 'pending', 'completed'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setFilter(mode)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full capitalize select-none cursor-pointer transition-all ${
                filter === mode
                  ? 'bg-on-surface text-surface shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-1.5 text-xs font-bold text-primary hover:opacity-80 select-none cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">
            {isAdding ? 'close' : 'add'}
          </span>
          {isAdding ? 'Cancel Manual Input' : 'Add Manual Task'}
        </button>
      </div>

      {/* Add Task Form (In-line expansion) */}
      {isAdding && (
        <form 
          onSubmit={handleSubmit}
          className="p-5 rounded-2xl bg-surface-container-lowest border border-primary/20 shadow-md space-y-4 animate-in slide-in-from-top-4 duration-200"
        >
          <h3 className="text-xs font-bold text-on-surface font-display">New Action Item</h3>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            
            {/* Task Description text */}
            <div className="md:col-span-6">
              <label className="block text-[10px] font-bold text-outline uppercase tracking-wider mb-1">Task Action</label>
              <input 
                type="text"
                required
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                placeholder="e.g. Approve budget shift for Project Zenith"
                className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-2 text-xs focus:ring-2 focus:ring-primary/20 focus:outline-none"
              />
            </div>

            {/* Priority selection */}
            <div className="md:col-span-3">
              <label className="block text-[10px] font-bold text-outline uppercase tracking-wider mb-1">Priority</label>
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as Priority)}
                className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-2 text-xs focus:ring-2 focus:ring-primary/20 focus:outline-none"
              >
                <option value="high">🔥 High</option>
                <option value="medium">⚡ Medium</option>
                <option value="low">🌱 Low</option>
              </select>
            </div>

            {/* Due date text */}
            <div className="md:col-span-3">
              <label className="block text-[10px] font-bold text-outline uppercase tracking-wider mb-1">Due Date</label>
              <input 
                type="text"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                placeholder="e.g. 5:00 PM Today"
                className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-2 text-xs focus:ring-2 focus:ring-primary/20 focus:outline-none"
              />
            </div>

          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-1.5 rounded-xl text-xs font-semibold text-on-surface-variant hover:bg-surface-container-low select-none cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-primary text-on-primary hover:opacity-90 rounded-xl text-xs font-semibold select-none cursor-pointer shadow-xs active:scale-95 transition-transform"
            >
              Add Task
            </button>
          </div>
        </form>
      )}

      {/* Task List container */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 shadow-sm overflow-hidden divide-y divide-outline-variant/10">
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center space-y-3">
            <span className="material-symbols-outlined text-[48px] text-outline/50">checklist</span>
            <div className="max-w-md">
              <p className="text-sm font-semibold text-on-surface">No tasks found</p>
              <p className="text-xs text-on-surface-variant/80 leading-relaxed mt-1">
                {filter === 'all' 
                  ? "Great job! All your action items are resolved. Use the AI generator at the top right to check for new hidden tasks inside your threads."
                  : `You have no tasks matching the '${filter}' filter.`}
              </p>
            </div>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`p-4.5 flex items-start gap-4 transition-all duration-200 priority-${task.priority} ${
                task.completed ? 'bg-surface-container-low/20 opacity-70' : 'bg-surface-container-lowest'
              }`}
            >
              {/* Checkbox button */}
              <button
                onClick={() => onToggleTask(task.id)}
                className={`flex-shrink-0 w-5.5 h-5.5 rounded-md border flex items-center justify-center transition-all cursor-pointer ${
                  task.completed
                    ? 'bg-primary border-primary text-on-primary'
                    : 'border-outline hover:border-primary bg-surface-container'
                }`}
              >
                {task.completed && (
                  <span className="material-symbols-outlined text-[16px] font-bold">check</span>
                )}
              </button>

              {/* Task Text & Metadata */}
              <div className="flex-1 min-w-0">
                <p className={`text-xs text-on-surface leading-relaxed font-sans ${task.completed ? 'line-through text-on-surface-variant/50' : 'font-medium'}`}>
                  {task.text}
                </p>
                
                <div className="flex items-center gap-3 mt-2">
                  {/* Priority Pill */}
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${getPriorityBadgeClass(task.priority)}`}>
                    {task.priority}
                  </span>

                  {/* Due Date */}
                  <span className="text-[10px] text-outline flex items-center gap-1 font-mono">
                    <span className="material-symbols-outlined text-[13px]">calendar_today</span>
                    {task.dueDate}
                  </span>

                  {/* Sourced Contact */}
                  {task.contactName && (
                    <span className="text-[10px] text-outline flex items-center gap-1 font-display">
                      <span className="material-symbols-outlined text-[13px]">person_outline</span>
                      Sourced: {task.contactName}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
