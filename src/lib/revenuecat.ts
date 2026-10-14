import { Platform } from 'react-native';
import Purchases, { LOG_LEVEL } from 'react-native-purchases';

const REVENUECAT_APPLE_KEY = process.env.EXPO_PUBLIC_REVENUECAT_APPLE_KEY || 'appl_placeholder';
const REVENUECAT_GOOGLE_KEY = process.env.EXPO_PUBLIC_REVENUECAT_GOOGLE_KEY || 'goog_placeholder';

export const ENTITLEMENT_ID = 'black_rules_pro';

export const initRevenueCat = async (userId?: string): Promise<boolean> => {
  try {
    if (Platform.OS === 'web') {
      return false;
    }

    const apiKey = Platform.OS === 'ios' ? REVENUECAT_APPLE_KEY : REVENUECAT_GOOGLE_KEY;
    Purchases.setLogLevel(LOG_LEVEL.DEBUG);
    Purchases.configure({ apiKey, appUserID: userId });
    return true;
  } catch (error) {
    console.warn('[RevenueCat] Initialization skipped/failed:', error);
    return false;
  }
};

export const checkProSubscription = async (): Promise<boolean> => {
  try {
    if (Platform.OS === 'web') return false;
    const customerInfo = await Purchases.getCustomerInfo();
    return typeof customerInfo.entitlements.active[ENTITLEMENT_ID] !== 'undefined';
  } catch (error) {
    console.warn('[RevenueCat] Entitlement check failed:', error);
    return false;
  }
};
