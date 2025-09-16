import { redirect } from 'next/navigation';
import { routing } from '@/i18n/routing';

export async function GET() {
  redirect(`/fr`);
}
