import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQProps {
  question: string;
  answer: string;
  value: string;
}

const FAQList: FAQProps[] = [
  {
    question: "Is Panda free to start with?",
    answer: "Yes. You can start with the core template and customize it for your product.",
    value: "item-1",
  },
  {
    question: "Can I use this for a production SaaS app?",
    answer:
      "Yes. The starter is designed for production-minded teams with scalable structure and reusable UI patterns.",
    value: "item-2",
  },
  {
    question: "Does it support dark mode and responsive design?",
    answer:
      "Yes. The template includes theme support and responsive layouts across major sections.",
    value: "item-3",
  },
  {
    question: "Can I plug in my own auth and billing provider?",
    answer: "Yes. The structure is provider-agnostic and easy to adapt for your stack.",
    value: "item-4",
  },
  {
    question: "How quickly can I launch with Panda?",
    answer: "Most teams can ship an MVP in days by reusing existing sections and starter patterns.",
    value: "item-5",
  },
];

export const LayoutFaqSection = () => {
  return (
    <section id="faq" className="container mx-auto md:w-[700px] py-24 sm:py-32">
      <div className="text-center mb-8">
        <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
          FAQ
        </h2>

        <h2 className="text-3xl md:text-4xl text-center font-bold">
          Common Questions
        </h2>
      </div>

      <Accordion type="single" collapsible className="AccordionRoot">
        {FAQList.map(({ question, answer, value }) => (
          <AccordionItem key={value} value={value}>
            <AccordionTrigger className="text-left">
              {question}
            </AccordionTrigger>

            <AccordionContent>{answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};
