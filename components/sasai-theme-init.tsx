'use client';

import { useEffect } from 'react';
import { SASAI_BRANDING_THEME_JS_URL } from '@/lib/sasai-branding';

type SasaiThemeModule = {
  init?: (options?: {
    injectFonts?: boolean;
    injectCssVariables?: boolean;
    overrides?: Record<string, string>;
  }) => unknown;
};

declare global {
  interface Window {
    SasaiBrand?: SasaiThemeModule;
  }
}

export function SasaiThemeInit() {
  useEffect(() => {
    let cancelled = false;
    const scriptId = 'sasai-branding-theme-script';

    const applyTheme = () => {
      if (cancelled) return;

      window.SasaiBrand?.init?.({
        injectFonts: false,
        injectCssVariables: true,
      });
    };

    const existingScript = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (existingScript) {
      if (window.SasaiBrand) {
        applyTheme();
      } else {
        existingScript.addEventListener('load', applyTheme, { once: true });
      }
    } else {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = SASAI_BRANDING_THEME_JS_URL;
      script.async = true;
      script.addEventListener('load', applyTheme, { once: true });
      document.head.appendChild(script);
    }

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}

