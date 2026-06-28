export type FaqItem = {
  question: string;
  answer: string;
};

export const faqs: FaqItem[] = [
  {
    question: "How do I know which program is right for me?",
    answer:
      "Every client starts with a detailed assessment by our physiotherapist. Based on your posture, pain level, fitness status, and lifestyle, we design a personalized plan that suits your body and goals.",
  },
  {
    question:
      "Can I combine physiotherapy with fitness programs like yoga or aerobics?",
    answer:
      "Yes. We often blend physiotherapy with guided fitness sessions such as yoga, Pilates, or aerobics to help you build strength safely while recovering.",
  },
  {
    question:
      "What makes Postura by Physio different from regular fitness trainers or clinics?",
    answer:
      "We bring evidence-based physiotherapy together with structured movement training, ensuring your sessions are both medically informed and results-driven.",
  },
  {
    question: "Do I need any special equipment at home?",
    answer:
      "Most plans use simple items like a mat, towel, or resistance band. If any additional equipment is recommended, we guide you on affordable, easy-to-use options.",
  },
  {
    question: "Are online sessions suitable for beginners?",
    answer:
      "Absolutely. Sessions are fully guided with live feedback on your posture and movement, making them safe and effective even if you are new to exercise.",
  },
];

export function faqPageSchema(faqs: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: {
        "@type": "Answer",
        text: answer,
      },
    })),
  };
}
