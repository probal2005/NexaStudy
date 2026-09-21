'use client';

import {
  CalendarDays,
  Clock3,
  MapPin,
} from 'lucide-react';

export interface TodayEvent {
  id: string;
  title: string;
  time: string;
  duration?: string;
  location?: string;
  type?: string;
}

interface TodayOverviewProps {
  events: TodayEvent[];
}

export default function TodayOverview({
  events,
}: TodayOverviewProps) {
  return (
    <section className="rounded-2xl border border-border bg-background p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Today</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Your schedule for today.
          </p>
        </div>

        <CalendarDays className="h-5 w-5 text-muted-foreground" />
      </div>

      {events.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-6 text-center">
          <p className="text-sm font-medium">
            Nothing scheduled today
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Enjoy the free time or plan your next study session.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((event) => (
            <div
              key={event.id}
              className="rounded-xl border border-border p-4 transition-colors hover:bg-muted/30"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Clock3 className="h-4 w-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h3 className="font-medium">{event.title}</h3>

                    {event.type && (
                      <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                        {event.type}
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-sm text-primary">
                    {event.time}
                    {event.duration && ` · ${event.duration}`}
                  </p>

                  {event.location && (
                    <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      {event.location}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}