import React, { useState } from 'react';
import { 
  MapPin, 
  Camera, 
  Car, 
  Users, 
  ShieldAlert, 
  ShieldCheck, 
  Bot, 
  Sparkles, 
  Send, 
  AlertTriangle, 
  CheckCircle2, 
  UploadCloud, 
  Image as ImageIcon,
  FileText,
  Radio,
  Loader2
} from 'lucide-react';
import { IncidentCategory, SeverityLevel, VerificationVerdict, Incident } from '../types';
import { analyzeReportDirect, submitIncident } from '../services/api';

interface ReportSectionProps {
  onIncidentSubmitted: (newIncident: Incident) => void;
  onNavigateToMap: () => void;
}

export const ReportSection: React.FC<ReportSectionProps> = ({
  onIncidentSubmitted,
  onNavigateToMap,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<IncidentCategory>('ICE_OPERATION');
  const [severity, setSeverity] = useState<SeverityLevel>('HIGH');
  const [locationName, setLocationName] = useState('Mission St & 24th St, San Francisco, CA');
  const [description, setDescription] = useState('');
  const [vehiclesReported, setVehiclesReported] = useState('');
  const [agentsDescription, setAgentsDescription] = useState('');
  const [detaineesCount, setDetaineesCount] = useState<number>(1);
  const [badgeNumbers, setBadgeNumbers] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [authorName, setAuthorName] = useState('Community Observer');

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    verdict: VerificationVerdict;
    score: number;
    reasoning: string;
    flags: string[];
    authenticityBreakdown?: any;
  } | null>(null);

  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Quick Autofill example based on user prompt scenario: "4 trucks arresting and taking a singular individual"
  const handleAutofillExample = () => {
    setTitle('4 Unmarked Black Trucks Conducting Stop & Detaining Individual');
    setCategory('ICE_OPERATION');
    setSeverity('URGENT');
    setLocationName('Mission St & 24th St, San Francisco, CA');
    setDescription('Observed 4 unmarked dark trucks pull over a worker vehicle. Multiple armed individuals in tactical vests with ICE patches detained one individual without showing a judicial warrant.');
    setVehiclesReported('4 Black Chevy Suburbans, CA Exempt Plates');
    setAgentsDescription('Black tactical ballistic vests, masked faces, federal side emblems');
    setDetaineesCount(1);
    setBadgeNumbers('Unit 4-Bravo');
    setPhotoUrl('https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&auto=format&fit=crop&q=80');
  };

  const handleRunAnalysis = async () => {
    if (!description.trim()) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzeReportDirect({
        title: title || 'Reported Incident',
        category,
        locationName,
        description,
        vehiclesReported,
        agentsDescription,
        detaineesCount,
      });
      setVerificationResult(result);
    } catch (err) {
      console.error('Verification analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsSubmitting(true);
    try {
      const { incident } = await submitIncident({
        title,
        category,
        severity,
        locationName,
        lat: 37.7523 + (Math.random() - 0.5) * 0.02,
        lng: -122.4182 + (Math.random() - 0.5) * 0.02,
        description,
        vehiclesReported,
        agentsDescription,
        detaineesCount,
        badgeNumbers,
        photoUrl: photoUrl || undefined,
        authorName,
      });

      onIncidentSubmitted(incident);
      setSubmittedSuccess(true);
    } catch (err) {
      console.error('Submission failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submittedSuccess) {
    return (
      <div className="max-w-xl mx-auto p-6 pt-10 pb-24 text-center space-y-6 animate-in zoom-in-95">
        <div className="w-16 h-16 rounded-full bg-emerald-950 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto shadow-xl shadow-emerald-950">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-extrabold text-white">Incident Broadcasted & Verified</h2>
          <p className="text-xs text-zinc-400 max-w-md mx-auto">
            Your intelligence report has been registered, stamped by our verification engine, and broadcasted to local rapid defense observers on the Live Radar and Community Feed.
          </p>
        </div>

        {verificationResult && (
          <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 text-left space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-300">Official Verification Stamp:</span>
              <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                verificationResult.verdict === 'VERIFIED_REAL'
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-700'
                  : verificationResult.verdict === 'AI_GENERATED_DETECTED'
                  ? 'bg-purple-950 text-purple-400 border border-purple-700'
                  : 'bg-amber-950 text-amber-400 border border-amber-700'
              }`}>
                {verificationResult.verdict.replace(/_/g, ' ')} ({verificationResult.score}%)
              </span>
            </div>
            <p className="text-xs text-zinc-400">{verificationResult.reasoning}</p>
          </div>
        )}

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={onNavigateToMap}
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-950 transition-all"
          >
            View on Live Radar Map
          </button>
          <button
            onClick={() => {
              setSubmittedSuccess(false);
              setVerificationResult(null);
              setTitle('');
              setDescription('');
            }}
            className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs transition-all"
          >
            Submit Another Report
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto pb-24 px-4 pt-4 space-y-5">
      {/* Header Info */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 shadow-md flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-red-950 text-red-400 border border-red-800 font-mono text-xs font-bold">
              NODE 04
            </span>
            <h2 className="text-sm font-extrabold text-white tracking-wide">
              INTELLIGENCE & INCIDENT REPORT
            </h2>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Drop pinpoint location, describe vehicles and detainee appearances. All submissions undergo automated fact-checking for Real, False, or AI-generated patterns.
          </p>
        </div>

        <button
          id="report-example-autofill-btn"
          onClick={handleAutofillExample}
          className="shrink-0 px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] font-mono border border-zinc-700 transition-colors"
        >
          Load 4-Truck Example
        </button>
      </div>

      {/* Report Form */}
      <form onSubmit={handleSubmitReport} className="space-y-4">
        {/* Category & Urgency */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1">
              Incident Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as IncidentCategory)}
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-100 focus:outline-none focus:border-red-500"
            >
              <option value="ICE_OPERATION">ICE Operation / Homeland Security</option>
              <option value="BOUNTY_HUNTER">Bounty Hunter / Bail Agent Abuse</option>
              <option value="CHECKPOINT">Vehicle Checkpoint / Reroute</option>
              <option value="UNLAWFUL_STOP">Unlawful Stop & Questioning</option>
              <option value="SUSPICIOUS_PATROL">Suspicious Unmarked Patrol</option>
              <option value="SAFE_ZONE">Safe Haven / Rapid Legal Defense Site</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1">
              Severity Urgency Level
            </label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value as SeverityLevel)}
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-100 focus:outline-none focus:border-red-500"
            >
              <option value="URGENT">URGENT (Active Arrest / Immediate Danger)</option>
              <option value="HIGH">HIGH (Active Patrol / Stopped Vehicles)</option>
              <option value="MODERATE">MODERATE (Stationary Sighting)</option>
              <option value="LOW">LOW (Informational / Resource)</option>
            </select>
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-bold text-zinc-300 mb-1">
            Incident Headline / Summary *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. 4 Unmarked Trucks Arresting Individual at Corner"
            className="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-red-500"
            required
          />
        </div>

        {/* Location Pin Drop */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-bold text-zinc-300 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-red-400" />
              Pinpoint Location / Landmark *
            </label>
            <span className="text-[10px] font-mono text-zinc-400">GPS Auto-Geotagged</span>
          </div>
          <input
            type="text"
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
            placeholder="Address, intersection, or coordinates..."
            className="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-red-500"
            required
          />
        </div>

        {/* Vehicles & Agents Details (Prompt specific requirement) */}
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
          <div className="text-xs font-bold text-zinc-200 flex items-center gap-2">
            <Car className="w-4 h-4 text-amber-400" />
            <span>Vehicles & Tactical Identification</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                Vehicles (Count, Model, License Plates)
              </label>
              <input
                type="text"
                value={vehiclesReported}
                onChange={(e) => setVehiclesReported(e.target.value)}
                placeholder="e.g. 4 Black Chevy Suburbans, CA Exempt #9842X"
                className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                Agents / Bounty Hunters Appearance
              </label>
              <input
                type="text"
                value={agentsDescription}
                onChange={(e) => setAgentsDescription(e.target.value)}
                placeholder="e.g. Tactical vests with ICE patches, masked, armed"
                className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                Detainees Count Observed
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={detaineesCount}
                onChange={(e) => setDetaineesCount(Number(e.target.value))}
                className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                Badge / Unit ID (if visible)
              </label>
              <input
                type="text"
                value={badgeNumbers}
                onChange={(e) => setBadgeNumbers(e.target.value)}
                placeholder="e.g. Unit 4-Echo, CA Bail #8812"
                className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-red-500"
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-zinc-300 mb-1">
            Detailed Incident Description & Observations *
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what occurred chronologically: how many agents arrived, what orders were given, whether warrants were presented..."
            className="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-red-500 leading-relaxed"
            required
          />
        </div>

        {/* Photo / Footage Attachment */}
        <div className="p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-2">
          <label className="block text-xs font-bold text-zinc-300 flex items-center gap-1.5">
            <Camera className="w-3.5 h-3.5 text-zinc-400" />
            Photo / Video Footage URL or Attachment
          </label>
          <input
            type="text"
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
            placeholder="Paste image URL or dashcam clip link..."
            className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-red-500"
          />
          {photoUrl && (
            <div className="mt-2 rounded-xl overflow-hidden max-h-44 bg-black border border-zinc-800">
              <img src={photoUrl} alt="Evidence preview" className="w-full object-cover max-h-44" />
            </div>
          )}
        </div>

        {/* AI Pre-Verification Check Action */}
        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-red-400" />
              <span className="text-xs font-bold text-white">AI Intelligence Verification Engine</span>
            </div>
            <button
              type="button"
              id="run-ai-verification-btn"
              onClick={handleRunAnalysis}
              disabled={isAnalyzing || !description.trim()}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-xs font-bold text-zinc-200 border border-zinc-700 flex items-center gap-1.5 transition-all"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-red-400" />
                  <span>Auditing...</span>
                </>
              ) : (
                <>
                  <Bot className="w-3.5 h-3.5 text-purple-400" />
                  <span>Pre-Analyze Credibility</span>
                </>
              )}
            </button>
          </div>

          {/* Verification Stamp Result Box */}
          {verificationResult && (
            <div className={`p-3.5 rounded-xl border animate-in fade-in space-y-2 ${
              verificationResult.verdict === 'VERIFIED_REAL'
                ? 'bg-emerald-950/40 border-emerald-500/60'
                : verificationResult.verdict === 'AI_GENERATED_DETECTED'
                ? 'bg-purple-950/40 border-purple-500/60'
                : 'bg-amber-950/40 border-amber-500/60'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {verificationResult.verdict === 'VERIFIED_REAL' ? (
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  ) : verificationResult.verdict === 'AI_GENERATED_DETECTED' ? (
                    <Bot className="w-5 h-5 text-purple-400" />
                  ) : (
                    <ShieldAlert className="w-5 h-5 text-amber-400" />
                  )}
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Stamp: {verificationResult.verdict.replace(/_/g, ' ')}
                  </span>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-black/40 text-zinc-200">
                  Score: {verificationResult.score}/100
                </span>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed">
                {verificationResult.reasoning}
              </p>

              {verificationResult.flags && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {verificationResult.flags.map((flag, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 text-zinc-300 border border-zinc-700/50"
                    >
                      ✓ {flag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          id="submit-incident-report-btn"
          disabled={isSubmitting || !title.trim() || !description.trim()}
          className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:opacity-40 text-white font-extrabold text-sm tracking-wide shadow-xl shadow-red-950 flex items-center justify-center gap-2 transition-all"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Verifying & Broadcasting to Network...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Broadcast Verified Incident to Community</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
