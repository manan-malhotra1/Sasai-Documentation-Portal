'use client';

import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { Folder, Node, Root } from 'fumadocs-core/page-tree';
import { docsOptions } from '@/lib/layout.shared';

type DocsLayoutClientProps = {
  children: ReactNode;
  tree: Root;
};

const productSlugs = ['remitsense', 'insuresense', 'creditsense', 'meshsense'] as const;

function isFolder(node: Node): node is Folder {
  return node.type === 'folder';
}

function getProductSlug(pathname: string) {
  return productSlugs.find((slug) => pathname === `/docs/${slug}` || pathname.startsWith(`/docs/${slug}/`));
}

function getFilteredTree(tree: Root, pathname: string): Root {
  const productSlug = getProductSlug(pathname);

  if (!productSlug) {
    return tree;
  }

  const productFolder = tree.children.find(
    (node) => isFolder(node) && node.index?.url === `/docs/${productSlug}`,
  );

  if (!productFolder) {
    return tree;
  }

  return {
    ...tree,
    children: productFolder.children,
  };
}

export function DocsLayoutClient({ children, tree }: DocsLayoutClientProps) {
  const pathname = usePathname();
  const filteredTree = useMemo(() => getFilteredTree(tree, pathname), [pathname, tree]);

  return (
    <DocsLayout
      tree={filteredTree}
      containerProps={{ className: 'sasai-docs-layout' }}
      sidebar={{
        className: 'sasai-docs-sidebar',
        defaultOpenLevel: 1,
        collapsible: false,
      }}
      {...docsOptions()}
    >
      {children}
    </DocsLayout>
  );
}

