import { listEventsAction } from "@/utils/events/actions";
import { Suspense } from "react";
import { SiteHeader } from "./site-header";
import { EventCard } from "./event-card";
import { EventCardSkeleton } from "./event-card-skeleton";
import { getSportTypes, SportType } from "@/utils/sport-types";

export async function EventList({
  searchParams,
}: {
  searchParams: { search?: string; sportType?: string };
}) {
  const sportTypes = await getSportTypes();

  return (
    <>
      <SiteHeader sportTypes={sportTypes} />
      <div className="flex flex-1 flex-col gap-4 p-4 overflow-auto">
        <Suspense fallback={<EventListSkeleton />}>
          <EventListContent
            sportTypes={sportTypes}
            searchParams={searchParams}
          />
        </Suspense>
      </div>
    </>
  );
}

async function EventListContent({
  sportTypes,
  searchParams,
}: {
  sportTypes: SportType[];
  searchParams: { search?: string; sportType?: string };
}) {
  const sportTypeId = searchParams?.sportType
    ? sportTypes.find((st) => st.name === searchParams.sportType)?.id
    : undefined;

  const res = await listEventsAction({
    search: searchParams?.search,
    sportTypeId,
  });

  const hasFilters = !!searchParams?.search || !!searchParams?.sportType;

  return (
    <div className="flex flex-1 flex-col gap-4">
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
                {hasFilters ? "No events found" : "No events yet"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {hasFilters
                  ? "Try adjusting your search or filters"
                  : "Get started by creating your first event"}
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
    <div className="flex flex-1 flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <EventCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
