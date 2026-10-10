// ============================================================================
// JEEVAN JYOTI FOUNDATION - OFFLINE CERTIFICATE & OTP CACHE SERVICE
// जीवन ज्योति फाउंडेशन - ऑफ़लाइन प्रमाण पत्र एवं OTP सत्यापन कैश सर्विस (Service Worker & LocalStorage Fallback)
// Includes Static Image & Branding Asset Cache-Busting Mechanism
// ============================================================================

import { RegisteredCertificateItem, normalizePhoneNumber } from './certificateRegistryService';

export const OFFLINE_CERT_CACHE_PREFIX = 'jjf_offline_certs_';
export const OFFLINE_PHONE_INDEX_KEY = 'jjf_offline_verified_phones_index';
export const OFFLINE_LAST_VERIFIED_PHONE_KEY = 'jjf_last_verified_phone';
export const BRANDING_CACHE_TIMESTAMP_KEY = 'jjf_branding_cache_timestamp';

/**
 * Standard list of core branding and icon assets to keep fresh via cache-busting
 */
export const CORE_BRANDING_ASSET_PATHS: readonly string[] = [
  '/logo.png',
  '/logo.svg',
  '/favicon.svg',
  '/apple-touch-icon.png',
  '/pwa-icon-192.png',
  '/pwa-icon-512.png',
  '/pwa-icon-maskable-192.png',
  '/pwa-icon-maskable-512.png',
  '/signature-shailesh-royalblue.svg',
  '/signature-shailesh-royalblue.png',
  '/signature-shailesh-overlay.svg',
  '/signature-shailesh-overlay.png'
];

export interface CachedPhoneSession {
  phone: string;
  normalizedPhone: string;
  certificates: RegisteredCertificateItem[];
  cachedAt: number; // Unix timestamp
  formattedDate: string; // "24 Aug 2026, 03:15 PM"
  recipientName?: string;
  totalCount: number;
  syncSource: 'online_synced' | 'local_generated' | 'offline_fallback';
}

export interface CachedPhoneSummary {
  phone: string;
  normalizedPhone: string;
  totalCount: number;
  recipientName?: string;
  cachedAt: number;
  formattedDate: string;
}

// In-memory fallback timestamp if localStorage is inaccessible
let inMemoryBrandingTimestamp = Date.now();

/**
 * Get the active branding cache-busting timestamp.
 * Persisted in localStorage so all tabs/windows share the same cache-busting cycle.
 */
export function getBrandingCacheBustTimestamp(): number {
  if (typeof window === 'undefined') return inMemoryBrandingTimestamp;
  try {
    const stored = localStorage.getItem(BRANDING_CACHE_TIMESTAMP_KEY);
    if (stored) {
      const parsed = parseInt(stored, 10);
      if (!isNaN(parsed) && parsed > 0) {
        return parsed;
      }
    }
    const current = Date.now();
    localStorage.setItem(BRANDING_CACHE_TIMESTAMP_KEY, current.toString());
    inMemoryBrandingTimestamp = current;
    return current;
  } catch {
    return inMemoryBrandingTimestamp;
  }
}

/**
 * Force refresh the branding cache-buster timestamp.
 * Call this whenever an administrator uploads or changes an app logo, thumbnail, or seal.
 */
export function refreshBrandingCacheBuster(): number {
  const newTimestamp = Date.now();
  inMemoryBrandingTimestamp = newTimestamp;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(BRANDING_CACHE_TIMESTAMP_KEY, newTimestamp.toString());
      window.dispatchEvent(
        new CustomEvent('jjf-branding-cache-bust-updated', {
          detail: { timestamp: newTimestamp }
        })
      );
    } catch (err) {
      console.warn('Unable to persist updated branding cache timestamp:', err);
    }
  }
  return newTimestamp;
}

/**
 * Determine if a given asset path or URL is an icon, logo, seal, or static branding asset
 */
export function isBrandingAssetUrl(url?: string | null): boolean {
  if (!url || typeof url !== 'string') return false;
  const lower = url.toLowerCase();
  return (
    lower.includes('logo') ||
    lower.includes('thumb') ||
    lower.includes('seal') ||
    lower.includes('icon') ||
    lower.includes('signature') ||
    lower.includes('favicon') ||
    lower.startsWith('/uploads/') ||
    lower.startsWith('uploads/') ||
    CORE_BRANDING_ASSET_PATHS.some((path) => lower.includes(path.toLowerCase()))
  );
}

/**
 * Cache-busting mechanism for static images and branding assets.
 * Appends a timestamp query parameter (?t=...) to icon and branding asset requests,
 * ensuring users and browsers always fetch the updated versions without stale cache locks.
 *
 * @param url The image URL or asset path
 * @param customTimestamp Optional specific timestamp override; defaults to active branding timestamp
 */
