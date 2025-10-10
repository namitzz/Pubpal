import { eventCodes } from '@/lib/staticParams';
import NewTeamPageClient from './NewTeamPageClient';

export const dynamicParams = false;

export async function generateStaticParams() {
  return eventCodes().map(code => ({ code }));
}

export default function NewTeamPage() {
  return <NewTeamPageClient />;
}
