import { Suspense, use } from "react";
import { EventList } from "@/components/event-list";

export default function Home({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; sportType?: string }>;
}) {
  const params = use(searchParams);
  return (
    <Suspense>
      <EventList searchParams={params} />
    </Suspense>
  );
}