export function getCacheBustedImageUrl(url?: string | null, customTimestamp?: number): string {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  // Data URLs (base64) and Blob URLs cannot and should not have query parameters appended
  if (trimmed.startsWith('data:') || trimmed.startsWith('blob:')) {
    return trimmed;
  }

  const timestamp = customTimestamp && customTimestamp > 0 ? customTimestamp : getBrandingCacheBustTimestamp();

  try {
    // Relative URL handling (e.g. "/pwa-icon-512.png")
    if (trimmed.startsWith('/') || !trimmed.includes('://')) {
      const [pathAndQuery, hash] = trimmed.split('#');
      const [basePath, existingQuery] = pathAndQuery.split('?');
      const params = new URLSearchParams(existingQuery || '');
      params.set('t', timestamp.toString());
      const newQuery = params.toString();
      return `${basePath}?${newQuery}${hash ? `#${hash}` : ''}`;
    }

    // Absolute HTTP/HTTPS URLs
    const parsed = new URL(trimmed);
    parsed.searchParams.set('t', timestamp.toString());
    return parsed.toString();
  } catch {
    // Fallback string manipulation if URL parsing fails
    const separator = trimmed.includes('?') ? '&' : '?';
    return `${trimmed}${separator}t=${timestamp}`;
  }
}

/**
 * Convenient alias for getCacheBustedImageUrl
 */
export const cacheBustStaticAssetUrl = getCacheBustedImageUrl;

/**
 * Prefetch and cache core branding and icon assets with cache-busting timestamp
 * to ensure that browser HTTP cache and Service Worker are primed with fresh assets.
 */
export async function prefetchAndCacheBrandingAssets(additionalUrls: string[] = []): Promise<void> {
  if (typeof window === 'undefined' || typeof fetch === 'undefined') return;

  const urlsToPrefetch = Array.from(new Set([...CORE_BRANDING_ASSET_PATHS, ...additionalUrls])).filter(Boolean);
  const timestamp = getBrandingCacheBustTimestamp();

  await Promise.allSettled(
    urlsToPrefetch.map(async (rawUrl) => {
      try {
        const bustedUrl = getCacheBustedImageUrl(rawUrl, timestamp);
        await fetch(bustedUrl, {
          method: 'GET',
          cache: 'reload',
          mode: 'cors'
        });
      } catch (err) {
        console.debug('Branding asset prefetch notice for', rawUrl, err);
      }
    })
  );
}

/**
 * Format current timestamp for user display in Indian locale
 */
function getFormattedTimestamp(date: Date = new Date()): string {
  try {
    return date.toLocaleDateString('hi-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return date.toISOString().slice(0, 16);
  }
}

/**
 * Save verified certificate records for a specific phone number into persistent offline cache.
 * Automatically applies cache-busting to photo and branding asset references.
 */
export function savePhoneCertificatesToOfflineCache(
  phoneNumber: string,
  certificates: RegisteredCertificateItem[],
  syncSource: 'online_synced' | 'local_generated' | 'offline_fallback' = 'online_synced'
): CachedPhoneSession | null {
  const cleanPhone = normalizePhoneNumber(phoneNumber);
  if (!cleanPhone || cleanPhone.length < 10) return null;

  const now = new Date();
  const currentTimestamp = getBrandingCacheBustTimestamp();

  // Ensure certificates store cache-busted photo and seal references
  const sanitizedCertificates = (certificates || []).map((cert) => {
    if (cert.photoUrl && !cert.photoUrl.startsWith('data:') && !cert.photoUrl.startsWith('blob:')) {
      return {
        ...cert,
        photoUrl: getCacheBustedImageUrl(cert.photoUrl, currentTimestamp)
      };
    }
    return cert;
  });

  const session: CachedPhoneSession = {
    phone: phoneNumber,
    normalizedPhone: cleanPhone,
    certificates: sanitizedCertificates,
    cachedAt: now.getTime(),
    formattedDate: getFormattedTimestamp(now),
    recipientName: sanitizedCertificates?.[0]?.recipientName || 'सम्मानित नागरिक',
    totalCount: sanitizedCertificates?.length || 0,
    syncSource
  };

  try {
    // 1. Save specific phone cache
    const cacheKey = `${OFFLINE_CERT_CACHE_PREFIX}${cleanPhone}`;
    localStorage.setItem(cacheKey, JSON.stringify(session));

    // 2. Update verified phones index
    updateOfflinePhoneIndex({
      phone: phoneNumber,
      normalizedPhone: cleanPhone,
      totalCount: session.totalCount,
      recipientName: session.recipientName,
      cachedAt: session.cachedAt,
      formattedDate: session.formattedDate
    });

    // 3. Update last verified phone key
    localStorage.setItem(OFFLINE_LAST_VERIFIED_PHONE_KEY, cleanPhone);

    return session;
  } catch (err) {
    console.warn('Unable to persist offline certificate cache to localStorage:', err);
    return session;
  }
}

/**
 * Retrieve cached certificates for a phone number from offline storage.
 * Dynamically ensures returned certificates have cache-busted photo URLs.
 */
export function getOfflineCachedCertificates(phoneNumber: string): CachedPhoneSession | null {
  const cleanPhone = normalizePhoneNumber(phoneNumber);
  if (!cleanPhone || cleanPhone.length < 10) return null;

  try {
    const cacheKey = `${OFFLINE_CERT_CACHE_PREFIX}${cleanPhone}`;
    const raw = localStorage.getItem(cacheKey);
    if (!raw) return null;

    const parsed: CachedPhoneSession = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.certificates)) {
      const currentTimestamp = getBrandingCacheBustTimestamp();
      parsed.certificates = parsed.certificates.map((cert) => {
        if (cert.photoUrl && !cert.photoUrl.startsWith('data:') && !cert.photoUrl.startsWith('blob:')) {
          return {
            ...cert,
            photoUrl: getCacheBustedImageUrl(cert.photoUrl, currentTimestamp)
          };
        }
        return cert;
      });
      return parsed;
    }
  } catch (err) {
    console.warn('Error reading offline certificate cache for phone:', cleanPhone, err);
  }

  return null;
}

