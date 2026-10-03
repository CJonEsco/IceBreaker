import { FeedPost, Conversation, RightsScript, Incident } from '../types';

export const INITIAL_INCIDENTS: Incident[] = [
  {
    id: "inc-101",
    title: "4 Unmarked Dark SUVs & Uniformed Agents Detaining Individual",
    category: "ICE_OPERATION",
    severity: "URGENT",
    locationName: "Corner of Mission St & 24th St, San Francisco, CA",
    lat: 37.7523,
    lng: -122.4182,
    description: "4 unmarked black Chevy Suburbans with tinted windows and CA Exempt federal government plates stopped a contractor van. Multiple tactical vest officers with 'POLICE / ICE' patches observed.",
    vehiclesReported: "4 Black Chevy Suburbans, CA Exempt plates #9842X",
    agentsDescription: "Tactical olive & black vests, masked, ICE ERO side patches, armed",
    detaineesCount: 1,
    badgeNumbers: "Badge identifier obscured, Unit 4-Echo reported",
    photoUrl: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&auto=format&fit=crop&q=80",
    authorName: "Maria G. (Community Monitor #44)",
    timestamp: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
    timeAgo: "18m ago",
    confirmations: 42,
    disputes: 1,
    verificationStatus: "VERIFIED_REAL",
    verificationScore: 96,
    verificationReasoning: "Multiple independent eyewitness corroborations matching CCTV feeds and consistent municipal plate taxonomy.",
    verificationFlags: ["Multi-witness corroborated", "Geotag timestamp valid", "High urgency broadcast"],
    commentsCount: 38,
    sharesCount: 89,
    userLiked: true,
  },
  {
    id: "inc-102",
    title: "Bounty Hunters in Civilian Tactical Gear Demanding IDs",
    category: "BOUNTY_HUNTER",
    severity: "HIGH",
    locationName: "Telegraph Ave & 40th St, Oakland, CA",
    lat: 37.8291,
    lng: -122.2618,
    description: "Two private bail enforcement agents in generic ballistic vests with clip-on badges demanding state ID without presenting judicial search or arrest warrants.",
    vehiclesReported: "1 Dark Grey Dodge Charger with amber dash strobes",
    agentsDescription: "Civilian attire with 'FUGITIVE RECOVERY' velcro badge, no official state crest",
    detaineesCount: 0,
    badgeNumbers: "Private Bail License #CA-88912",
    photoUrl: "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=800&auto=format&fit=crop&q=80",
    authorName: "Devon K. (Oakland Legal Shield)",
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    timeAgo: "45m ago",
    confirmations: 29,
    disputes: 0,
    verificationStatus: "VERIFIED_REAL",
    verificationScore: 92,
    verificationReasoning: "Clear description of private bail recovery apparatus lacking judicial warrant authority. Rapid neighborhood legal aid dispatched.",
    verificationFlags: ["Civilian bounty hunter alert", "Know Your Rights advised"],
    commentsCount: 22,
    sharesCount: 64,
  },
  {
    id: "inc-103",
    title: "Suspected AI Synthetic Fabricated Checkpoint Rumor",
    category: "SUSPICIOUS_PATROL",
    severity: "LOW",
    locationName: "Market St & Powell St, San Francisco, CA",
    lat: 37.7844,
    lng: -122.4080,
    description: "Report claims 50 armed cyber-drones and robotic armored personnel carriers blocking all downtown subway stations.",
    vehiclesReported: "Robotic tactical APCs (hallucinatory detail)",
    agentsDescription: "Robotics and unverified sci-fi gear",
    detaineesCount: 0,
    authorName: "Anonymous User #901",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    timeAgo: "2h ago",
    confirmations: 0,
    disputes: 67,
    verificationStatus: "AI_GENERATED_DETECTED",
    verificationScore: 12,
    verificationReasoning: "Syntactically anomalous generated prompt markers, extreme unrealistic claim profile, 100% dispute rate from on-ground verified scouts.",
    verificationFlags: ["Synthetic generation patterns detected", "Hallucinatory equipment", "Disputed by on-site monitors"],
    commentsCount: 14,
    sharesCount: 2,
  },
  {
    id: "inc-104",
    title: "Verified Community Safe Haven & Rapid Legal Aid Clinic Open",
    category: "SAFE_ZONE",
    severity: "LOW",
    locationName: "Sanctuary Community Center, 16th St, SF",
    lat: 37.7651,
    lng: -122.4221,
    description: "Pro-bono immigration attorneys, translators, and confidential family emergency contact networks available 24/7. Neutral protected space.",
    authorName: "Bay Area Civil Defense Coalition",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    timeAgo: "4h ago",
    confirmations: 85,
    disputes: 0,
    verificationStatus: "VERIFIED_REAL",
    verificationScore: 99,
    verificationReasoning: "Registered verified 501(c)(3) legal coalition partner institution.",
    verificationFlags: ["Official Safe Zone", "Legal Counsel On-Site", "Language Access"],
    commentsCount: 19,
    sharesCount: 112,
  },
  {
    id: "inc-105",
    title: "Mobile Checkpoint Screening Vehicles near Industrial Blvd",
    category: "CHECKPOINT",
    severity: "HIGH",
    locationName: "Industrial Blvd & Hesperian, Hayward, CA",
    lat: 37.6432,
    lng: -122.0815,
    description: "2 unmarked Ford F-250 pickup trucks and 1 marked cruiser conducting secondary vehicle stops off highway ramp. Requesting proof of legal status.",
    vehiclesReported: "2 White Ford F-250s, 1 Crown Victoria",
    agentsDescription: "Dark windbreakers, badge lanyards, vehicle search dogs",
    detaineesCount: 2,
    authorName: "Carlos R.",
    timestamp: new Date(Date.now() - 110 * 60 * 1000).toISOString(),
    timeAgo: "1h 50m ago",
    confirmations: 34,
    disputes: 2,
    verificationStatus: "VERIFIED_REAL",
    verificationScore: 88,
    verificationReasoning: "Corroborated by 3 separate commuter dashcam pings in adjacent quadrant.",
    verificationFlags: ["Active Checkpoint", "Detainees Reported", "Traffic Reroute Advised"],
    commentsCount: 27,
    sharesCount: 73,
  }
];

