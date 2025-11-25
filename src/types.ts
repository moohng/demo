import { LucideIcon } from 'lucide-react';

export type Language = 'en' | 'cn';

export enum CategoryType {
  FRAMEWORKS = 'Frameworks',
  UI_LIBRARIES = 'UI Libraries',
  TOOLS = 'Tools',
  LEARNING = 'Learning',
  DESIGN = 'Design',
  ICONS_FONTS = 'Icons & Fonts',
  BACKEND_SERVICES = 'Backend & DevOps',
  COMMUNITY = 'Community'
}

export interface LinkItem {
  id: string;
  title: string;
  url: string;
  description: string;
  iconName?: string; // Storing string name to map to icon component
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