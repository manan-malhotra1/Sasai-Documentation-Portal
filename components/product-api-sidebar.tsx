import Link from 'next/link';
import { getProductApiReference, type ProductApiSlug } from '@/lib/api-reference';

type ProductApiSidebarProps = {
  product: ProductApiSlug;
  activeOperation?: string;
};

export function ProductApiSidebar({ product, activeOperation }: ProductApiSidebarProps) {
  const reference = getProductApiReference(product);

  if (!reference) {
    return null;
  }

  return (
    <aside className="sasai-api-side-nav" aria-label={`${reference.label} API list`}>
      <div className="sasai-api-side-nav-header">
        <p className="sasai-api-side-nav-title">API Reference</p>
        <p className="sasai-api-side-nav-copy">Choose an API to view its endpoint details.</p>
      </div>

      <nav className="sasai-api-side-nav-list">
        {reference.operations.map((operation) => {
          const href = `/docs/${product}/api-reference/${operation.slug}`;
          const isActive = activeOperation === operation.slug;

          return (
            <Link
              key={operation.slug}
              href={href}
              aria-current={isActive ? 'page' : undefined}
              className={`sasai-api-side-nav-link${isActive ? ' sasai-api-side-nav-link-active' : ''}`}
            >
              <span className="sasai-api-side-nav-link-title">{operation.title}</span>
              <span className="sasai-api-side-nav-link-method">{operation.method.toUpperCase()}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

