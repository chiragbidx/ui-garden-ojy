import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { icons } from "lucide-react";

interface FeaturesProps {
  icon: string;
  title: string;
  description: string;
}

const featureList: FeaturesProps[] = [
  {
    icon: "TabletSmartphone",
    title: "Responsive By Default",
    description:
      "Every section is optimized for mobile and desktop without extra layout work.",
  },
  {
    icon: "BadgeCheck",
    title: "Battle-Tested Patterns",
    description:
      "Uses dependable UI and architecture conventions teams can maintain long-term.",
  },
  {
    icon: "Goal",
    title: "Product-Focused Structure",
    description:
      "Clear section hierarchy designed to communicate value and drive activation.",
  },
  {
    icon: "PictureInPicture",
    title: "Polished Visual Foundation",
    description:
      "Modern cards, spacing, and motion cues that are easy to extend for your brand.",
  },
  {
    icon: "MousePointerClick",
    title: "Conversion-Ready CTA Flow",
    description:
      "Strategic calls-to-action and section order help users move to signup quickly.",
  },
  {
    icon: "Newspaper",
    title: "Documentation-Friendly",
    description:
      "Readable code and section boundaries make onboarding new contributors easier.",
  },
];

export const LayoutFeatureGridSection = () => {
  return (
    <section id="features" className="container py-24 sm:py-32">
      <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
        Features
      </h2>

      <h2 className="text-3xl md:text-4xl text-center font-bold mb-4">
        What you get out of the box
      </h2>

      <h3 className="md:w-1/2 mx-auto text-xl text-center text-muted-foreground mb-8">
        Panda combines developer speed and production-grade UX so you can spend
        your time shipping features instead of rebuilding starter infrastructure.
      </h3>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {featureList.map(({ icon, title, description }) => (
          <div key={title}>
            <Card className="h-full bg-background border-0 shadow-none">
              <CardHeader className="flex justify-center items-center">
                <div className="bg-primary/20 p-2 rounded-full ring-8 ring-primary/10 mb-4">
                  <Icon
                    name={icon as keyof typeof icons}
                    size={24}
                    className="text-primary"
                  />
                </div>

                <CardTitle>{title}</CardTitle>
              </CardHeader>

              <CardContent className="text-muted-foreground text-center">
                {description}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
};
