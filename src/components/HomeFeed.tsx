import React, { useState, useMemo } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  MapPin, 
  ShieldCheck, 
  ShieldAlert, 
  Bot, 
  Sparkles, 
  Send, 
  TrendingUp, 
  Filter, 
  AlertTriangle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { FeedPost, PostComment, IncidentCategory, NavigationTab } from '../types';

interface HomeFeedProps {
  posts: FeedPost[];
  onLikePost: (postId: string) => void;
  onAddComment: (postId: string, commentText: string) => void;
  onSavePost: (postId: string) => void;
  onNavigateToIncidentMap: (incidentId: string) => void;
  userInteractionProfile: {
    likedCategories: Record<string, number>;
    commentedCategories: Record<string, number>;
    totalInteractions: number;
  };
}

export const HomeFeed: React.FC<HomeFeedProps> = ({
  posts,
  onLikePost,
  onAddComment,
  onSavePost,
  onNavigateToIncidentMap,
  userInteractionProfile,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'FOR_YOU' | 'ALL' | 'ICE_ALERTS' | 'LEGAL' | 'SAVED'>('FOR_YOU');
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState('');
  const [copiedPostId, setCopiedPostId] = useState<string | null>(null);

  // Algorithmic ranking logic based on tracked likes & comments
  const rankedPosts = useMemo(() => {
    let list = [...posts];

    if (selectedFilter === 'SAVED') {
      return list.filter((p) => p.userSaved);
    }

    if (selectedFilter === 'ICE_ALERTS') {
      return list.filter((p) => p.category === 'ICE_OPERATION' || p.category === 'BOUNTY_HUNTER' || p.category === 'CHECKPOINT');
    }

    if (selectedFilter === 'LEGAL') {
      return list.filter((p) => p.category === 'SAFE_ZONE' || p.category === 'LEGAL_ALERT');
    }

    if (selectedFilter === 'FOR_YOU') {
      // Score each post based on user interaction weights
      return list.sort((a, b) => {
        const scoreA = 
          (userInteractionProfile.likedCategories[a.category] || 0) * 3 +
          (userInteractionProfile.commentedCategories[a.category] || 0) * 5 +
          (a.urgency === 'URGENT' ? 10 : 0) +
          (a.userLiked ? 4 : 0);

        const scoreB = 
          (userInteractionProfile.likedCategories[b.category] || 0) * 3 +
          (userInteractionProfile.commentedCategories[b.category] || 0) * 5 +
          (b.urgency === 'URGENT' ? 10 : 0) +
          (b.userLiked ? 4 : 0);

        return scoreB - scoreA;
      });
    }

    return list;
  }, [posts, selectedFilter, userInteractionProfile]);

  const handleSendComment = (postId: string) => {
    if (!commentInput.trim()) return;
    onAddComment(postId, commentInput.trim());
    setCommentInput('');
  };

  const handleShare = (postId: string) => {
    setCopiedPostId(postId);
    navigator.clipboard?.writeText?.(window.location.href);
    setTimeout(() => setCopiedPostId(null), 2000);
  };

  const getVerificationBadge = (stamp?: FeedPost['verificationStamp']) => {
    if (!stamp) return null;
    switch (stamp.status) {
      case 'VERIFIED_REAL':
        return (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-[11px] font-mono font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>REAL ({stamp.score}%)</span>
          </div>
        );
      case 'DISPUTED_FALSE':
        return (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-950/80 border border-amber-500/50 text-amber-300 text-[11px] font-mono font-semibold">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>DISPUTED ({stamp.score}%)</span>
          </div>
        );
      case 'AI_GENERATED_DETECTED':
        return (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-950/80 border border-purple-500/50 text-purple-300 text-[11px] font-mono font-semibold">
            <Bot className="w-3.5 h-3.5 text-purple-400" />
            <span>AI GENERATED</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto pb-24 px-3 pt-3 space-y-4">
      {/* Algorithmic Discovery Banner */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-red-950/80 text-red-400 border border-red-800/50">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>Personalized Community Algorithm</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300 font-mono">Active</span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Tracking your likes & comments to surface vital safety reports in your area.
              </p>
            </div>
          </div>
        </div>

        {/* Filter Navigation Tabs (Facebook / Citizen style) */}
        <div className="flex items-center gap-1.5 mt-3 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedFilter('FOR_YOU')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
              selectedFilter === 'FOR_YOU'
                ? 'bg-red-600 text-white shadow-sm shadow-red-950 font-bold'
                : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            For You
          </button>

          <button
            onClick={() => setSelectedFilter('ALL')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              selectedFilter === 'ALL'
                ? 'bg-red-600 text-white font-bold'
                : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Recent News
          </button>

          <button
            onClick={() => setSelectedFilter('ICE_ALERTS')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1 ${
              selectedFilter === 'ICE_ALERTS'
                ? 'bg-red-600 text-white font-bold'
                : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            ICE & Patrol Alerts
          </button>

          <button
            onClick={() => setSelectedFilter('LEGAL')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              selectedFilter === 'LEGAL'
                ? 'bg-red-600 text-white font-bold'
                : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Legal Aid & Havens
          </button>

          <button
            onClick={() => setSelectedFilter('SAVED')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              selectedFilter === 'SAVED'
                ? 'bg-red-600 text-white font-bold'
                : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Saved
          </button>
        </div>
      </div>

      {/* Feed Stream */}
      <div className="space-y-4">
        {rankedPosts.map((post) => (
          <article
            key={post.id}
            id={`post-${post.id}`}
            className="bg-zinc-950 border border-zinc-800/90 rounded-2xl overflow-hidden shadow-lg hover:border-zinc-700/80 transition-all"
          >
            {/* Header: Author info, timestamp & Verification Stamp */}
            <div className="p-4 flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-10 h-10 rounded-full object-cover border border-zinc-700 shrink-0"
                />
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-bold text-sm text-zinc-100">{post.author.name}</span>
                    {post.author.roleBadge && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                        {post.author.roleBadge}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
                    <span>{post.timestamp}</span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5 text-zinc-400 truncate max-w-[180px]">
                      <MapPin className="w-3 h-3 text-red-400" />
                      {post.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Verification Stamp */}
              {getVerificationBadge(post.verificationStamp)}
            </div>

            {/* Post Content */}
            <div className="px-4 pb-3 space-y-3">
              <p className="text-sm text-zinc-200 leading-relaxed whitespace-pre-line font-normal">
                {post.content}
              </p>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs text-red-400 font-medium hover:underline cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Image Attachment (if present) */}
            {post.imageUrl && (
              <div className="relative border-y border-zinc-800/80 bg-black max-h-96 overflow-hidden">
                <img
                  src={post.imageUrl}
                  alt="Incident footage"
                  className="w-full object-cover max-h-96"
                />
                {post.incidentId && (
                  <button
                    onClick={() => onNavigateToIncidentMap(post.incidentId!)}
                    className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md text-white text-xs font-semibold border border-white/20 hover:bg-red-600 transition-all shadow-lg"
                  >
                    <MapPin className="w-3.5 h-3.5 text-red-400" />
                    <span>View on Live Radar</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}

            {/* Jump to Map Link Bar if no image */}
            {!post.imageUrl && post.incidentId && (
              <div className="px-4 pb-3">
                <button
                  onClick={() => onNavigateToIncidentMap(post.incidentId!)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-300 hover:border-red-500/50 hover:bg-zinc-900 transition-all"
                >
                  <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-red-400" />
                    <span>View pinned coordinates & safety report</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-zinc-400" />
                </button>
              </div>
            )}

            {/* Interactive Stats & Actions Bar */}
            <div className="px-4 py-2 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
              <div className="flex items-center gap-4">
                <span>{post.likesCount} people engaged</span>
                <span>•</span>
                <span>{post.commentsCount} comments</span>
              </div>
              <div className="font-mono text-[11px]">
                {post.sharesCount} shares
              </div>
            </div>

            {/* Action Buttons (Like, Comment, Share, Save) */}
            <div className="px-2 py-1 border-t border-zinc-800/60 grid grid-cols-4 gap-1 text-xs font-medium">
              <button
                id={`like-post-btn-${post.id}`}
                onClick={() => onLikePost(post.id)}
                className={`flex items-center justify-center gap-1.5 py-2 rounded-lg transition-colors ${
                  post.userLiked
                    ? 'text-red-400 font-bold bg-red-950/30'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                <Heart className={`w-4 h-4 ${post.userLiked ? 'fill-red-500 text-red-500' : ''}`} />
                <span>{post.userLiked ? 'Liked' : 'Like'}</span>
              </button>

              <button
                id={`comment-post-btn-${post.id}`}
                onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}
                className="flex items-center justify-center gap-1.5 py-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Comment</span>
              </button>

              <button
                id={`share-post-btn-${post.id}`}
                onClick={() => handleShare(post.id)}
                className="flex items-center justify-center gap-1.5 py-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span>{copiedPostId === post.id ? 'Copied!' : 'Share'}</span>
              </button>

              <button
                id={`save-post-btn-${post.id}`}
                onClick={() => onSavePost(post.id)}
                className={`flex items-center justify-center gap-1.5 py-2 rounded-lg transition-colors ${
                  post.userSaved
                    ? 'text-amber-400 font-bold bg-amber-950/30'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${post.userSaved ? 'fill-amber-400 text-amber-400' : ''}`} />
                <span>{post.userSaved ? 'Saved' : 'Save'}</span>
              </button>
            </div>

            {/* Comments Section Drawer */}
            {activeCommentPostId === post.id && (
              <div className="p-4 border-t border-zinc-800 bg-zinc-900/40 space-y-3 animate-in fade-in">
                {/* Existing Comments */}
                <div className="space-y-2.5 max-h-60 overflow-y-auto">
                  {post.comments.length === 0 ? (
                    <p className="text-xs text-zinc-400 text-center py-2">No comments yet. Be the first to share an on-ground update.</p>
                  ) : (
                    post.comments.map((comment) => (
                      <div key={comment.id} className="flex items-start gap-2.5 text-xs">
                        <img
                          src={comment.avatar}
                          alt={comment.author}
                          className="w-7 h-7 rounded-full object-cover border border-zinc-700 shrink-0"
                        />
                        <div className="flex-1 bg-zinc-900 p-2.5 rounded-xl border border-zinc-800">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-zinc-200 flex items-center gap-1">
                              {comment.author}
                              {comment.isLegalAdvisor && (
                                <span className="text-[9px] px-1 py-0.2 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded font-mono">
                                  Legal Shield
                                </span>
                              )}
                            </span>
                            <span className="text-[10px] text-zinc-400">{comment.timestamp}</span>
                          </div>
                          <p className="text-zinc-300 mt-1">{comment.text}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Input for new comment */}
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="text"
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendComment(post.id)}
                    placeholder="Write a comment or verification update..."
                    className="flex-1 px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-xs text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-red-500"
                  />
                  <button
                    id="submit-comment-btn"
                    onClick={() => handleSendComment(post.id)}
                    className="p-2 rounded-xl bg-red-600 hover:bg-red-500 text-white transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
};
