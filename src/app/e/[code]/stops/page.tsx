import { eventCodes } from '@/lib/staticParams';
import StopsPageClient from './StopsPageClient';

export const dynamicParams = false;

export async function generateStaticParams() {
  return eventCodes().map(code => ({ code }));
}

export default function StopsPage() {
  return <StopsPageClient />;
}
