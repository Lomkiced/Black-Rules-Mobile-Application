import { Platform, Linking } from 'react-native';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { addBreadcrumb, captureError } from './sentry';

const REVENUECAT_APPLE_KEY =
  process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY ||
  process.env.EXPO_PUBLIC_REVENUECAT_APPLE_KEY ||
  'appl_placeholder';
const REVENUECAT_GOOGLE_KEY =
  process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY ||
  process.env.EXPO_PUBLIC_REVENUECAT_GOOGLE_KEY ||
  'goog_placeholder';
const STRIPE_PAYMENT_LINK =
  process.env.EXPO_PUBLIC_STRIPE_PAYMENT_LINK ||
  'https://buy.stripe.com/test_blackrules';

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
      addBreadcrumb('billing', 'Expo Go active: Native in-app purchases safely bypassed');
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
    addBreadcrumb('billing', 'RevenueCat SDK successfully configured');
    return true;
  } catch (error) {
    captureError(error, 'RevenueCat.init');
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
    captureError(error, 'RevenueCat.checkPro');
    return false;
  }
};

/**
 * Open Stripe Web Checkout as hybrid payment fallback
 */
export const openStripeWebCheckout = async (): Promise<boolean> => {
  try {
    addBreadcrumb('billing', 'Opening Stripe Web Checkout');
    const canOpen = await Linking.canOpenURL(STRIPE_PAYMENT_LINK);
    if (canOpen) {
      await Linking.openURL(STRIPE_PAYMENT_LINK);
      return true;
    }
    return false;
  } catch (err) {
    captureError(err, 'Stripe.openCheckout');
    return false;
  }
};

/**
 * Purchase Pro Plan via StoreKit / Google Play or Stripe Web Checkout
 */
export const purchaseProPlan = async (
  plan: 'annual' | 'monthly'
): Promise<{ success: boolean; method: 'native' | 'stripe' | 'simulated'; error?: string }> => {
  addBreadcrumb('billing', `Initiating purchase for plan: ${plan}`);

  if (isExpoGo) {
    // In Expo Go, trigger Stripe web checkout or simulate purchase
    if (STRIPE_PAYMENT_LINK && !STRIPE_PAYMENT_LINK.includes('test_blackrules')) {
      await openStripeWebCheckout();
      return { success: true, method: 'stripe' };
    }
    return { success: true, method: 'simulated' };
  }

  try {
    const PurchasesModule = getPurchases();
    if (!PurchasesModule) {
      return { success: true, method: 'simulated' };
    }

    const Purchases = PurchasesModule.default || PurchasesModule;
    const offerings = await Purchases.getOfferings();

    if (offerings.current !== null && offerings.current.availablePackages.length !== 0) {
      const packageToBuy =
        plan === 'annual'
          ? offerings.current.annual || offerings.current.availablePackages[0]
          : offerings.current.monthly || offerings.current.availablePackages[0];

      if (packageToBuy) {
        const { customerInfo } = await Purchases.purchasePackage(packageToBuy);
        const hasPro = typeof customerInfo.entitlements.active[ENTITLEMENT_ID] !== 'undefined';
        return { success: hasPro, method: 'native' };
      }
    }

    // Fallback if no offerings configured in RevenueCat dashboard
    return { success: true, method: 'simulated' };
  } catch (error: any) {
    captureError(error, 'RevenueCat.purchaseProPlan');
    return { success: false, method: 'native', error: error?.message || 'PURCHASE_FAILED' };
  }
};

/**
 * Restore In-App Purchases
 */
export const restoreProPurchases = async (): Promise<{
  restored: boolean;
  isPro: boolean;
}> => {
  addBreadcrumb('billing', 'Restoring purchases');

  if (isExpoGo) {
    return { restored: true, isPro: true };
  }

  try {
    const PurchasesModule = getPurchases();
    if (!PurchasesModule) return { restored: true, isPro: false };

    const Purchases = PurchasesModule.default || PurchasesModule;
    const customerInfo = await Purchases.restorePurchases();
    const hasPro = typeof customerInfo.entitlements.active[ENTITLEMENT_ID] !== 'undefined';
    return { restored: true, isPro: hasPro };
  } catch (error) {
    captureError(error, 'RevenueCat.restorePurchases');
    return { restored: false, isPro: false };
  }
};
