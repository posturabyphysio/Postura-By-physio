import { HeroSection } from "../../components/Home/HeroSection";
import { Footer } from "../../components/Home/Footer";
import { GalleryMasonrySection } from "../../components/Gallery/GalleryMasonrySection";
import { GallerySplitFeatureSection } from "../../components/Gallery/GallerySplitFeatureSection";
import { YogaTherapySection } from "@/components/Gallery/YogaTherapySection";
import { PilatesTherapySection } from "@/components/Gallery/PilatesTherapySection";
import { CorporateWelnessProgramSection } from "@/components/Gallery/CorporateWelnessProgramSection";

const gallerySlides = [
  {
    src: "/gallery-hero.png",
    mobileSrc: "/gallery-hero.png",
    alt: "Postura Gallery",
    tag: "Postura Gallery",
    headline: "Our Therapy & Fitness<br/> Journey in Action",
    body: "Explore real moments of recovery, strength building, and wellness transformation through our guided physiotherapy and fitness sessions.",
    sub: "",
  },
];

export default function GalleryPage() {
  return (
    <div className="md:overflow-x-visible">
      <HeroSection slides={gallerySlides} id="gallery-hero" showBookSessionButton />
      <GalleryMasonrySection />
      <GallerySplitFeatureSection />
      <YogaTherapySection />
      <PilatesTherapySection />
      <CorporateWelnessProgramSection />
      <Footer />
    </div>
  );
}
