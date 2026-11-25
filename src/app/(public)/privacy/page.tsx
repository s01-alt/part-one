import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, type LegalSection } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Part One collects, uses and protects your personal data.",
};

const ul = "list-disc pl-5 flex flex-col gap-1.5";

const sections: LegalSection[] = [
  {
    id: "who-we-are",
    title: "Who we are",
    body: (
      <>
        <p>
          Part One (&quot;Part One&quot;, &quot;we&quot;, &quot;us&quot;) is an online marketplace for Nigerian
          streetwear operated by [Company legal name], a company registered in Nigeria with RC number [RC number] and
          its address at [Registered address].
        </p>
        <p>
          We are the data controller for the personal data described in this policy. We process your data in line
          with the Nigeria Data Protection Act 2023 (NDPA) and guidance from the Nigeria Data Protection Commission
          (NDPC).
        </p>
        <p>Contact for privacy questions: [privacy contact email]. Data Protection Officer: [DPO name and contact].</p>
      </>
    ),
  },
  {
    id: "data-we-collect",
    title: "Data we collect",
    body: (
      <>
        <p>
          <strong>Account data.</strong> When you sign in with Google, we receive your name, email address and
          profile photo from Google. We do not receive your Google password.
        </p>
        <p>
          <strong>Order and delivery data.</strong> Items you buy, delivery address, phone number, order history and
          order status.
        </p>
        <p>
          <strong>Payment data.</strong> Payments are processed by Paystack. We receive a payment reference, the
          amount, the payment status and limited card details such as the card type and last four digits. We never
          see or store your full card number or PIN.
        </p>
        <p>
          <strong>Activity on Part One.</strong> Products you view, like, save, repost, share or comment on, brands
          you follow, reviews you write, reports you submit and items in your cart.
        </p>
        <p>
          <strong>Device and usage data.</strong> IP address, browser type, device type, pages visited and similar
          technical data, collected through our analytics provider and server logs.
        </p>
        <p>
          <strong>Seller data.</strong> If you apply to sell, we also collect your brand details, business
          registration details where provided, contact person, and the bank account details we need to pay you.
        </p>
      </>
    ),
  },
  {
    id: "how-we-use",
    title: "How we use your data and our lawful basis",
    body: (
      <ul className={ul}>
        <li>
          <strong>To provide the marketplace</strong> — create your account, process orders and payments, pass order
          details to the brands that fulfil them, process refunds and pay sellers. Basis: performance of a contract.
        </li>
        <li>
          <strong>To send you in-app notifications</strong> about orders, payments, refunds and, for sellers, your
          application and payouts. Basis: performance of a contract.
        </li>
        <li>
          <strong>To show the community features</strong> — public comments, reviews and reposts, with your display
          name. Basis: performance of a contract.
        </li>
        <li>
          <strong>To keep Part One safe</strong> — prevent fraud, investigate reports, moderate content and enforce
          our Terms. Basis: legitimate interests and legal obligation.
        </li>
        <li>
          <strong>To improve Part One</strong> — understand how people use the product and which features work.
          Basis: legitimate interests, or consent where the law requires it.
        </li>
        <li>
          <strong>To meet legal obligations</strong> — tax, accounting and responses to lawful requests from
          authorities. Basis: legal obligation.
        </li>
      </ul>
    ),
  },
  {
    id: "sharing",
    title: "Who we share data with",
    body: (
      <>
        <ul className={ul}>
          <li>
            <strong>Brands you buy from</strong> receive your name, delivery address, phone number and the items
            ordered, only for the orders placed with them. Brands may not use this data for other purposes.
          </li>
          <li>
            <strong>Paystack</strong>, our payment processor, for payments, refunds and seller payouts.
          </li>
          <li>
            <strong>Google</strong>, when you choose to sign in with Google.
          </li>
          <li>
            <strong>Service providers</strong> who host our servers and storage, provide analytics ([analytics
            provider]) and monitor errors, under contracts that require them to protect your data.
          </li>
          <li>
            <strong>Authorities</strong> where required by law or to protect the rights and safety of users.
          </li>
        </ul>
        <p>We do not sell your personal data.</p>
      </>
    ),
  },
  {
    id: "public-content",
    title: "Content you make public",
    body: (
      <p>
        Comments, reviews and reposts are visible to other users together with your display name. Your likes, saves,
        followed brands and order history are private to you. Part One does not have public user profiles.
      </p>
    ),
  },
  {
    id: "transfers",
    title: "International transfers",
    body: (
      <p>
        Some of our service providers may process data outside Nigeria, including [hosting regions]. When this
        happens, we rely on the safeguards allowed by the NDPA, such as adequacy decisions, contractual protections or
        your consent.
      </p>
    ),
  },
  {
    id: "retention",
    title: "How long we keep data",
    body: (
      <ul className={ul}>
        <li>Account data: while your account is open, and [X months] after you close it.</li>
        <li>Order, payment and payout records: [X years], as required for tax and accounting.</li>
        <li>Comments and reviews: until you delete them or your account is closed, unless removed by moderation.</li>
        <li>Analytics and logs: [X months].</li>
      </ul>
    ),
  },
  {
    id: "rights",
    title: "Your rights",
    body: (
      <>
        <p>Under the NDPA you have the right to:</p>
        <ul className={ul}>
          <li>access the personal data we hold about you;</li>
          <li>correct inaccurate data;</li>
          <li>ask us to delete your data;</li>
          <li>restrict or object to some processing;</li>
          <li>receive your data in a portable format;</li>
          <li>withdraw consent at any time where we rely on consent;</li>
          <li>complain to the Nigeria Data Protection Commission.</li>
        </ul>
        <p>
          To use these rights, contact [privacy contact email]. We will respond within the time set by law. We may
          need to keep some data, such as order records, where the law requires it.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies and local storage",
    body: (
      <>
        <p>We use:</p>
        <ul className={ul}>
          <li>
            <strong>Essential cookies</strong> to keep you signed in and protect against fraud.
          </li>
          <li>
            <strong>Local storage</strong> on your device to remember your cart before you sign in.
          </li>
          <li>
            <strong>Analytics</strong> to understand how Part One is used. [Describe consent banner / opt-out.]
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "security",
    title: "Security",
    body: (
      <p>
        We use encryption in transit, access controls that limit staff and sellers to the data they need, and audit
        logs for financial and admin actions. No system is completely secure; if a breach affects your data, we will
        notify you and the NDPC as the law requires.
      </p>
    ),
  },
  {
    id: "children",
    title: "Age requirement",
    body: (
      <p>
        Part One is for people aged [18] and over. We do not knowingly collect data from children. If you believe a
        child has given us data, contact us and we will delete it.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to this policy",
    body: (
      <p>
        We may update this policy. If the changes are significant, we will tell you in the app before they take
        effect. See also our <Link href="/terms" className="underline">Terms of Use</Link>.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="[Date]"
      intro={
        <p>
          This policy explains what personal data Part One collects when you browse, buy or sell, why we collect it,
          who we share it with and the choices you have.
        </p>
      }
      sections={sections}
    />
  );
}
