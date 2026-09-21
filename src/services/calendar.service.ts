import {
  getStorageItem,
  setStorageItem,
} from '@/lib/storage';
import type { CalendarEventData as CalendarEvent } from '@/data/calendar';

const STORAGE_KEY = 'nexastudy_calendar_v1';

export async function getCalendarEvents(): Promise<
  CalendarEvent[]
> {
  return getStorageItem<CalendarEvent[]>(
    STORAGE_KEY,
    [],
  );
}

export async function createCalendarEvent(
  event: CalendarEvent,
): Promise<CalendarEvent> {
  const events = await getCalendarEvents();

  setStorageItem(STORAGE_KEY, [event, ...events]);

  return event;
}

export async function updateCalendarEvent(
  id: string,
  updates: Partial<CalendarEvent>,
): Promise<CalendarEvent | null> {
  const events = await getCalendarEvents();

  const index = events.findIndex(
    (event) => event.id === id,
  );

  if (index === -1) {
    return null;
  }

  const updated = {
    ...events[index],
    ...updates,
  };

  events[index] = updated;

  setStorageItem(STORAGE_KEY, events);

  return updated;
}

export async function deleteCalendarEvent(
  id: string,
): Promise<boolean> {
  const events = await getCalendarEvents();

  const filtered = events.filter(
    (event) => event.id !== id,
  );

  if (filtered.length === events.length) {
    return false;
  }

  setStorageItem(STORAGE_KEY, filtered);

  return true;
}