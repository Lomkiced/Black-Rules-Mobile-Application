import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { UserState } from '../types';
import { addBreadcrumb, captureError } from './sentry';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

const isCloudConfigured =
  Boolean(SUPABASE_URL && SUPABASE_ANON_KEY && SUPABASE_URL.startsWith('https://') && !SUPABASE_URL.includes('placeholder'));

let clientInstance: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient => {
  if (!clientInstance) {
    clientInstance = createClient(
      SUPABASE_URL || 'https://placeholder.supabase.co',
      SUPABASE_ANON_KEY || 'placeholder-anon-key',
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: false,
        },
      }
    );
  }
  return clientInstance;
};

export const supabase = getSupabaseClient();

/**
 * Cloud Sync Service
 * Seamlessly syncs local AsyncStorage state to Supabase PostgreSQL cloud table
 * Falls back to Local-First Mode when Supabase credentials are not configured.
 */
export const syncUserProgressToCloud = async (
  state: Partial<UserState>
): Promise<{ synced: boolean; mode: 'cloud' | 'local' }> => {
  if (!isCloudConfigured) {
    addBreadcrumb('sync', 'Local-First Mode active (Cloud keys pending)');
    return { synced: true, mode: 'local' };
  }

  try {
    const client = getSupabaseClient();
    const payload = {
      clerk_or_auth_id: state.userId || 'usr_anonymous',
      is_pro: state.isPro ?? false,
      xp: state.xp ?? 0,
      streak: state.streakCount ?? 1,
      stats: state.stats,
      mastered_rule_ids: state.masteredRuleIds ?? [],
      bookmarked_rule_ids: state.bookmarkedRuleIds ?? [],
      updated_at: new Date().toISOString(),
    };

    const { error } = await client
      .from('profiles')
      .upsert(payload, { onConflict: 'clerk_or_auth_id' });

    if (error) {
      captureError(error, 'Supabase.syncUserProgress');
      return { synced: false, mode: 'cloud' };
    }

    addBreadcrumb('sync', 'Progress successfully synchronized to Cloud PostgreSQL');
    return { synced: true, mode: 'cloud' };
  } catch (err) {
    captureError(err, 'Supabase.syncUserProgress.exception');
    return { synced: false, mode: 'local' };
  }
};
