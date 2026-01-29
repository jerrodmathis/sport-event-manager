import { Suspense } from "react";
import { EventList } from "@/components/event-list";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; sportType?: string }>;
}) {
  const params = await searchParams;
  return (
    <Suspense>
      <EventList searchParams={params} />
    </Suspense>
  );
}
