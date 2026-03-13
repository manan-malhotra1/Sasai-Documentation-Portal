'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';

export function AuthNav() {
  const router = useRouter();
  const { isLoggedIn, logout } = useAuth();

  if (!isLoggedIn) {
    return (
      <Link
        href="/login"
        className="sasai-auth-nav-button"
      >
        Login
      </Link>
    );
  }

  return (
    <div className="sasai-auth-nav">
      <Link
        href="/docs/api-documentation"
        className="sasai-auth-nav-link"
      >
        API References
      </Link>
      <button
        type="button"
        onClick={() => {
          logout();
          router.push('/docs');
          router.refresh();
        }}
        className="sasai-auth-nav-button"
      >
        Logout
      </button>
    </div>
  );
}

