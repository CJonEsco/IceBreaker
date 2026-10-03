/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  NavigationTab, 
  Incident, 
  FeedPost, 
  Conversation, 
  PrivacyTrackingState 
} from './types';
import { 
  INITIAL_INCIDENTS, 
  INITIAL_POSTS, 
  INITIAL_CONVERSATIONS 
} from './data/mockData';
import { fetchIncidents, voteIncident } from './services/api';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { HomeFeed } from './components/HomeFeed';
import { MessagingHub } from './components/MessagingHub';
import { CitizenMap } from './components/CitizenMap';
import { ReportSection } from './components/ReportSection';
import { EmergencySOS } from './components/EmergencySOS';
import { PrivacyShieldModal } from './components/PrivacyShieldModal';
import { TermsModal } from './components/TermsModal';
import { PushNotificationToast } from './components/PushNotificationToast';

export default function App() {
  // Navigation: 1) home, 2) messages, 3) map (middle prominent), 4) report, 5) emergency (far right)
  const [currentTab, setCurrentTab] = useState<NavigationTab>('map');
  
  // Incidents and Posts
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
  const [posts, setPosts] = useState<FeedPost[]>(INITIAL_POSTS);
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);

  // Algorithmic tracking state (tracks user likes, comments, and topics to rank feed)
  const [userInteractionProfile, setUserInteractionProfile] = useState<{
    likedCategories: Record<string, number>;
    commentedCategories: Record<string, number>;
    totalInteractions: number;
  }>({
    likedCategories: { ICE_OPERATION: 4, BOUNTY_HUNTER: 2, SAFE_ZONE: 3 },
    commentedCategories: { ICE_OPERATION: 2, SAFE_ZONE: 1 },
    totalInteractions: 12,
  });

  // Privacy Tracking Sentinel (Apple-style Dot: Yellow for vocal/mic, Red for screen, Gone for safe)
  const [privacyState, setPrivacyState] = useState<PrivacyTrackingState>({
    isVocalTrackingActive: false,
    isScreenTrackingActive: false,
    lastAuditedTime: new Date().toLocaleTimeString(),
    tamperAlertsCount: 0,
  });

  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Push Notification state
  const [activeNotification, setActiveNotification] = useState<{
    id: string;
    title: string;
    message: string;
    incidentId?: string;
    severity?: string;
    timestamp: string;
  } | null>(null);

  // Check onboarding terms acceptance on mount
  useEffect(() => {
    const accepted = localStorage.getItem('ice_breaker_terms_accepted');
    if (!accepted) {
      setShowTermsModal(true);
    } else {
      setTermsAccepted(true);
    }
  }, []);

  // Fetch initial incidents from backend API
  useEffect(() => {
    async function loadData() {
      try {
        const remoteIncidents = await fetchIncidents();
        if (remoteIncidents && remoteIncidents.length > 0) {
          setIncidents(remoteIncidents);
        }
      } catch (e) {
        console.warn('Fallback to local incidents:', e);
      }
    }
    loadData();
  }, []);

  // Simulated Push Notification arriving after 6 seconds to demonstrate the live Citizen alert capability
  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveNotification({
        id: 'push-1',
        title: '🚨 ICE Operation Spotted in Mission District',
        message: '4 Unmarked Black SUVs and tactical officers active near 24th & Mission St. Stay alert.',
        incidentId: 'inc-101',
        severity: 'URGENT',
        timestamp: 'Just now',
      });
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  const handleAcceptTerms = () => {
    localStorage.setItem('ice_breaker_terms_accepted', 'true');
    setTermsAccepted(true);
    setShowTermsModal(false);
  };

  // Like a post and update the recommendation algorithm
  const handleLikePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const nextLiked = !post.userLiked;
          const delta = nextLiked ? 1 : -1;

          // Track in algorithmic profile
          setUserInteractionProfile((profile) => ({
            ...profile,
            likedCategories: {
              ...profile.likedCategories,
              [post.category]: Math.max(0, (profile.likedCategories[post.category] || 0) + delta),
            },
            totalInteractions: profile.totalInteractions + (nextLiked ? 1 : 0),
          }));

          return {
            ...post,
            userLiked: nextLiked,
            likesCount: post.likesCount + delta,
          };
        }
        return post;
      })
    );
  };

  // Add a comment to a post and update the recommendation algorithm
  const handleAddComment = (postId: string, commentText: string) => {
    const targetPost = posts.find((p) => p.id === postId);
    if (!targetPost) return;

    const newComment = {
      id: `c-${Date.now()}`,
      author: 'You (Citizen Observer)',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      text: commentText,
      timestamp: 'Just now',
      likes: 0,
    };

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            commentsCount: post.commentsCount + 1,
            comments: [...post.comments, newComment],
          };
        }
        return post;
      })
    );

    // Update algorithmic feedback weight
    setUserInteractionProfile((profile) => ({
      ...profile,
      commentedCategories: {
        ...profile.commentedCategories,
        [targetPost.category]: (profile.commentedCategories[targetPost.category] || 0) + 1,
      },
      totalInteractions: profile.totalInteractions + 1,
    }));
  };

  const handleSavePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, userSaved: !p.userSaved } : p))
    );
  };

  // Accuracy Verification voting (Confirm vs Dispute)
  const handleVoteIncident = async (incidentId: string, type: 'CONFIRM' | 'DISPUTE') => {
    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id === incidentId) {
          if (inc.userVoted === type) return inc; // already voted

          const newConfirmations = inc.confirmations + (type === 'CONFIRM' ? 1 : 0);
          const newDisputes = inc.disputes + (type === 'DISPUTE' ? 1 : 0);

          return {
            ...inc,
            confirmations: newConfirmations,
            disputes: newDisputes,
            userVoted: type,
          };
        }
        return inc;
      })
    );

    // Sync to backend
    await voteIncident(incidentId, type);
  };

  // Incident submitted from Report Section (Button 4)
  const handleIncidentSubmitted = (newIncident: Incident) => {
    setIncidents((prev) => [newIncident, ...prev]);

    // Also auto-generate a feed post on Button 1
    const newPost: FeedPost = {
      id: `post-${Date.now()}`,
      incidentId: newIncident.id,
      author: {
        name: newIncident.authorName,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        roleBadge: 'Community Scout',
        verified: true,
      },
      timestamp: 'Just now',
      location: newIncident.locationName,
      content: `🚨 ALERT: ${newIncident.title}. ${newIncident.description}`,
      imageUrl: newIncident.photoUrl,
      category: newIncident.category,
      tags: ['ReportedIncident', newIncident.category.replace(/_/g, '')],
      likesCount: 1,
      commentsCount: 0,
      sharesCount: 1,
      userLiked: false,
      userSaved: false,
      verificationStamp: {
        status: newIncident.verificationStatus,
        score: newIncident.verificationScore,
        reasoning: newIncident.verificationReasoning,
      },
      urgency: newIncident.severity,
      comments: [],
    };

    setPosts((prev) => [newPost, ...prev]);
  };

  // Messaging send handler
  const handleSendMessage = (
    conversationId: string,
    text: string,
    type: 'text' | 'voice' | 'location' = 'text'
  ) => {
    const newMsg = {
      id: `msg-${Date.now()}`,
      senderId: 'self',
      senderName: 'You',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSelf: true,
      isEncrypted: true,
      type,
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          return {
            ...c,
            lastMessage: text,
            lastMessageTime: 'Just now',
            messages: [...c.messages, newMsg],
          };
        }
        return c;
      })
    );
  };

  const handleNewConversation = (name: string, isGroup: boolean) => {
    const newConv: Conversation = {
      id: `conv-${Date.now()}`,
      name,
      avatar: isGroup
        ? 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      isGroup,
      isVerifiedEntity: false,
      isEncrypted: true,
      lastMessage: 'Secure channel initialized.',
      lastMessageTime: 'Just now',
      unreadCount: 0,
      participantsCount: isGroup ? 2 : 1,
      securityKey: `E2EE-ECDH-${Date.now().toString(36).toUpperCase()}`,
      messages: [
        {
          id: `init-${Date.now()}`,
          senderId: 'system',
          senderName: 'Ice Breaker Sentinel',
          text: '🔒 End-to-End Encrypted Tunnel Established. Keys verified locally.',
          timestamp: 'Just now',
          isSelf: false,
          isEncrypted: true,
        },
      ],
    };

    setConversations((prev) => [newConv, ...prev]);
  };

  const handleNavigateToIncidentMap = (incidentId: string) => {
    setSelectedIncidentId(incidentId);
    setCurrentTab('map');
  };

  const handleNavigateToHomeFeed = (incidentId?: string) => {
    setCurrentTab('home');
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans antialiased selection:bg-red-600 selection:text-white">
      {/* Top Application Header with Apple-Style Privacy Sentinel */}
      <Header
        currentTab={currentTab}
        privacyState={privacyState}
        onOpenPrivacyModal={() => setShowPrivacyModal(true)}
        unreadAlertsCount={3}
        onNavigateToTab={(tab) => setCurrentTab(tab)}
      />

      {/* Push Notification Toast */}
      <PushNotificationToast
        notification={activeNotification}
        onDismiss={() => setActiveNotification(null)}
        onViewIncident={(id) => handleNavigateToIncidentMap(id)}
      />

      {/* Main Content Area: 5 Regions */}
      <main className="flex-1 w-full max-w-5xl mx-auto">
        {/* 1) Far Left: Home Community Feed (Facebook Style with Algorithmic Suggestions) */}
        {currentTab === 'home' && (
          <HomeFeed
            posts={posts}
            onLikePost={handleLikePost}
            onAddComment={handleAddComment}
            onSavePost={handleSavePost}
            onNavigateToIncidentMap={handleNavigateToIncidentMap}
            userInteractionProfile={userInteractionProfile}
          />
        )}

        {/* 2) Second: Messaging Hub (Encrypted Comms) */}
        {currentTab === 'messages' && (
          <MessagingHub
            conversations={conversations}
            onSendMessage={handleSendMessage}
            onNewConversation={handleNewConversation}
            onNavigateToMap={() => setCurrentTab('map')}
          />
        )}

        {/* 3) Third: Slightly Bigger Middle Button - Citizen Layout Interactive Map */}
        {currentTab === 'map' && (
          <CitizenMap
            incidents={incidents}
            selectedIncidentId={selectedIncidentId}
            onSelectIncident={(inc) => setSelectedIncidentId(inc.id)}
            onVoteIncident={handleVoteIncident}
            onNavigateToHomeFeed={handleNavigateToHomeFeed}
            onNavigateToReport={() => setCurrentTab('report')}
          />
        )}

        {/* 4) Fourth: Report & Intelligence Gathering Section */}
        {currentTab === 'report' && (
          <ReportSection
            onIncidentSubmitted={handleIncidentSubmitted}
            onNavigateToMap={() => setCurrentTab('map')}
          />
        )}

        {/* 5) Fifth: Emergency SOS Command (Most Crucial Far-Right Button) */}
        {currentTab === 'emergency' && (
          <EmergencySOS onOpenTerms={() => setShowTermsModal(true)} />
        )}
      </main>

      {/* Fixed Bottom Navigation (5 Core Buttons) */}
      <Navigation
        currentTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        unreadMessagesCount={conversations.reduce((acc, c) => acc + c.unreadCount, 0)}
      />

      {/* Privacy Sentinel & Hardware Monitor Modal */}
      <PrivacyShieldModal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
        privacyState={privacyState}
        setPrivacyState={setPrivacyState}
      />

      {/* Initial Terms & Conditions Acceptance Modal */}
      <TermsModal
        isOpen={showTermsModal}
        onAccept={handleAcceptTerms}
        onClose={() => setShowTermsModal(false)}
        canDismiss={termsAccepted}
      />
    </div>
  );
}
