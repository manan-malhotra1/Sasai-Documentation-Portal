import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { DocsPage } from 'fumadocs-ui/layouts/docs/page';
import { ProductApiSidebar } from '@/components/product-api-sidebar';
import { getProductApiReference, isProductApiSlug, productApiReferences } from '@/lib/api-reference';

export default async function ProductApiReferencePage(props: {
  params: Promise<{ product: string }>;
}) {
  const params = await props.params;
  const reference = getProductApiReference(params.product);

  if (!reference) {
    notFound();
  }

  return (
    <DocsPage
      className="sasai-docs-page sasai-api-docs-page"
      breadcrumb={{ enabled: false }}
      tableOfContent={{ enabled: false }}
    >
      <div className="sasai-api-shell">
        <ProductApiSidebar product={params.product} />

        <div>
          <div className="sasai-docs-hero">
            <h1 className="sasai-docs-title">{reference.title}</h1>
            <p className="sasai-page-description sasai-docs-description">{reference.description}</p>
          </div>

          <section className="sasai-api-reference-grid" aria-label={`${reference.label} API operations`}>
            {reference.operations.map((operation) => (
              <Link
                key={operation.slug}
                href={`/docs/${params.product}/api-reference/${operation.slug}`}
                className="sasai-home-card"
              >
                <span className="sasai-api-reference-method">{operation.method.toUpperCase()}</span>
                <h2 className="sasai-home-card-title">{operation.title}</h2>
                <p className="sasai-home-card-copy">{operation.description}</p>
              </Link>
            ))}
          </section>
        </div>
      </div>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return Object.keys(productApiReferences).map((product) => ({ product }));
}

export async function generateMetadata(props: {
  params: Promise<{ product: string }>;
}): Promise<Metadata> {
  const params = await props.params;

  if (!isProductApiSlug(params.product)) {
    notFound();
  }

  const reference = productApiReferences[params.product];

  return {
    title: reference.title,
    description: reference.description,
  };
}

