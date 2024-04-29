import Link from "next/link";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { Calculator } from "lucide-react";
import { buttonVariants } from "../ui/button";

import Animation from "../animation";

export default function Hero() {
  return (
    <div className="relative min-h-screen">
      <div className="position-absolute">
        <Animation className="lg:ml-40" />
      </div>

      <section className="position-absolute container grid place-items-center py-20 md:grid-cols-2 md:py-32">
        <div className="space-y-6 px-5 text-center sm:px-10 md:text-start lg:px-20">
          <main className="text-5xl font-bold text-white">
            <h1 className="text-primary">Wordpress + Next.js</h1>
            <h4 className="">Tailwind CSS + shadcn/ui</h4>
            <h6 className="">NextAuth.js + Zustand + Three.js</h6>
          </main>

          <p className=":w-10/12 mx-auto text-muted-foreground lg:mx-0">
            Wordpress ACF + Custom Post Types + REST and GraphQL API Check the
            dashboard to manage Expenses, a Next.js custom post type with custom
            fields
          </p>

          <div className="flex flex-col gap-4 md:flex-row">
            <Link
              href="/dashboard"
              className={`w-full ${buttonVariants({
                size: "lg",
              })}`}
            >
              Dashboard
              <Calculator className="ml-2 h-5 w-5" />
            </Link>

            <Link
              href="https://github.com/pauloedspinho20/wordpress-headless-next"
              target="_blank"
              className={`w-full ${buttonVariants({
                variant: "outline",
                size: "lg",
              })}`}
            >
              Github
              <GitHubLogoIcon className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
        {/* Shadow effect */}
        <div className="shadow"></div>
      </section>
    </div>
  );
}
