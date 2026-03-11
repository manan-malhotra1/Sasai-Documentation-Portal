import { getPageImage, source } from '@/lib/source';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/docs/page';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/mdx-components';
import type { Metadata } from 'next';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { LLMCopyButton, ViewOptions } from '@/components/ai/page-actions';
import { gitConfig } from '@/lib/layout.shared';
import Link from 'next/link';

function formatLabel(value: string) {
  return value
    .split('-')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
}

export default async function Page(props: PageProps<'/docs/[[...slug]]'>) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const hasGithubSource = gitConfig.user !== 'fuma-nama' || gitConfig.repo !== 'fumadocs';
  const breadcrumbItems =
    page.slugs.length === 0
      ? [{ label: 'Documentation', href: '/docs' }]
      : [
          { label: 'Documentation', href: '/docs' },
          ...page.slugs.slice(0, -1).map((slug, index) => ({
            label: formatLabel(slug),
            href: `/docs/${page.slugs.slice(0, index + 1).join('/')}`,
          })),
          { label: page.data.title, href: page.url },
        ];

  return (
    <DocsPage
      toc={page.data.toc}
      full={page.data.full}
      className="sasai-docs-page"
      breadcrumb={{ enabled: false }}
      // tableOfContent={{
      //   header: (
      //     <div className="sasai-toc-card">
      //       <p className="sasai-toc-card-label">Need a quick scan?</p>
      //       <p className="sasai-toc-card-text">
      //         Use the sections below to jump to setup, examples, and best practices.
      //       </p>
      //     </div>
      //   ),
      // }}
    >
      <div className="sasai-docs-hero">
        <nav className="sasai-breadcrumb" aria-label="Breadcrumb">
          {breadcrumbItems.map((item, index) => {
            const isCurrent = index === breadcrumbItems.length - 1;

            return (
              <span key={`${item.href}-${index}`} className="sasai-breadcrumb-item">
                {isCurrent ? (
                  <span className="sasai-breadcrumb-current">{item.label}</span>
                ) : (
                  <Link href={item.href} className="sasai-breadcrumb-link">
                    {item.label}
                  </Link>
                )}
                {!isCurrent ? <span className="sasai-breadcrumb-separator">/</span> : null}
              </span>
            );
          })}
        </nav>
        <DocsTitle className="sasai-docs-title">{page.data.title}</DocsTitle>
        <DocsDescription className="sasai-page-description sasai-docs-description">
          {page.data.description}
        </DocsDescription>
        <div className="sasai-page-actions">
          <LLMCopyButton markdownUrl={`${page.url}.mdx`} />
          <ViewOptions
            markdownUrl={`${page.url}.mdx`}
            githubUrl={
              hasGithubSource
                ? `https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/content/docs/${page.path}`
                : undefined
            }
          />
        </div>
      </div>
      <DocsBody className="sasai-docs-body">
        <MDX
          components={getMDXComponents({
            // this allows you to link to other pages with relative file paths
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: PageProps<'/docs/[[...slug]]'>): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      images: getPageImage(page).url,
    },
  };
}
