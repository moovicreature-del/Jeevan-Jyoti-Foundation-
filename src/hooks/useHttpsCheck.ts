import { useState, useEffect } from 'react';

export interface HttpsCheckResult {
  /** Whether the current page is served over HTTPS */
  isHttps: boolean;
  /** Whether the current page is running on localhost/loopback address */
  isLocalhost: boolean;
  /** Whether the environment qualifies as a W3C Secure Context */
  isSecureContext: boolean;
  /** Whether the page is served over insecure HTTP on a remote domain/IP */
  isInsecureHttp: boolean;
  /** Helper function to redirect to the HTTPS version of the current URL */
  upgradeToHttps: () => void;
}

export function useHttpsCheck(): HttpsCheckResult {
  const evaluateSecurity = (): Omit<HttpsCheckResult, 'upgradeToHttps'> => {
    if (typeof window === 'undefined') {
      return {
        isHttps: true,
        isLocalhost: false,
        isSecureContext: true,
        isInsecureHttp: false,
      };
    }

    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    const isLocal =
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '[::1]' ||
      hostname.endsWith('.localhost');
    const isHttps = protocol === 'https:';

    // W3C Secure Context check with fallback
    const isSecureContext =
      typeof window.isSecureContext === 'boolean'
        ? window.isSecureContext
        : isHttps || isLocal;

    // Insecure HTTP: non-secure HTTP on non-localhost, or any http: connection
    const isInsecureHttp = protocol === 'http:' && !isLocal;

    return {
      isHttps,
      isLocalhost: isLocal,
      isSecureContext,
      isInsecureHttp,
    };
  };

  const [status, setStatus] = useState<Omit<HttpsCheckResult, 'upgradeToHttps'>>(evaluateSecurity);

  useEffect(() => {
    setStatus(evaluateSecurity());
  }, []);

  const upgradeToHttps = () => {
    if (typeof window !== 'undefined' && window.location.protocol === 'http:') {
      try {
        const secureUrl = window.location.href.replace(/^http:/, 'https:');
        window.location.href = secureUrl;
      } catch (err) {
        console.debug('[HTTPS] Redirect error:', err);
      }
    }
  };

  return {
    ...status,
    upgradeToHttps,
  };
}

export default useHttpsCheck;
