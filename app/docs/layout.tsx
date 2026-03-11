import { source } from '@/lib/source';
import { DocsTopNav } from '@/components/docs-top-nav';
import { DocsLayoutClient } from '@/components/docs-layout-client';

export default function Layout({ children }: LayoutProps<'/docs'>) {
  return (
    <div className="sasai-docs-shell">
      <DocsTopNav />
      <DocsLayoutClient tree={source.getPageTree()}>
        {children}
      </DocsLayoutClient>
    </div>
  );
}
