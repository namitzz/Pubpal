import { teamCodes } from '@/lib/staticParams';
import TeamPageClient from './TeamPageClient';

export const dynamicParams = false;

export async function generateStaticParams() {
  return teamCodes().map(teamCode => ({ teamCode }));
}

export default function TeamPage() {
  return <TeamPageClient />;
}
