import { Suspense } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { getUserAction } from "@/utils/users/actions";
import { Toaster } from "sonner";

async function SidebarWithUser() {
  const result = await getUserAction();
  const user = result.ok ? result.data : null;
  return <AppSidebar user={user} />;
}

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <Suspense fallback={<AppSidebar user={null} />}>
        <SidebarWithUser />
      </Suspense>
      <SidebarInset>
        {children}
        <Toaster />
      </SidebarInset>
    </SidebarProvider>
  );
}
