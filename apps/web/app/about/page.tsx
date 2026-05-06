import { HeroSection } from "../../components/Home/HeroSection";
import { Footer } from "../../components/Home/Footer";
import { BrandIntroduction } from "@/components/About/BrandIntroduction";
import { MeetPhysiotherapist } from "../../components/Home/MeetPhysiotherapist";
import { TreatmentPhilosophy } from "@/components/About/TreatmentPhilosophy";
import { VisionMission } from "@/components/About/VisionMission";

const aboutSlides = [
  {
    src: "/about-hero.png",
    mobileSrc: "/about-hero.png",
    alt: "About Postura by Physio",
    tag: "About Postura by Physio",
    headline:
      "Expert Physiotherapy<br/> & Wellness Care at<br/> Postura by Physio",
    body: "Professional physiotherapy and structured fitness programs designed to improve posture, movement, and long-term wellness.",
    sub: "",
  },
];

export default function AboutPage() {
  return (
    <div className="md:overflow-x-visible">
      <HeroSection slides={aboutSlides} id="about-hero" showBookSessionButton/>
      <BrandIntroduction />
      <MeetPhysiotherapist eyebrow="Founder Story" heading="The Story Behind Postura by Physio" paragraph1="Postura by Physio was founded by Dr. Priyanshi Pandya(MPT GPC-6673, MIAFT) with the vision of shifting healthcare from treating injuries to preventing them early." paragraph2="During her clinical experience, she noticed that many young individuals develop pain and musculoskeletal problems due to poor posture, sedentary lifestyles, and lack of movement awareness. Most patients seek physiotherapy only when the pain becomes severe." paragraph3="This observation led her to promote the concept of prehabilitation, focusing on strengthening and conditioning the body before injuries occur. Through personalized care and preventive fitness programs, her mission is to build stronger, healthier, and injury-free communities." ctaLabel="Start Your Recovery Journey" whatsappPhone="916354011290" whatsappMessage="Hi! I’d like to start my recovery journey and book a session." />
      <TreatmentPhilosophy />
      <VisionMission />
      <Footer />
    </div>
  );
}

