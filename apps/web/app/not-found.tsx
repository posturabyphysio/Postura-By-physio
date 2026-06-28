import Link from "next/link";
import type { Metadata } from "next";
import { Footer } from "../components/Home/Footer";
import { PrimaryCTAButton } from "../components/ui/PrimaryCTAButton";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col">
      <section className="flex flex-1 items-center justify-center px-4 py-20 text-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            404
          </p>
          <h1 className="mt-4 font-cabinet text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
            Page not found
          </h1>
          <p className="mt-4 text-sm text-gray-500 md:text-base">
            The page you are looking for does not exist or may have been moved.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <PrimaryCTAButton href="/" label="Back to home" size="sm" />
            <Link
              href="/contact-us"
              className="text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              Contact us
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
