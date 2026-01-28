import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Suspense } from "react";
import Link from "next/link";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 w-full flex flex-col gap-4 items-center">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
          <div className="flex gap-5 items-center font-semibold">
            <Link className="text-xl" href={"/"}>
              Sports Event Manager
            </Link>
          </div>
          <div className="flex flex-row gap-2">
            <ThemeSwitcher />
            <Suspense>
              <AuthButton />
            </Suspense>
          </div>
        </div>
      </nav>
      {children}
    </div>
  );
}
