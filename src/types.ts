export interface ProcessStep {
  id: string;
  stepNumber: string;
  title: string;
  description: string;
  iconName: 'target' | 'search' | 'flow' | 'design' | 'ui' | 'presentation';
  tag?: string;
  deliverables?: string[];
  status?: 'completed' | 'in_progress' | 'upcoming';
  duration?: string;
}

export type ViewFormat = 'grid' | 'expanded';

// Types for legacy / secondary layouts
export type CardType = 
  | 'featured'
  | 'metric'
  | 'image'
  | 'list'
  | 'media'
  | 'quote'
  | 'action';

export interface CardContent {
  title: string;
  subtitle?: string;
  badge?: string;
  badgeColor?: 'blue' | 'green' | 'purple' | 'amber' | 'rose' | 'neutral';
  metricValue?: string;
  metricLabel?: string;
  metricChange?: string;
  metricIsPositive?: boolean;
  imageUrl?: string;
  imageAlt?: string;
  listItems?: Array<{ text: string; done?: boolean; icon?: string }>;
  quoteText?: string;
  quoteAuthor?: string;
  quoteRole?: string;
  actionText?: string;
  actionActive?: boolean;
  trackTitle?: string;
  trackArtist?: string;
  accentColor?: string;
}

export interface BentoCard {
  id: string;
  type: CardType;
  title: string;
  colSpanDesktop: number;
  rowSpanDesktop: number;
  colSpanTablet?: number;
  rowSpanTablet?: number;
  content: CardContent;
}

export interface BentoLayoutPreset {
  id: string;
  name: string;
  description: string;
  tag: string;
  cards: BentoCard[];
}

export type DeviceView = 'desktop' | 'tablet' | 'mobile';
export type ViewMode = 'mockup' | 'wireframe';
export type CornerRadius = 'rounded-none' | 'rounded-lg' | 'rounded-xl' | 'rounded-2xl';
export type GridGap = 'gap-3' | 'gap-4' | 'gap-6';
