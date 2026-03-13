'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { AuthNav } from '@/components/auth-nav';
import {
  SASAI_SQUARE_LOGO_URL,
  SASAI_SQUARE_TRANSPARENT_LOGO_URL,
} from '@/lib/sasai-branding';

export function DocsTopNav() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const productLabel = (() => {
    if (pathname.startsWith('/docs/remitsense')) return 'RemitSense';
    if (pathname.startsWith('/docs/insuresense')) return 'InsureSense';
    if (pathname.startsWith('/docs/creditsense')) return 'CreditSense';
    if (pathname.startsWith('/docs/meshsense')) return 'MeshSense';
    return 'Documentation';
  })();
  const showBackArrow = pathname.startsWith('/docs/remitsense')
    || pathname.startsWith('/docs/insuresense')
    || pathname.startsWith('/docs/creditsense')
    || pathname.startsWith('/docs/meshsense');

  return (
    <header className={`sasai-docs-top-nav${isScrolled ? ' sasai-docs-top-nav-scrolled' : ''}`}>
      <div className="sasai-docs-top-nav-inner">
        {showBackArrow ? (
          <Link
            href="/"
            aria-label="Back to Sasai Products"
            className="sasai-docs-top-nav-back"
          >
            <ArrowLeft className="size-4" />
          </Link>
        ) : null}

        <Link href="/docs" className="sasai-docs-top-nav-brand">
          <Image
            src={isScrolled ? SASAI_SQUARE_LOGO_URL : SASAI_SQUARE_TRANSPARENT_LOGO_URL}
            alt="Sasai logo"
            className="h-10 w-auto"
            width={40}
            height={40}
            priority
          />
          <span className="flex flex-col leading-none">
            <span className="sasai-docs-top-nav-title">Sasai Docs</span>
            <span className="sasai-docs-top-nav-subtitle">{productLabel}</span>
          </span>
        </Link>

        {/* <nav className="sasai-docs-top-nav-links" aria-label="Docs navigation">
          <Link href="/docs" className="sasai-docs-top-nav-link">
            Documentation
          </Link>
          <Link href="/docs/getting-started" className="sasai-docs-top-nav-link">
            Getting Started
          </Link>
        </nav> */}

        <div className="sasai-docs-top-nav-actions">
          <AuthNav />
        </div>
      </div>
    </header>
  );
}

