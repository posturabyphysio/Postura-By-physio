import { HeroSection } from "../../components/Home/HeroSection";
import { Footer } from "../../components/Home/Footer";
import { GalleryMasonrySection } from "../../components/Gallery/GalleryMasonrySection";

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
      <Footer />
    </div>
  );
}
