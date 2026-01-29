import { listEventsAction } from "@/utils/events/actions";
import { Suspense } from "react";
import { SiteHeader } from "./site-header";
import { EventCard } from "./event-card";
import { EventCardSkeleton } from "./event-card-skeleton";
import { getSportTypes, SportType } from "@/utils/sport-types";

export async function EventList() {
  const sportTypes = await getSportTypes();

  return (
    <>
      <SiteHeader sportTypes={sportTypes} />
      <Suspense fallback={<EventListSkeleton />}>
        <EventListContent sportTypes={sportTypes} />
      </Suspense>
    </>
  );
}

async function EventListContent({ sportTypes }: { sportTypes: SportType[] }) {
  const res = await listEventsAction();

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      {res.ok ? (
        res.data.events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {res.data.events.map((event) => (
              <EventCard key={event.id} event={event} sportTypes={sportTypes} />
            ))}
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <div className="flex flex-col items-center gap-2 text-center">
              <h3 className="text-2xl font-bold tracking-tight">
                No events yet
              </h3>
              <p className="text-sm text-muted-foreground">
                Get started by creating your first event
              </p>
            </div>
          </div>
        )
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
