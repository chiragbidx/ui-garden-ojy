"use client";
import { ChevronsDown, Github, Menu } from "lucide-react";
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Separator } from "../ui/separator";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../ui/navigation-menu";
import { Button } from "../ui/button";
import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme/theme-toggle";

interface RouteProps {
  href: string;
  label: string;
}

interface FeatureProps {
  title: string;
  description: string;
}

// Landing page logo config.
// Update these values to customize the navbar logo name and icon styling.
const LANDING_LOGO = {
  name: "Panda",
  iconClassName:
    "bg-gradient-to-tr border-secondary from-primary via-primary/70 to-primary rounded-lg w-9 h-9 mr-2 border text-white",
};

const routeList: RouteProps[] = [
  {
    href: "/#testimonials",
    label: "Testimonials",
  },
  {
    href: "/#team",
    label: "Team",
  },
  {
    href: "/#contact",
    label: "Contact",
  },
  {
    href: "/#faq",
    label: "FAQ",
  },
];

const featureList: FeatureProps[] = [
  {
    title: "Auth, Billing, Teams",
    description: "Production-ready flows for sign-in, subscriptions, and organizations.",
  },
  {
    title: "UI + Design System",
    description: "Shadcn-based components with consistent theming and dark mode support.",
  },
  {
    title: "Deploy Fast",
    description: "Sane defaults for Next.js, TypeScript, and Vercel-first deployment.",
  },
];

function LandingLogoLink({ onClick }: { onClick?: () => void }) {
  return (
    <Link href="/" className="font-bold text-lg flex items-center" onClick={onClick}>
      <ChevronsDown className={LANDING_LOGO.iconClassName} />
      {LANDING_LOGO.name}
    </Link>
  );
}

export const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <header className="shadow-inner bg-opacity-15 w-[90%] md:w-[70%] lg:w-[75%] lg:max-w-screen-xl top-5 mx-auto sticky border border-secondary z-40 rounded-2xl flex justify-between items-center p-2 bg-card">
      <LandingLogoLink />
      {/* <!-- Mobile --> */}
      <div className="flex items-center lg:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Menu
              onClick={() => setIsOpen(!isOpen)}
              className="cursor-pointer lg:hidden"
            />
          </SheetTrigger>

          <SheetContent
            side="left"
            className="flex flex-col justify-between rounded-tr-2xl rounded-br-2xl bg-card border-secondary"
          >
            <div>
              <SheetHeader className="mb-4 ml-4">
                <SheetTitle className="flex items-center">
                  <LandingLogoLink onClick={() => setIsOpen(false)} />
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-col gap-2">
                {routeList.map(({ href, label }) => (
                  <Button
                    key={href}
                    onClick={() => setIsOpen(false)}
                    asChild
                    variant="ghost"
                    className="justify-start text-base"
                  >
                    <Link href={href}>{label}</Link>
                  </Button>
                ))}
                <Button
                  onClick={() => setIsOpen(false)}
                  asChild
                  variant="ghost"
                  className="justify-start text-base"
                >
                  <Link href="/auth#signin">Sign in</Link>
                </Button>
                <Button
                  onClick={() => setIsOpen(false)}
                  asChild
                  className="justify-start text-base"
                >
                  <Link href="/auth#signup">Sign up</Link>
                </Button>
              </div>
            </div>

            <SheetFooter className="flex-col sm:flex-col justify-start items-start">
              <Separator className="mb-2" />

              <ThemeToggle mode="inline" />
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      {/* <!-- Desktop --> */}
      <NavigationMenu className="hidden lg:block mx-auto">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-card text-base">
              Features
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid w-[600px] grid-cols-2 gap-5 p-4">
                <Image
                  src="/demo-img.jpg"
                  alt="Panda preview"
                  className="h-full w-full rounded-md object-cover"
                  width={600}
                  height={600}
                />
                <ul className="flex flex-col gap-2">
                  {featureList.map(({ title, description }) => (
                    <li
                      key={title}
                      className="rounded-md p-3 text-sm hover:bg-muted"
                    >
                      <p className="mb-1 font-semibold leading-none text-foreground">
                        {title}
                      </p>
                      <p className="line-clamp-2 text-muted-foreground">
                        {description}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            {routeList.map(({ href, label }) => (
              <NavigationMenuLink key={href} asChild>
                <Link href={href} className="text-base px-2">
                  {label}
                </Link>
              </NavigationMenuLink>
            ))}
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <div className="hidden lg:flex items-center gap-2">
        <Button asChild size="sm" variant="ghost">
          <Link href="/auth#signin">Sign in</Link>
        </Button>
        <Button asChild size="sm">
          <Link href="/auth#signup">Sign up</Link>
        </Button>
        <ThemeToggle mode="inline" className="w-auto justify-center" />

        <Button asChild size="sm" variant="ghost" aria-label="View on GitHub">
          <Link
            aria-label="View on GitHub"
            href="https://nextjs.org/docs"
            target="_blank"
          >
            <Github className="size-5" />
          </Link>
        </Button>
      </div>
    </header>
  );
};
