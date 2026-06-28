import JsonLd from "@/components/JsonLd";
import { HeroSection } from "../components/Home/HeroSection";
import { WhoCanJoin } from "../components/Home/WhoCanJoin";
import { MovementCare } from "../components/Home/MovementCare";
import { WhyChooseUs } from "../components/Home/WhyChooseUs";
import { MeetPhysiotherapist } from "../components/Home/MeetPhysiotherapist";
import { ServicesSection } from "../components/Home/ServicesSection";
import { MomentsOfProgress } from "../components/Home/MomentsOfProgress";
import { FaqSection } from "../components/Home/FaqSection";
import { RecoveryResultsBanner } from "../components/Home/RecoveryResultsBanner";
import { AskPhysioSection } from "../components/Home/AskPhysioSection";
import { Footer } from "../components/Home/Footer";
import { faqPageSchema, faqs } from "@/lib/faqs";
import {
  CONTACT_EMAIL,
  CONTACT_PHONE,
  DEFAULT_DESCRIPTION,
  INSTAGRAM_URL,
  pageMetadata,
  PRIMARY_CITY,
  PRIMARY_REGION,
  SITE_NAME,
  SITE_URL,
} from "@/lib/seo";

export const metadata = pageMetadata({
  title: `${SITE_NAME} | Physiotherapy & Movement Programs in ${PRIMARY_CITY}`,
  description: DEFAULT_DESCRIPTION,
  path: "/",
  absoluteTitle: true,
});

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": ["Organization", "MedicalBusiness"],
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/admin-logo.png`,
  telephone: CONTACT_PHONE,
  email: CONTACT_EMAIL,
  address: {
    "@type": "PostalAddress",
    addressLocality: PRIMARY_CITY,
    addressRegion: PRIMARY_REGION,
    addressCountry: "IN",
  },
  areaServed: [PRIMARY_CITY, PRIMARY_REGION],
  sameAs: [INSTAGRAM_URL],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
};

export default function HomePage() {
  return (
    <div id="home" className="md:overflow-x-visible">
      <JsonLd data={organizationSchema} />
      <JsonLd data={websiteSchema} />
      <JsonLd data={faqPageSchema(faqs)} />
      <HeroSection />
      <WhoCanJoin />
      <MovementCare />
      <WhyChooseUs />
      <MeetPhysiotherapist />
      <ServicesSection />
      <MomentsOfProgress />
      <FaqSection />
      <RecoveryResultsBanner />
      <AskPhysioSection />
      <Footer />
    </div>
  );
}
