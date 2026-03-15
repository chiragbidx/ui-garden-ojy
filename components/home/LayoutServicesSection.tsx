import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

enum ProService {
  YES = 1,
  NO = 0,
}
interface ServiceProps {
  title: string;
  pro: ProService;
  description: string;
}
const serviceList: ServiceProps[] = [
  {
    title: "Authentication Foundation",
    description:
      "Ready-to-extend auth scaffolding for email, OAuth, and organization-based access.",
    pro: 0,
  },
  {
    title: "Billing-Ready Structure",
    description:
      "Plan models and upgrade flow patterns prepared for Stripe or your payment provider.",
    pro: 0,
  },
  {
    title: "Developer Experience",
    description: "TypeScript, linting, and component primitives configured for team velocity.",
    pro: 0,
  },
  {
    title: "Production Hardening",
    description: "Security-minded defaults, reusable UI states, and maintainable section architecture.",
    pro: 1,
  },
];

export const LayoutServicesSection = () => {
  return (
    <section id="services" className="container py-24 sm:py-32">
      <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
        Services
      </h2>

      <h2 className="text-3xl md:text-4xl text-center font-bold mb-4">
        Core starter capabilities
      </h2>
      <h3 className="md:w-1/2 mx-auto text-xl text-center text-muted-foreground mb-8">
        A pragmatic baseline for SaaS products that need to move quickly
        without sacrificing quality.
      </h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"></div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4 w-full lg:w-[60%] mx-auto">
        {serviceList.map(({ title, description, pro }) => (
          <Card
            key={title}
            className="bg-muted/60 dark:bg-card h-full relative"
          >
            <CardHeader>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <Badge
              data-pro={ProService.YES === pro}
              variant="secondary"
              className="absolute -top-2 -right-3 data-[pro=false]:hidden"
            >
              PRO
            </Badge>
          </Card>
        ))}
      </div>
    </section>
  );
};
