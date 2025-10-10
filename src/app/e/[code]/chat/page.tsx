import { eventCodes } from '@/lib/staticParams';
import ChatPageClient from './ChatPageClient';

export const dynamicParams = false;

export async function generateStaticParams() {
  return eventCodes().map(code => ({ code }));
}

export default function ChatPage() {
  return <ChatPageClient />;
}
