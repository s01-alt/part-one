import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, type LegalSection } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "The rules for buying, selling and taking part on Part One.",
};

const ul = "list-disc pl-5 flex flex-col gap-1.5";

const sections: LegalSection[] = [
  {
    id: "about",
    title: "About these terms",
    body: (
      <>
        <p>
          These Terms of Use (&quot;Terms&quot;) are an agreement between you and [Company legal name] (&quot;Part
          One&quot;, &quot;we&quot;, &quot;us&quot;), RC number [RC number], [Registered address]. By using Part One
          you agree to these Terms and our <Link href="/privacy" className="underline">Privacy Policy</Link>.
        </p>
        <p>You must be at least [18] years old to create an account or buy on Part One.</p>
      </>
    ),
  },
  {
    id: "marketplace",
    title: "How the marketplace works",
    body: (
      <>
        <p>
          Part One is a marketplace. Products are listed and sold by independent brands (&quot;Sellers&quot;) that we
          have approved. When you buy a product, your contract for that product is with the Seller. Part One provides
          the platform, collects payment on the Seller&apos;s behalf and handles refunds as described below.
        </p>
        <p>
          One checkout can include products from several Sellers. Your order is then split into a separate order for
          each Seller, and each Seller ships its items separately.
        </p>
      </>
    ),
  },
  {
    id: "accounts",
    title: "Your account",
    body: (
      <ul className={ul}>
        <li>You can browse without an account. You need an account to buy, comment, review, like, save, repost or follow.</li>
        <li>You sign in with Google. Keep access to your Google account secure — you are responsible for activity on your Part One account.</li>
        <li>Give accurate delivery details. Sellers are not responsible for failed deliveries caused by wrong details.</li>
      </ul>
    ),
  },
  {
    id: "prices",
    title: "Prices, VAT and delivery fees",
    body: (
      <ul className={ul}>
        <li>All prices are in Nigerian naira (NGN).</li>
        <li>Value Added Tax (VAT) at 7.5% is added to the item price at checkout.</li>
        <li>Each Seller sets its own delivery fee. You pay one delivery fee per Seller in your order.</li>
        <li>You see the full total, including VAT and delivery fees, before you pay.</li>
      </ul>
    ),
  },
  {
    id: "payment",
    title: "Payment and order confirmation",
    body: (
      <>
        <p>
          Payments are processed by Paystack. Your order is confirmed only when Part One receives your payment. Items
          are not reserved while they are in your cart or during checkout.
        </p>
        <p>
          If an item sells out before your payment is received, we will [refund that item in full to your original
          payment method]. [Decision pending — see D-012.]
        </p>
      </>
    ),
  },
  {
    id: "delivery",
    title: "Delivery",
    body: (
      <p>
        Each Seller packs and ships its own items and updates the order status (Processing, Shipped, Delivered). You
        can follow these updates in your orders. Delivery times are set by the Seller and shown where available.
      </p>
    ),
  },
  {
    id: "cancellations",
    title: "Cancellations",
    body: (
      <p>
        You can cancel an order [before the Seller marks it as Shipped]. If you cancel in time, you receive a refund
        of [the full amount paid for that Seller&apos;s order]. Sellers cannot cancel orders themselves; if a Seller
        cannot fulfil an order, they must contact Part One. [Decision pending — see D-013.]
      </p>
    ),
  },
  {
    id: "refunds",
    title: "Returns and refunds",
    body: (
      <ul className={ul}>
        <li>Returns are handled by the Seller. Contact the Seller through your order to start a return. [Return window: X days after delivery.]</li>
        <li>When a return or refund is approved, Part One refunds the item price and the VAT on it to your original payment method.</li>
        <li>Delivery fees are not refundable. The delivery fee is kept by the Seller.</li>
        <li>Refunds can take [X] business days to appear, depending on your bank.</li>
      </ul>
    ),
  },
  {
    id: "community",
    title: "Reviews, comments and community rules",
    body: (
      <>
        <p>You can review a product only after your order for it has been delivered.</p>
        <p>When you post comments, reviews or reposts, you must not:</p>
        <ul className={ul}>
          <li>post content that is abusive, hateful, threatening, sexually explicit or illegal;</li>
          <li>post spam, fake reviews or misleading information;</li>
          <li>share other people&apos;s personal information;</li>
          <li>infringe anyone&apos;s intellectual property.</li>
        </ul>
        <p>
          You keep ownership of what you post, but you give Part One a non-exclusive, royalty-free licence to display
          it on Part One. You can report products, reviews and comments. We may remove content and suspend accounts
          that break these rules.
        </p>
      </>
    ),
  },
  {
    id: "sellers",
    title: "Additional terms for Sellers",
    body: (
      <>
        <ul className={ul}>
          <li>
            <strong>Approval.</strong> Only approved brands can sell. Applications are reviewed by Part One and may be
            approved or rejected at our discretion. Seller accounts can be suspended for breaking these Terms.
          </li>
          <li>
            <strong>Listings.</strong> You must only list original products you have the right to sell, describe them
            accurately and keep stock levels up to date. Counterfeit goods are prohibited.
          </li>
          <li>
            <strong>Fulfilment.</strong> You are responsible for packing, shipping and updating each order&apos;s
            status, and for handling returns.
          </li>
          <li>
            <strong>Commission.</strong> Part One charges a commission on each sale at the rate in your seller
            agreement ([X]%). We may change the rate with [30] days&apos; notice.
          </li>
          <li>
            <strong>Payouts.</strong> Your earnings from an order (the item price minus commission, plus the delivery
            fee) become available once the order is marked Delivered. Available earnings are paid to your registered
            bank account once your balance reaches ₦50,000.
          </li>
          <li>
            <strong>Refunds and chargebacks.</strong> Refunds and chargebacks on your orders are deducted from your
            balance. If your balance is not enough, the amount is deducted from future earnings.
          </li>
          <li>
            <strong>Customer data.</strong> You may only use customer details to fulfil the order they relate to.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "prohibited",
    title: "Prohibited use",
    body: (
      <ul className={ul}>
        <li>Selling counterfeit, stolen or illegal goods.</li>
        <li>Trying to access other users&apos; accounts or data, or parts of Part One you are not allowed to use.</li>
        <li>Interfering with the platform, scraping it at scale, or bypassing its security.</li>
        <li>Fraud, including payment fraud and false chargebacks.</li>
      </ul>
    ),
  },
  {
    id: "ip",
    title: "Intellectual property",
    body: (
      <p>
        The Part One name, logo and platform belong to [Company legal name]. Brand names, product photos and designs
        belong to the Sellers who own them. You may not copy or reuse them without permission.
      </p>
    ),
  },
  {
    id: "liability",
    title: "Liability",
    body: (
      <p>
        [Limitation of liability clause — to be drafted by counsel. It should cover the marketplace model, Seller
        responsibility for products and delivery, and Part One&apos;s maximum liability, without limiting rights
        under Nigerian consumer protection law, including the Federal Competition and Consumer Protection Act 2018.]
      </p>
    ),
  },
  {
    id: "termination",
    title: "Suspension and closing your account",
    body: (
      <p>
        You can close your account at any time from your settings. We may suspend or close accounts that break these
        Terms. Orders already paid will still be completed or refunded.
      </p>
    ),
  },
  {
    id: "law",
    title: "Governing law and disputes",
    body: (
      <p>
        These Terms are governed by the laws of the Federal Republic of Nigeria. [Dispute resolution clause — e.g.
        negotiation, then mediation, then the courts of Lagos State.]
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes and contact",
    body: (
      <p>
        We may update these Terms. If changes are significant, we will tell you in the app before they take effect.
        Questions: [support contact].
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Use"
      updated="[Date]"
      intro={
        <p>
          These Terms explain the rules for buying, selling and taking part in the Part One community. Please read
          them carefully.
        </p>
      }
      sections={sections}
    />
  );
}
