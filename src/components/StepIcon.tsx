import React from 'react';
import { Target, Search, GitFork, Palette, FileText } from 'lucide-react';

interface StepIconProps {
  name: string;
  className?: string;
}

export const StepIcon: React.FC<StepIconProps> = ({ name, className = 'w-5 h-5' }) => {
  switch (name) {
    case 'target':
      return <Target className={className} strokeWidth={1.8} />;
    case 'search':
      return <Search className={className} strokeWidth={1.8} />;
    case 'flow':
      return <GitFork className={className} strokeWidth={1.8} />;
    case 'design':
      return <Palette className={className} strokeWidth={1.8} />;
    case 'ui':
      return <Palette className={className} strokeWidth={1.8} />;
    case 'presentation':
      return <FileText className={className} strokeWidth={1.8} />;
    default:
      return <Target className={className} strokeWidth={1.8} />;
  }
};
