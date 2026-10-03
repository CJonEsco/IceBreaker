export type NavigationTab = 'home' | 'messages' | 'map' | 'report' | 'emergency';

export type IncidentCategory = 
  | 'ICE_OPERATION' 
  | 'BOUNTY_HUNTER' 
  | 'UNLAWFUL_STOP' 
  | 'CHECKPOINT' 
  | 'SUSPICIOUS_PATROL' 
  | 'SAFE_ZONE';

export type SeverityLevel = 'URGENT' | 'HIGH' | 'MODERATE' | 'LOW';

export type VerificationVerdict = 
  | 'VERIFIED_REAL' 
  | 'DISPUTED_FALSE' 
  | 'AI_GENERATED_DETECTED' 
  | 'PENDING_COMMUNITY_REVIEW';

export interface Incident {
  id: string;
  title: string;
  category: IncidentCategory;
  severity: SeverityLevel;
  locationName: string;
  lat: number;
  lng: number;
  description: string;
  vehiclesReported?: string;
  agentsDescription?: string;
  detaineesCount?: number;
  badgeNumbers?: string;
  photoUrl?: string;
  authorName: string;
  timestamp: string;
  timeAgo: string;
  confirmations: number;
  disputes: number;
  userVoted?: 'CONFIRM' | 'DISPUTE';
  verificationStatus: VerificationVerdict;
  verificationScore: number;
  verificationReasoning: string;
  verificationFlags: string[];
  commentsCount: number;
  sharesCount: number;
  userLiked?: boolean;
}

export interface PostComment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  timestamp: string;
  likes: number;
  isLegalAdvisor?: boolean;
}

export interface FeedPost {
  id: string;
  incidentId?: string;
  author: {
    name: string;
    avatar: string;
    roleBadge?: string;
    verified: boolean;
  };
  timestamp: string;
  location: string;
  content: string;
  imageUrl?: string;
  category: IncidentCategory | 'NEWS' | 'LEGAL_ALERT' | 'COMMUNITY_UPDATE';
  tags: string[];
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  userLiked: boolean;
  userSaved: boolean;
  comments: PostComment[];
  verificationStamp?: {
    status: VerificationVerdict;
    score: number;
    reasoning: string;
  };
  urgency?: SeverityLevel;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isSelf: boolean;
  isEncrypted: boolean;
  type?: 'text' | 'location' | 'voice' | 'alert_share';
  locationData?: { lat: number; lng: number; name: string };
  audioDuration?: string;
}

export interface Conversation {
  id: string;
  name: string;
  avatar: string;
  isGroup: boolean;
  isVerifiedEntity: boolean;
  isEncrypted: boolean;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  participantsCount?: number;
  members?: string[];
  messages: ChatMessage[];
  securityKey: string;
}

export interface RightsScript {
  id: string;
  title: string;
  lawBasis: string;
  summary: string;
  teleprompterText: string;
  doNotSay: string;
  recommendedAction: string;
  category: 'ICE_STOP' | 'BOUNTY_HUNTER' | 'HOME_KNOCK' | 'VEHICLE_STOP' | 'PUBLIC_RECORDING';
}

export interface PrivacyTrackingState {
  isVocalTrackingActive: boolean; // Yellow dot
  isScreenTrackingActive: boolean; // Red dot
  lastAuditedTime: string;
  tamperAlertsCount: number;
}
