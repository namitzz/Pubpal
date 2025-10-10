import { eventCodes } from '@/lib/staticParams';
import EventPageClient from './EventPageClient';

export const dynamicParams = false;

export async function generateStaticParams() {
  return eventCodes().map(code => ({ code }));
}

export default function EventPage() {
  return <EventPageClient />;
}
