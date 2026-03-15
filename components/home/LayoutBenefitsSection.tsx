import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { icons } from "lucide-react";

interface BenefitsProps {
  icon: string;
  title: string;
  description: string;
}

const benefitList: BenefitsProps[] = [
  {
    icon: "Blocks",
    title: "Ship With Confidence",
    description:
      "Start from proven architecture and avoid redoing auth, layout, and deployment setup.",
  },
  {
    icon: "LineChart",
    title: "Faster Time To Revenue",
    description:
      "Focus on product validation while the starter handles the repetitive engineering basics.",
  },
  {
    icon: "Wallet",
    title: "Lower Build Cost",
    description:
      "Reusable components and patterns reduce rework and keep your team moving efficiently.",
  },
  {
    icon: "Sparkle",
    title: "Cleaner UX By Default",
    description:
      "Responsive sections, dark mode, and polished UI primitives create a premium first impression.",
  },
];

export const LayoutBenefitsSection = () => {
  return (
    <section id="benefits" className="container py-24 sm:py-32">
      <div className="grid lg:grid-cols-2 place-items-center lg:gap-24">
        <div>
          <h2 className="text-lg text-primary mb-2 tracking-wider">Why Panda</h2>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            A practical SaaS app builder starter
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Built for teams that want production-ready foundations with room to
            customize, not a rigid template you outgrow in a week.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-4 w-full">
          {benefitList.map(({ icon, title, description }, index) => (
            <Card
              key={title}
              className="bg-muted/50 dark:bg-card hover:bg-background transition-all delay-75 group/number"
            >
              <CardHeader>
                <div className="flex justify-between">
                  <Icon
                    name={icon as keyof typeof icons}
                    size={32}
                    className="mb-6 text-primary"
                  />
                  <span className="text-5xl text-muted-foreground/15 font-medium transition-all delay-75 group-hover/number:text-muted-foreground/30">
                    0{index + 1}
                  </span>
                </div>

                <CardTitle>{title}</CardTitle>
              </CardHeader>

              <CardContent className="text-muted-foreground">
                {description}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
