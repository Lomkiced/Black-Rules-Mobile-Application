import { Platform } from 'react-native';
import Constants, { ExecutionEnvironment } from 'expo-constants';

const REVENUECAT_APPLE_KEY = process.env.EXPO_PUBLIC_REVENUECAT_APPLE_KEY || 'appl_placeholder';
const REVENUECAT_GOOGLE_KEY = process.env.EXPO_PUBLIC_REVENUECAT_GOOGLE_KEY || 'goog_placeholder';

export const ENTITLEMENT_ID = 'black_rules_pro';

// Determine if running inside Expo Go client or Web
export const isExpoGo =
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient ||
  Constants.appOwnership === 'expo' ||
  Platform.OS === 'web';

const getPurchases = () => {
  if (isExpoGo) return null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require('react-native-purchases');
  } catch {
    return null;
  }
};

export const initRevenueCat = async (userId?: string): Promise<boolean> => {
  try {
    if (isExpoGo) {
      // Safely skip native Purchases.configure in Expo Go
      return true;
    }

    const PurchasesModule = getPurchases();
    if (!PurchasesModule) return false;

    const Purchases = PurchasesModule.default || PurchasesModule;
    const LogLevel = PurchasesModule.LOG_LEVEL;

    const apiKey = Platform.OS === 'ios' ? REVENUECAT_APPLE_KEY : REVENUECAT_GOOGLE_KEY;
    if (LogLevel?.DEBUG) {
      Purchases.setLogLevel(LogLevel.DEBUG);
    }
    Purchases.configure({ apiKey, appUserID: userId });
    return true;
  } catch (error) {
    console.warn('[RevenueCat] Expo Go safe fallback active:', error);
    return false;
  }
};

export const checkProSubscription = async (): Promise<boolean> => {
  try {
    if (isExpoGo) return false;
    const PurchasesModule = getPurchases();
    if (!PurchasesModule) return false;

    const Purchases = PurchasesModule.default || PurchasesModule;
    const customerInfo = await Purchases.getCustomerInfo();
    return typeof customerInfo.entitlements.active[ENTITLEMENT_ID] !== 'undefined';
  } catch (error) {
    console.warn('[RevenueCat] Entitlement check safely bypassed:', error);
    return false;
  }
};
