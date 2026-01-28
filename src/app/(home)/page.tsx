import { Suspense } from "react";
import { EventList } from "@/components/event-list";

export default function Home() {
  return (
    <Suspense>
      <EventList />
    </Suspense>
  );
}
