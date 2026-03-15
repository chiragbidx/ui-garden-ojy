import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";

enum PopularPlan {
  NO = 0,
  YES = 1,
}

interface PlanProps {
  title: string;
  popular: PopularPlan;
  price: number;
  description: string;
  buttonText: string;
  benefitList: string[];
}

const plans: PlanProps[] = [
  {
    title: "Starter",
    popular: 0,
    price: 0,
    description:
      "Ideal for prototypes and small internal tools.",
    buttonText: "Start for free",
    benefitList: [
      "Up to 3 teammates",
      "Basic auth patterns",
      "Core landing sections",
      "Community support",
      "Deploy-ready setup",
    ],
  },
  {
    title: "Growth",
    popular: 1,
    price: 49,
    description:
      "Best for product teams shipping customer-facing SaaS.",
    buttonText: "Start trial",
    benefitList: [
      "Unlimited teammates",
      "Advanced section set",
      "Billing-ready models",
      "Priority support",
      "Team workflows",
    ],
  },
  {
    title: "Enterprise",
    popular: 0,
    price: 199,
    description:
      "For teams requiring compliance, support SLAs, and custom rollout.",
    buttonText: "Contact sales",
    benefitList: [
      "Security review support",
      "SSO/SAML integration path",
      "Dedicated onboarding",
      "Phone and email support",
      "Architecture advisory",
    ],
  },
];

export const LayoutPricingSection = () => {
  return (
    <section id="pricing" className="container py-24 sm:py-32">
      <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
        Pricing
      </h2>

      <h2 className="text-3xl md:text-4xl text-center font-bold mb-4">
        Pricing for every stage
      </h2>

      <h3 className="md:w-1/2 mx-auto text-xl text-center text-muted-foreground pb-14">
        Start lean, then scale to enterprise-grade workflows as your product grows.
      </h3>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-4">
        {plans.map(
          ({ title, popular, price, description, buttonText, benefitList }) => (
            <Card
              key={title}
              className={
                popular === PopularPlan?.YES
                  ? "drop-shadow-xl shadow-black/10 dark:shadow-white/10 border-[1.5px] border-primary lg:scale-[1.1]"
                  : ""
              }
            >
              <CardHeader>
                <CardTitle className="pb-2">{title}</CardTitle>

                <CardDescription className="pb-4">
                  {description}
                </CardDescription>

                <div>
                  <span className="text-3xl font-bold">${price}</span>
                  <span className="text-muted-foreground"> /month</span>
                </div>
              </CardHeader>

              <CardContent className="flex">
                <div className="space-y-4">
                  {benefitList.map((benefit) => (
                    <span key={benefit} className="flex">
                      <Check className="text-primary mr-2" />
                      <h3>{benefit}</h3>
                    </span>
                  ))}
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  variant={
                    popular === PopularPlan?.YES ? "default" : "secondary"
                  }
                  className="w-full"
                >
                  {buttonText}
                </Button>
              </CardFooter>
            </Card>
          )
        )}
      </div>
    </section>
  );
};
