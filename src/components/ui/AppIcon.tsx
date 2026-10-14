import React from 'react';
import {
  Flame,
  CheckCircle2,
  Hourglass,
  ArrowRight,
  Timer,
  GitFork,
  Brain,
  Swords,
  Radar,
  BookOpen,
  Compass,
  Award,
  Shield,
  Scale,
  Zap,
  Eye,
  EyeOff,
  Lock,
  Key,
  Bookmark,
  Share2,
  PlayCircle,
  Fingerprint,
  Search,
  X,
  ArrowLeft,
  Sliders,
  Star,
  Check,
  XCircle,
  HelpCircle,
} from 'lucide-react-native';
import { colors } from '../../theme/tokens';

export type MaterialSymbolName =
  | 'local_fire_department'
  | 'verified'
  | 'timelapse'
  | 'arrow_forward'
  | 'timer'
  | 'account_tree'
  | 'psychology'
  | 'swords'
  | 'radar'
  | 'auto_stories'
  | 'explore'
  | 'military_tech'
  | 'shield'
  | 'balance'
  | 'bolt'
  | 'visibility'
  | 'visibility_off'
  | 'lock'
  | 'key'
  | 'bookmark'
  | 'share'
  | 'play_circle'
  | 'check_circle'
  | 'fingerprint'
  | 'search'
  | 'close'
  | 'arrow_back'
  | 'tune'
  | 'star'
  | 'check'
  | 'cancel'
  | string;

interface AppIconProps {
  name: MaterialSymbolName;
  size?: number;
  color?: string;
  filled?: boolean;
  strokeWidth?: number;
}

export const AppIcon: React.FC<AppIconProps> = ({
  name,
  size = 20,
  color = colors.primary,
  filled = false,
  strokeWidth = 2,
}) => {
  const iconProps = {
    size,
    color,
    strokeWidth,
    fill: filled ? color : 'transparent',
  };

  switch (name) {
    case 'local_fire_department':
      return <Flame {...iconProps} />;
    case 'verified':
    case 'check_circle':
      return <CheckCircle2 {...iconProps} />;
    case 'timelapse':
      return <Hourglass {...iconProps} />;
    case 'arrow_forward':
      return <ArrowRight {...iconProps} />;
    case 'timer':
      return <Timer {...iconProps} />;
    case 'account_tree':
      return <GitFork {...iconProps} />;
    case 'psychology':
      return <Brain {...iconProps} />;
    case 'swords':
      return <Swords {...iconProps} />;
    case 'radar':
      return <Radar {...iconProps} />;
    case 'auto_stories':
      return <BookOpen {...iconProps} />;
    case 'explore':
      return <Compass {...iconProps} />;
    case 'military_tech':
      return <Award {...iconProps} />;
    case 'shield':
      return <Shield {...iconProps} />;
    case 'balance':
      return <Scale {...iconProps} />;
    case 'bolt':
      return <Zap {...iconProps} />;
    case 'visibility':
      return <Eye {...iconProps} />;
    case 'visibility_off':
      return <EyeOff {...iconProps} />;
    case 'lock':
      return <Lock {...iconProps} />;
    case 'key':
      return <Key {...iconProps} />;
    case 'bookmark':
      return <Bookmark {...iconProps} />;
    case 'share':
      return <Share2 {...iconProps} />;
    case 'play_circle':
      return <PlayCircle {...iconProps} />;
    case 'fingerprint':
      return <Fingerprint {...iconProps} />;
    case 'search':
      return <Search {...iconProps} />;
    case 'close':
      return <X {...iconProps} />;
    case 'arrow_back':
      return <ArrowLeft {...iconProps} />;
    case 'tune':
      return <Sliders {...iconProps} />;
    case 'star':
      return <Star {...iconProps} />;
    case 'check':
      return <Check {...iconProps} />;
    case 'cancel':
      return <XCircle {...iconProps} />;
    default:
      return <HelpCircle {...iconProps} />;
  }
};
