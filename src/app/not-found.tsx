import Link from 'next/link';
import { Button } from '@/components/shared/Button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">Page not found</p>
      <Link href="/">
        <Button variant="primary">Go Home</Button>
      </Link>
    </div>
  );
}
