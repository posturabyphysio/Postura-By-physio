import { HeroSection } from "../../components/Home/HeroSection";
import { Footer } from "../../components/Home/Footer";
import { ContactUsSection } from "../../components/Contact/ContactUsSection";


import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact Us",
  description: "Contact Postura by Physio to book an appointment or ask a question. Get help with pain management, posture correction, rehabilitation, and guided movement programs.",
  path: "/contact-us",
  ogImage: "/contact-hero.png",
  ogTitle: "Contact Postura by Physio",
  ogImageAlt: "Contact Postura by Physio",
});

const contactSlides = [
  {
    src: "/contact-hero.png",
    mobileSrc: "/contact-hero.png",
    alt: "About Postura by Physio",
    tag: "Contact Us",
    headline:
      "Contact Postura by<br/> Physio",
    body: "Pain should not be part of your daily routine. Our physiotherapy experts are here to help you move better and recover stronger.",
    sub: "",
  },
];

export default function ContactUsPage() {
  return (
    <div className="md:overflow-x-visible">
      <HeroSection slides={contactSlides} id="contact-hero" showBookSessionButton />

      <ContactUsSection />

      <Footer />
    </div>
  );
}

