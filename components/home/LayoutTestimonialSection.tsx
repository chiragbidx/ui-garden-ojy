"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Star } from "lucide-react";

interface ReviewProps {
  image: string;
  name: string;
  userName: string;
  comment: string;
  rating: number;
}

const reviewList: ReviewProps[] = [
  {
    image: "/demo-img.jpg",
    name: "Aarav Shah",
    userName: "Founder, FinchFlow",
    comment:
      "Panda saved us weeks of setup. We launched our first paying plan in less than a sprint.",
    rating: 5.0,
  },
  {
    image: "/demo-img.jpg",
    name: "Maya Patel",
    userName: "Product Lead, OrbitDesk",
    comment:
      "The section structure and component quality made it easy to ship a polished onboarding flow quickly.",
    rating: 4.8,
  },

  {
    image: "/demo-img.jpg",
    name: "Nikhil Rao",
    userName: "CTO, TeamForge",
    comment:
      "We replaced our old starter with Panda and reduced front-end rework dramatically.",
    rating: 4.9,
  },
  {
    image: "/demo-img.jpg",
    name: "Emma Brooks",
    userName: "Head of Growth, Nimbus",
    comment:
      "The default layout is conversion-friendly and easy to adapt to our brand.",
    rating: 5.0,
  },
  {
    image: "/demo-img.jpg",
    name: "Daniel Kim",
    userName: "Engineering Manager, PulseOps",
    comment:
      "Great developer ergonomics. New engineers onboarded fast and started shipping immediately.",
    rating: 5.0,
  },
  {
    image: "/demo-img.jpg",
    name: "Sofia Green",
    userName: "Founder, LaunchPad AI",
    comment:
      "Exactly what we needed for an MVP: clean code, strong UI, and a sensible section flow.",
    rating: 4.9,
  },
];

export const LayoutTestimonialSection = () => {
  return (
    <section id="testimonials" className="container py-24 sm:py-32">
      <div className="text-center mb-8">
        <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
          Testimonials
        </h2>

        <h2 className="text-3xl md:text-4xl text-center font-bold mb-4">
          Teams shipping with Panda
        </h2>
      </div>

      <Carousel
        opts={{
          align: "start",
        }}
        className="relative w-[80%] sm:w-[90%] lg:max-w-screen-xl mx-auto"
      >
        <CarouselContent>
          {reviewList.map((review) => (
            <CarouselItem
              key={review.name}
              className="md:basis-1/2 lg:basis-1/3"
            >
              <Card className="bg-muted/50 dark:bg-card">
                <CardContent className="pt-6 pb-0">
                  <div className="flex gap-1 pb-6">
                    <Star className="size-4 fill-primary text-primary" />
                    <Star className="size-4 fill-primary text-primary" />
                    <Star className="size-4 fill-primary text-primary" />
                    <Star className="size-4 fill-primary text-primary" />
                    <Star className="size-4 fill-primary text-primary" />
                  </div>
                  {`"${review.comment}"`}
                </CardContent>

                <CardHeader>
                  <div className="flex flex-row items-center gap-4">
                    <Avatar>
                      <AvatarImage src={review.image} alt={review.name} />
                      <AvatarFallback>SV</AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col">
                      <CardTitle className="text-lg">{review.name}</CardTitle>
                      <CardDescription>{review.userName}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
};
