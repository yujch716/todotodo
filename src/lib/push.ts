const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY as string;

export interface PushSubscriptionKeys {
  endpoint: string;
  p256dh: string;
  auth: string;
}

// base64url -> Uint8Array (applicationServerKey 용)
const urlBase64ToUint8Array = (base64String: string): Uint8Array => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);

  return Uint8Array.from(rawData, (char) => char.charCodeAt(0));
};

export const isPushSupported = (): boolean =>
  "serviceWorker" in navigator &&
  "PushManager" in window &&
  "Notification" in window;

// iOS 는 홈 화면에 설치된 standalone 모드에서만 푸시를 지원한다
export const isStandalone = (): boolean =>
  window.matchMedia("(display-mode: standalone)").matches ||
  (window.navigator as Navigator & { standalone?: boolean }).standalone ===
    true;

export const isIos = (): boolean =>
  /iPad|iPhone|iPod/.test(navigator.userAgent) ||
  (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

const toKeys = (subscription: PushSubscription): PushSubscriptionKeys => {
  const json = subscription.toJSON();

  return {
    endpoint: json.endpoint ?? subscription.endpoint,
    p256dh: json.keys?.p256dh ?? "",
    auth: json.keys?.auth ?? "",
  };
};

export const getCurrentSubscription =
  async (): Promise<PushSubscriptionKeys | null> => {
    if (!isPushSupported()) return null;

    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    return subscription ? toKeys(subscription) : null;
  };

export const subscribeToPush = async (): Promise<PushSubscriptionKeys> => {
  const registration = await navigator.serviceWorker.ready;

  const existing = await registration.pushManager.getSubscription();
  if (existing) return toKeys(existing);

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
  });

  return toKeys(subscription);
};

export const unsubscribeFromPush =
  async (): Promise<PushSubscriptionKeys | null> => {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    if (!subscription) return null;

    const keys = toKeys(subscription);
    await subscription.unsubscribe();

    return keys;
  };
