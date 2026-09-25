export interface SectionData {
  id: string;
  badge?: string;
  title: string;
  subtitle?: string;
  description: string;
  align?: "left" | "center" | "right";
  features?: {
    title: string;
    description: string;
    icon?: string;
  }[];
  actions?: {
    label: string;
    variant: "primary" | "secondary";
    actionType?: "watchAd" | "explore" | "auth" | "calculator" | "plans";
  }[];
}

export interface GlobeConfig {
  positions: {
    top: string;
    left: string;
    scale: number;
  }[];
}

export interface AdCampaign {
  id: string;
  brand: string;
  brandLogo: string;
  title: string;
  description: string;
  reward: number; // in USD
  duration: number; // in seconds
  category: "Tech" | "Crypto" | "Gaming" | "Lifestyle" | "Finance";
  impressionsLeft: number;
  videoThumb: string;
  sponsorUrl: string;
}

export interface UserSession {
  isLoggedIn: boolean;
  name: string;
  email: string;
  balance: number;
  referralCode: string;
  tier: "Free" | "Bronze" | "Gold" | "Diamond";
  adsWatchedToday: number;
  referralCount: number;
}
