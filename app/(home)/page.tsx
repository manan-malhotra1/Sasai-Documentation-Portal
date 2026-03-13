import Link from 'next/link';
import Image from 'next/image';
import { SASAI_SQUARE_LOGO_URL } from '@/lib/sasai-branding';

const productCards = [
  {
    title: 'RemitSense',
    description:
      'Remittance hub platform enabling upstream and downstream integrations with remittance providers.',
    href: '/docs/remitsense',
  },
  {
    title: 'InsureSense',
    description: 'Insurance APIs for policy issuance, premium payments, and claims orchestration.',
    href: '/docs/insuresense',
  },
  {
    title: 'CreditSense',
    description: 'Loan product APIs for eligibility, credit scoring, disbursement, and repayments.',
    href: '/docs/creditsense',
  },
  {
    title: 'MeshSense',
    description: 'Orchestration layer for integrations with MNOs, banks, and remittance networks.',
    href: '/docs/meshsense',
  },
] as const;

export default function HomePage() {
  return (
    <main className="sasai-home">
      <section className="sasai-home-hero">
        <div>
          <div className="sasai-home-brand">
            <Image
              src={SASAI_SQUARE_LOGO_URL}
              alt="Sasai logo"
              className="h-10 w-auto"
              width={40}
              height={40}
              priority
            />
            <span className="sasai-home-brand-text">Sasai Docs</span>
          </div>
          <h1 className="sasai-home-title sasai-home-title-products">Sasai Products</h1>
          <p className="sasai-home-copy">
            Sasai offers a suite of developer products for remittances, insurance, credit, and
            partner integrations. Start by choosing the product that matches your use case.
          </p>
        </div>
      </section>

      <section className="sasai-home-grid" aria-label="Sasai product cards">
        {productCards.map((card) => (
          <article key={card.title} className="sasai-home-card">
            <h2 className="sasai-home-card-title">{card.title}</h2>
            <p className="sasai-home-card-copy">{card.description}</p>
            <Link href={card.href} className="sasai-home-card-link">
              Know more
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}
