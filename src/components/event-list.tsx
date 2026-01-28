import { listEventsAction } from "@/utils/events/actions";
import { Suspense } from "react";
import { SiteHeader } from "./site-header";
import { EventCard } from "./event-card";
import { EventCardSkeleton } from "./event-card-skeleton";

export function EventList() {
  return (
    <>
      <SiteHeader />
      <Suspense fallback={<EventListSkeleton />}>
        <EventListContent />
      </Suspense>
    </>
  );
}

async function EventListContent() {
  const res = await listEventsAction();

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      {res.ok ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {res.data.events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <ul>
          {res.error.map((err, idx) => (
            <li key={`error_${idx}`}>{err}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function EventListSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <EventCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
