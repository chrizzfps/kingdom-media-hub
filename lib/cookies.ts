export type CookieConsent = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
  version: string;
};

export const CONSENT_STORAGE_KEY = "kmh_cookie_consent_v1";
export const CURRENT_CONSENT_VERSION = "2025.1";
export const EVENT_CONSENT_UPDATED = "kmh:cookie-consent-updated";
export const EVENT_OPEN_COOKIE_SETTINGS = "kmh:open-cookie-settings";

/**
 * Reads stored user cookie consent from localStorage and falls back to document.cookie.
 */
export function getCookieConsent(): CookieConsent | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as CookieConsent;
      if (parsed && parsed.version === CURRENT_CONSENT_VERSION) {
        return parsed;
      }
    }
  } catch {
    // LocalStorage might be disabled or blocked
  }

  // Fallback check document.cookie
  try {
    const match = document.cookie.match(new RegExp(`(^|;\\s*)(${CONSENT_STORAGE_KEY})=([^;]*)`));
    if (match && match[3]) {
      const parsed = JSON.parse(decodeURIComponent(match[3])) as CookieConsent;
      if (parsed && parsed.version === CURRENT_CONSENT_VERSION) {
        return parsed;
      }
    }
  } catch {
    // Ignore cookie read errors
  }

  return null;
}

/**
 * Saves cookie consent preferences to localStorage and sets a 1-year cookie.
 */
export function setCookieConsent(preferences: {
  analytics: boolean;
  marketing: boolean;
}): CookieConsent {
  const consent: CookieConsent = {
    necessary: true,
    analytics: Boolean(preferences.analytics),
    marketing: Boolean(preferences.marketing),
    timestamp: new Date().toISOString(),
    version: CURRENT_CONSENT_VERSION,
  };

  if (typeof window !== "undefined") {
    try {
      const json = JSON.stringify(consent);
      localStorage.setItem(CONSENT_STORAGE_KEY, json);

      // Set cookie for 365 days, SameSite=Lax, Secure
      const maxAge = 60 * 60 * 24 * 365;
      const isSecure = window.location.protocol === "https:" ? "; Secure" : "";
      document.cookie = `${CONSENT_STORAGE_KEY}=${encodeURIComponent(
        json
      )}; path=/; max-age=${maxAge}; SameSite=Lax${isSecure}`;

      window.dispatchEvent(
        new CustomEvent(EVENT_CONSENT_UPDATED, { detail: consent })
      );
    } catch (err) {
      console.error("[cookies] Failed to persist consent", err);
    }
  }

  return consent;
}

/**
 * Grants full consent to all cookies.
 */
export function acceptAllCookies(): CookieConsent {
  return setCookieConsent({ analytics: true, marketing: true });
}

/**
 * Rejects non-essential cookies (only necessary remains true).
 */
export function rejectNonEssentialCookies(): CookieConsent {
  return setCookieConsent({ analytics: false, marketing: false });
}

/**
 * Triggers modal dialog to open from anywhere (e.g. footer link).
 */
export function openCookieSettings(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(EVENT_OPEN_COOKIE_SETTINGS));
  }
}
