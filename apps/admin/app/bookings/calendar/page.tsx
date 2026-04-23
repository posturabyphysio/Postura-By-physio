import type {
  AvailabilitySlotDto,
  BlockedDateDto,
  BookingDto,
} from "@repo/types";
import { PageHeader } from "@/components/PageHeader";
import { BookingsTabs } from "@/components/bookings/BookingsTabs";
import { BookingsCalendar } from "@/components/bookings/BookingsCalendar";
import { availabilityApi, bookingsApi } from "@/lib/api";

export const dynamic = "force-dynamic";

/**
 * Full-screen booking calendar. Pulls the most recent 200 bookings
 * (admin view has capped limit at 200) along with the weekly
 * availability template + one-off blocked dates so the client
 * component can derive "available slots" counts per visible day.
 */
export default async function BookingsCalendarPage() {
  let bookings: BookingDto[] = [];
  let slots: AvailabilitySlotDto[] = [];
  let blockedDates: BlockedDateDto[] = [];
  let loadError: string | null = null;

  try {
    const [bookingsRes, slotsRes, blockedRes] = await Promise.all([
      bookingsApi.list({ limit: 200 }),
      availabilityApi.listSlots(),
      availabilityApi.listBlockedDates(),
    ]);
    bookings = bookingsRes.data;
    slots = slotsRes.data;
    blockedDates = blockedRes.data;
  } catch (err) {
    loadError =
      err instanceof Error ? err.message : "Failed to load calendar data";
  }

  return (
    <>
      <PageHeader
        title="Bookings"
        description="Appointment requests submitted from the public site."
      />
      <BookingsTabs />

      <div className="px-4 py-6 sm:px-6 lg:px-8">
        {loadError ? (
          <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <p className="font-medium">Could not load calendar</p>
            <p className="mt-1">{loadError}</p>
          </div>
        ) : (
          <BookingsCalendar
            bookings={bookings}
            slots={slots}
            blockedDates={blockedDates}
          />
        )}
      </div>
    </>
  );
}
