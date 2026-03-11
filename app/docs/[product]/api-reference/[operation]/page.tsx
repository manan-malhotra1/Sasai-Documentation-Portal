import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { DocsBody, DocsPage } from 'fumadocs-ui/layouts/docs/page';
import { ProductApiSidebar } from '@/components/product-api-sidebar';
import { APIPage, getProductApiOperation, isProductApiSlug, productApiReferences } from '@/lib/api-reference';

export default async function ProductApiOperationPage(props: {
  params: Promise<{ product: string; operation: string }>;
}) {
  const params = await props.params;
  const operation = getProductApiOperation(params.product, params.operation);

  if (!operation) {
    notFound();
  }

  return (
    <DocsPage
      className="sasai-docs-page sasai-api-docs-page"
      breadcrumb={{ enabled: false }}
      tableOfContent={{ enabled: false }}
    >
      <div className="sasai-api-shell">
        <ProductApiSidebar product={params.product} activeOperation={params.operation} />

        <DocsBody className="sasai-docs-body">
          <APIPage
            document="openapi/sasai-openapi.json"
            showTitle
            showDescription
            operations={[{ path: operation.path, method: operation.method }]}
          />
        </DocsBody>
      </div>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return Object.entries(productApiReferences).flatMap(([product, reference]) =>
    reference.operations.map((operation) => ({
      product,
      operation: operation.slug,
    })),
  );
}

export async function generateMetadata(props: {
  params: Promise<{ product: string; operation: string }>;
}): Promise<Metadata> {
  const params = await props.params;

  if (!isProductApiSlug(params.product)) {
    notFound();
  }

  const operation = getProductApiOperation(params.product, params.operation);

  if (!operation) {
    notFound();
  }

  return {
    title: operation.title,
    description: operation.description,
  };
}

