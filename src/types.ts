import { LucideIcon } from 'lucide-react';

export type Language = 'en' | 'cn';

export enum CategoryType {
  // Development
  FRAMEWORKS = 'Frameworks',
  UI_LIBRARIES = 'UI Libraries',
  TOOLS = 'Tools',
  BACKEND_SERVICES = 'Backend & DevOps',
  DOCUMENTATION = 'Documentation',
  
  // Learning
  LEARNING = 'Learning',
  TUTORIALS = 'Tutorials',
  
  // Design
  DESIGN = 'Design',
  ICONS_FONTS = 'Icons & Fonts',
  COLORS = 'Colors',
  
  // Community
  COMMUNITY = 'Community',
  NEWS = 'News',
  BLOGS = 'Blogs',
  
  // General
  PRODUCTIVITY = 'Productivity',
  ENTERTAINMENT = 'Entertainment',
  SHOPPING = 'Shopping',
  FINANCE = 'Finance'
}

export interface LinkItem {
  id: string;
  title: string;
  url: string;
  description: string;
  iconName?: string; // Storing string name to map to icon component
  visitCount?: number; // Track how many times the link was visited
  lastVisited?: number; // Timestamp of last visit
}

export interface Category {
  id: string;
  type: CategoryType;
  customName?: string; // Optional custom name, overrides default type name
  links: LinkItem[];
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

// AI Configuration
export interface AIProviderConfig {
  id: string;
  name: string;
  baseURL: string;
  icon?: string;
}

export interface AIConfig {
  providerId: string;
  apiKey: string; // Encrypted
  model: string;
  baseURL: string;
  enabled: boolean;
}

export interface UsageStats {
  daily: number;
  monthly: number;
  lastReset: number;
  totalCalls: number;
}
