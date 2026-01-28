import { listEventsAction } from "@/utils/events/actions";
import { Suspense } from "react";

export default function Home() {
  return (
    <Suspense>
      <Events />
    </Suspense>
  );
}

async function Events() {
  const res = await listEventsAction();

  if (!res.ok) {
    return (
      <Suspense>
        <main className="min-h-screen flex flex-col items-center">
          <ul>
            {res.error.map((err, idx) => (
              <li key={`error_${idx}`}>{err}</li>
            ))}
          </ul>
        </main>
      </Suspense>
    );
  }

  return (
    <Suspense>
      <main className="min-h-screen flex flex-col items-center">
        <pre>{JSON.stringify(res.data.events, null, 2)}</pre>
      </main>
    </Suspense>
  );
}
