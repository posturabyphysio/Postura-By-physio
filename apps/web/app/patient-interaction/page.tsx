import { PatientInteractionExperience } from "./PatientInteractionExperience";


import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Patient Interaction",
  description: "How we work with patients at Postura by Physio — care, communication, and your recovery journey.",
  path: "/patient-interaction",
  ogImage: "/about-hero.png",
});

export default function PatientInteractionPage() {
  return <PatientInteractionExperience />;
}