export const INITIAL_POSTS: FeedPost[] = [
  {
    id: "post-1",
    incidentId: "inc-101",
    author: {
      name: "Maria Gonzalez",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      roleBadge: "Verified Scout #44",
      verified: true,
    },
    timestamp: "18m ago",
    location: "Mission District, San Francisco",
    content: "🚨 URGENT: 4 unmarked black Chevy Suburbans currently conducting a targeted stop at 24th & Mission. We observed tactical agents taking 1 contractor into custody without showing a judicial warrant. Rapid legal defense volunteers are already on scene with cameras.",
    imageUrl: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&auto=format&fit=crop&q=80",
    category: "ICE_OPERATION",
    tags: ["ICEAlert", "MissionSF", "RapidResponse", "WarrantCheck"],
    likesCount: 142,
    commentsCount: 38,
    sharesCount: 89,
    userLiked: true,
    userSaved: false,
    verificationStamp: {
      status: "VERIFIED_REAL",
      score: 96,
      reasoning: "Multiple eyewitness video corroborations and registered license plate matches."
    },
    urgency: "URGENT",
    comments: [
      {
        id: "c-1",
        author: "Attorney Sofia Ramirez",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
        text: "Our rapid response legal defense team has arrived. Remember: You have the right to remain silent under the 5th Amendment and do not have to open your doors without a warrant signed by a JUDGE (not Form I-200/I-205).",
        timestamp: "12m ago",
        likes: 45,
        isLegalAdvisor: true
      },
      {
        id: "c-2",
        author: "Jorge L.",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        text: "Traffic rerouted through 23rd St. Everyone stay alert and keep your phones ready to record peacefully from 10+ feet away.",
        timestamp: "8m ago",
        likes: 18
      }
    ]
  },
  {
    id: "post-2",
    incidentId: "inc-102",
    author: {
      name: "Oakland Civil Defense",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      roleBadge: "Legal Aid Coalition",
      verified: true,
    },
    timestamp: "45m ago",
    location: "Telegraph Ave & 40th St, Oakland",
    content: "⚠️ ALERT: Private bounty hunters / bail recovery agents in generic vests have been spotted harassing pedestrians for IDs near Telegraph Ave. Remember: Private bail agents have NO legal authority to stop innocent bystanders or perform police stop-and-frisks.",
    imageUrl: "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=800&auto=format&fit=crop&q=80",
    category: "BOUNTY_HUNTER",
    tags: ["BountyHunterAlert", "Oakland", "CivilRights", "KnowYourRights"],
    likesCount: 98,
    commentsCount: 22,
    sharesCount: 64,
    userLiked: false,
    userSaved: true,
    verificationStamp: {
      status: "VERIFIED_REAL",
      score: 92,
      reasoning: "Private bail recovery vehicle license verified by local legal watch network."
    },
    urgency: "HIGH",
    comments: [
      {
        id: "c-3",
        author: "Marcus Chen",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
        text: "Thank you for the warning. Sharing this with our local community market vendors right now.",
        timestamp: "30m ago",
        likes: 12
      }
    ]
  },
  {
    id: "post-3",
    incidentId: "inc-104",
    author: {
      name: "Sanctuary Alliance",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
      roleBadge: "Community Center",
      verified: true,
    },
    timestamp: "3h ago",
    location: "16th St Sanctuary Hub, SF",
    content: "🕊️ Free Legal Consultation & Emergency Family Safety Planning Clinic open today until 9:00 PM. We provide 'Know Your Rights' red cards, notarized emergency child care designations, and confidential hotline numbers.",
    category: "SAFE_ZONE",
    tags: ["SafeZone", "LegalClinic", "FamilyProtection", "Resources"],
    likesCount: 230,
    commentsCount: 19,
    sharesCount: 112,
    userLiked: true,
    userSaved: true,
    verificationStamp: {
      status: "VERIFIED_REAL",
      score: 99,
      reasoning: "Registered partner organization in good standing."
    },
    urgency: "LOW",
    comments: [
      {
        id: "c-4",
        author: "Elena Rostova",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
        text: "Do you have Spanish and Mam interpreters available on-site today?",
        timestamp: "2h ago",
        likes: 8
      },
      {
        id: "c-5",
        author: "Sanctuary Alliance",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
        text: "Yes, Elena! We have certified Spanish, Mam, Arabic, and Cantonese interpreters ready.",
        timestamp: "1h 45m ago",
        likes: 24,
        isLegalAdvisor: true
      }
    ]
  },
  {
    id: "post-4",
    incidentId: "inc-103",
    author: {
      name: "Ice Breaker Intelligence Node",
      avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
      roleBadge: "Automated Fact Check",
      verified: true,
    },
    timestamp: "2h ago",
    location: "Downtown Subway Corridor",
    content: "🛡️ FACT CHECK NOTICE: A rumor circulating about '50 robotic cyber-drones sealing subway terminals' has been flagged and verified as AI-GENERATED SYNTHETIC DISINFORMATION. Our 12 ground scouts confirm normal, unobstructed transit operations.",
    category: "SUSPICIOUS_PATROL",
    tags: ["FactCheck", "DisinformationAlert", "AIAnalysis", "TransitClear"],
    likesCount: 185,
    commentsCount: 14,
    sharesCount: 42,
    userLiked: false,
    userSaved: false,
    verificationStamp: {
      status: "AI_GENERATED_DETECTED",
      score: 12,
      reasoning: "Synthetic prompt markers & 100% dispute rate by physical on-ground monitoring nodes."
    },
    urgency: "LOW",
    comments: []
  }
];

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: "conv-1",
    name: "Rapid Legal Defense Network (24/7)",
    avatar: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=150&auto=format&fit=crop&q=80",
    isGroup: true,
    isVerifiedEntity: true,
    isEncrypted: true,
    lastMessage: "Attorney Elena: If agents approach, ask 'Am I free to go?'",
    lastMessageTime: "2m ago",
    unreadCount: 2,
    participantsCount: 142,
    securityKey: "E2EE-ECDH-256-RPL-9921",
    messages: [
      {
        id: "m-1",
        senderId: "attorney-elena",
        senderName: "Attorney Elena Morales",
        text: "Standby alert for District 9. We have 4 observers documenting at Mission & 24th.",
        timestamp: "10:15 AM",
        isSelf: false,
        isEncrypted: true
      },
      {
        id: "m-2",
        senderId: "self",
        senderName: "You",
        text: "I am two blocks away near 22nd St. Are observers safe to record?",
        timestamp: "10:18 AM",
        isSelf: true,
        isEncrypted: true
      },
      {
        id: "m-3",
        senderId: "attorney-elena",
        senderName: "Attorney Elena Morales",
        text: "Yes, you have a 1st Amendment right to record public law enforcement activity in plain view. Maintain a respectful 10-foot buffer and do not physically interfere.",
        timestamp: "10:20 AM",
        isSelf: false,
        isEncrypted: true
      },
      {
        id: "m-4",
        senderId: "attorney-elena",
        senderName: "Attorney Elena Morales",
        text: "Attorney Elena: If agents approach, ask 'Am I free to go?' If they say yes, walk away calmly.",
        timestamp: "10:22 AM",
        isSelf: false,
        isEncrypted: true
      }
    ]
  },
  {
    id: "conv-2",
    name: "Family Emergency Circle",
    avatar: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=150&auto=format&fit=crop&q=80",
    isGroup: true,
    isVerifiedEntity: false,
    isEncrypted: true,
    lastMessage: "Mateo: Safe at home! Emergency SOS is armed just in case.",
    lastMessageTime: "15m ago",
    unreadCount: 0,
    participantsCount: 4,
    securityKey: "E2EE-ECDH-256-FAM-7182",
    messages: [
      {
        id: "m-5",
        senderId: "self",
        senderName: "You",
        text: "Mom, Mateo, check in please. There are reports of unmarked trucks near the commercial strip.",
        timestamp: "9:45 AM",
        isSelf: true,
        isEncrypted: true
      },
      {
        id: "m-6",
        senderId: "mom",
        senderName: "Mom",
        text: "We are inside the bakery. The doors are locked from the inside.",
        timestamp: "9:50 AM",
        isSelf: false,
        isEncrypted: true
      },
      {
        id: "m-7",
        senderId: "mateo",
        senderName: "Mateo",
        text: "Mateo: Safe at home! Emergency SOS is armed just in case.",
        timestamp: "10:05 AM",
        isSelf: false,
        isEncrypted: true
      }
    ]
  },
  {
    id: "conv-3",
    name: "David Kim (Scout Partner)",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    isGroup: false,
    isVerifiedEntity: true,
    isEncrypted: true,
    lastMessage: "I uploaded the dashcam clip to the report node.",
    lastMessageTime: "1h ago",
    unreadCount: 0,
    securityKey: "E2EE-P2P-DAVID-991A",
    messages: [
      {
        id: "m-8",
        senderId: "david",
        senderName: "David Kim",
        text: "I uploaded the dashcam clip to the report node.",
        timestamp: "9:12 AM",
        isSelf: false,
        isEncrypted: true
      }
    ]
  }
];