/**
 * Check if offline cache exists for a phone number
 */
export function hasOfflineCachedCertificates(phoneNumber: string): boolean {
  const cleanPhone = normalizePhoneNumber(phoneNumber);
  if (!cleanPhone) return false;
  const cacheKey = `${OFFLINE_CERT_CACHE_PREFIX}${cleanPhone}`;
  return !!localStorage.getItem(cacheKey);
}

/**
 * Get all previously verified and cached phone numbers on this device
 */
export function getAllOfflineCachedPhoneSummaries(): CachedPhoneSummary[] {
  try {
    const raw = localStorage.getItem(OFFLINE_PHONE_INDEX_KEY);
    if (!raw) return [];
    const list: CachedPhoneSummary[] = JSON.parse(raw);
    if (Array.isArray(list)) {
      return list.sort((a, b) => b.cachedAt - a.cachedAt);
    }
  } catch (err) {
    console.warn('Error reading offline phone index:', err);
  }
  return [];
}

/**
 * Internal helper to update phone index list in localStorage
 */
function updateOfflinePhoneIndex(summary: CachedPhoneSummary): void {
  try {
    const current = getAllOfflineCachedPhoneSummaries();
    const filtered = current.filter((item) => item.normalizedPhone !== summary.normalizedPhone);
    const updated = [summary, ...filtered].slice(0, 10); // Keep last 10 numbers
    localStorage.setItem(OFFLINE_PHONE_INDEX_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Error updating offline phone index:', err);
  }
}

/**
 * Remove offline cache for a specific phone number
 */
export function removeOfflinePhoneCache(phoneNumber: string): boolean {
  const cleanPhone = normalizePhoneNumber(phoneNumber);
  if (!cleanPhone) return false;

  try {
    localStorage.removeItem(`${OFFLINE_CERT_CACHE_PREFIX}${cleanPhone}`);
    const current = getAllOfflineCachedPhoneSummaries();
    const updated = current.filter((item) => item.normalizedPhone !== cleanPhone);
    localStorage.setItem(OFFLINE_PHONE_INDEX_KEY, JSON.stringify(updated));
    return true;
  } catch {
    return false;
  }
}

/**
 * Get the most recently verified phone number on this device
 */
export function getLastVerifiedPhoneNumber(): string | null {
  try {
    return localStorage.getItem(OFFLINE_LAST_VERIFIED_PHONE_KEY);
  } catch {
    return null;
  }
}

/**
 * Register Service Worker for offline PWA capabilities and certificate asset caching.
 * Appends a cache-busting timestamp version to the Service Worker registration,
 * and triggers background prefetching of core branding assets with query timestamps.
 */
export function registerCertificateServiceWorker(): void {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  const register = () => {
    const brandingTimestamp = getBrandingCacheBustTimestamp();
    // Cache-busting parameter on the service worker script itself
    const swUrl = `/sw.js?v=${brandingTimestamp}`;

    navigator.serviceWorker
      .register(swUrl, { scope: '/' })
      .then((registration) => {
        console.log('Jeevan Jyoti PWA Service Worker active with scope:', registration.scope);
        // Prefetch core branding assets in background to ensure fresh cache
        if ('requestIdleCallback' in window) {
          (window as any).requestIdleCallback(() => {
            prefetchAndCacheBrandingAssets();
          });
        } else {
          setTimeout(() => {
            prefetchAndCacheBrandingAssets();
          }, 1500);
        }
      })
      .catch((err) => {
        console.debug('Service Worker registration skipped/failed:', err);
      });
  };

  if (document.readyState === 'complete') {
    register();
  } else {
    window.addEventListener('load', register);
  }
}
