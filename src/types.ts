export interface Message {
  id: string;
  senderName: string;
  senderAvatar: string;
  timestamp: string;
  text: string;
  isAI?: boolean;
  isMe?: boolean;
}

export interface Asset {
  id: string;
  name: string;
  type: 'pdf' | 'xlsx' | 'image';
  imageUrl: string;
  description?: string;
}

export type Priority = 'high' | 'medium' | 'low';

export interface Contact {
  id: string;
  name: string;
  role: string;
  avatar: string;
  lastMessageTime: string;
  lastMessageText: string;
  unread: boolean;
  priority: Priority;
  aiSummary: string;
  status: string;
  sentiment: string;
  resolutionTime: string;
  resolutionProgress: number; // 0 to 100
  keyInsights: string[];
  messages: Message[];
  referencedAssets: Asset[];
}

export interface Task {
  id: string;
  text: string;
  priority: Priority;
  completed: boolean;
  dueDate: string;
  contactName?: string;
}