export const RIGHTS_SCRIPTS: RightsScript[] = [
  {
    id: "script-1",
    title: "Encountering ICE / Homeland Security Agents (Public or Street)",
    category: "ICE_STOP",
    lawBasis: "U.S. Constitution: 4th & 5th Amendments",
    summary: "Assert your right to remain silent and determine if you are legally detained.",
    teleprompterText: "“Officer, I am choosing to exercise my Fifth Amendment right to remain silent. I do not wish to answer any questions regarding my citizenship, birthplace, or immigration status. Am I free to leave, or am I being legally detained?”",
    doNotSay: "Do NOT provide false documents, lie about birthplace, or run. Simply repeat the script.",
    recommendedAction: "If they say you are free to leave, walk away calmly. If detained, do NOT answer further questions without an attorney present."
  },
  {
    id: "script-2",
    title: "Agents at Your Front Door (Demanding Entry)",
    category: "HOME_KNOCK",
    lawBasis: "4th Amendment Search Protection & Judicial Warrant Requirement",
    summary: "Do not open the door. Require a warrant signed by a JUDGE.",
    teleprompterText: "“I do not consent to you entering my home. Please slide the search warrant under the door. I need to verify that it is signed by a federal or state judge with my exact address. An ICE administrative warrant (Form I-200 or Form I-205) is NOT signed by a judge and does not give you permission to enter.”",
    doNotSay: "Do NOT open the door even a crack. Speak through the closed door or window.",
    recommendedAction: "Take a photo of any paper slid under the door. Check for a judge's signature and court name."
  },
  {
    id: "script-3",
    title: "Challenging Private Bounty Hunters & Bail Enforcement",
    category: "BOUNTY_HUNTER",
    lawBasis: "State Bail Licensing Statutes & 4th Amendment Trespass Laws",
    summary: "Bounty hunters are private citizens without police stop-and-frisk powers.",
    teleprompterText: "“You are a private bail agent or bounty hunter. You are not a sworn state or federal peace officer. You have no legal authority to stop me, search me, or demand my identification. I do not consent to this interaction. I am recording this for evidence and calling local 911 dispatch immediately to report an unlawful armed detention.”",
    doNotSay: "Do NOT physically engage or struggle; rely on audio/video evidence recording and emergency 911 dispatch.",
    recommendedAction: "Demand their private bail license number, agency name, and bail bond client contract."
  },
  {
    id: "script-4",
    title: "Vehicle Stop / Traffic Checkpoint",
    category: "VEHICLE_STOP",
    lawBasis: "4th Amendment Non-Consensual Vehicle Search Limits",
    summary: "Drivers must provide license/registration; passengers have right to remain silent.",
    teleprompterText: "“Officer, here is my driver’s license, vehicle registration, and insurance. I am exercising my right to remain silent. I do not consent to any search of my vehicle, trunk, glove box, or personal belongings.”",
    doNotSay: "Do NOT give permission to look through your trunk or bags if they ask 'Do you mind if I check?'",
    recommendedAction: "Keep your hands visible on the steering wheel. State clearly: 'I do not consent to searches.'"
  },
  {
    id: "script-5",
    title: "Asserting Your Right to Video Record Law Enforcement",
    category: "PUBLIC_RECORDING",
    lawBasis: "1st Amendment Constitutional Protections",
    summary: "Filming police and federal agents in public is protected under the 1st Amendment.",
    teleprompterText: "“Officer, I am exercising my First Amendment constitutional right to observe and video record public law enforcement activity in a public space. I am standing at a safe, non-interfering distance and will not obstruct your actions.”",
    doNotSay: "Do NOT step into the immediate physical work perimeter of the officers.",
    recommendedAction: "Stream or cloud-preserve evidence continuously via the Ice Breaker auto-sync protocol."
  }
];
