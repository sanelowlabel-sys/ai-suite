import { UserProfile, UsageGuardResult } from '../types';

export const ADMIN_EMAIL = 'sanelowlabel@gmail.com';
export const FREE_WEEKLY_LIMIT = 20;

/**
 * Checks if a user email corresponds to the Platform Owner/Admin
 */
export function isOwnerAdmin(email: string): boolean {
  return email.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase().trim();
}

/**
 * Creates or normalizes a user profile with rolling 7-day reset date
 */
export function getInitialProfile(email: string = ADMIN_EMAIL): UserProfile {
  const isAdmin = isOwnerAdmin(email);
  const now = new Date();
  const resetDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();

  return {
    id: `user_${email.replace(/[^a-zA-Z0-9]/g, '_')}`,
    email: email,
    subscription_tier: isAdmin ? 'pro' : 'free',
    subscription_status: isAdmin ? 'active' : 'inactive',
    weekly_usage_count: 0,
    usage_reset_date: resetDate,
    created_at: now.toISOString(),
    isAdmin: isAdmin,
  };
}

/**
 * Strict backend & client usage enforcement logic checking the 20 free weekly usage limit
 */
export async function enforceUsageGuard(profile: UserProfile): Promise<UsageGuardResult> {
  // Owner Admin or Pro Tier always has unlimited access
  if (profile.subscription_tier === 'pro' || profile.isAdmin || isOwnerAdmin(profile.email)) {
    return { 
      status: 'ALLOWED', 
      remaining: 'UNLIMITED' 
    };
  }

  const now = new Date();
  const resetDate = new Date(profile.usage_reset_date);

  // Check if rolling 7-day period expired
  if (now > resetDate) {
    // Reset cycle
    return { 
      status: 'ALLOWED', 
      remaining: FREE_WEEKLY_LIMIT - 1 
    };
  }

  if (profile.weekly_usage_count >= FREE_WEEKLY_LIMIT) {
    return { 
      status: 'BLOCKED', 
      message: 'You have reached your 20 free weekly uses. Upgrade to Unlimited for $10/month.',
      triggerPaywall: true,
      remaining: 0
    };
  }

  const newCount = profile.weekly_usage_count + 1;
  const remaining = Math.max(0, FREE_WEEKLY_LIMIT - newCount);

  return { 
    status: 'ALLOWED', 
    remaining 
  };
}

/**
 * Calculates human-readable time until weekly credit reset
 */
export function getTimeUntilReset(resetDateIso: string): string {
  const diff = new Date(resetDateIso).getTime() - new Date().getTime();
  if (diff <= 0) return 'Resetting now';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days > 0) return `${days}d ${hours}h remaining`;
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m remaining`;
}
