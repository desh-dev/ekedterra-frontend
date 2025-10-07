import { WifiOff } from "lucide-react";
import Link from "next/link";

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full mx-auto border border-gray-200">
          <div className="flex justify-center mb-6">
            <div className="bg-red-50 p-4 rounded-full">
              <WifiOff className="h-12 w-12 text-red-500" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            You&apos;re Offline
          </h1>
          <p className="text-gray-600 mb-6">
            It seems you&apos;re not connected to the internet. Please check
            your connection and try again.
          </p>

          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Try Again
            </button>

            <Link
              href="/"
              className="block w-full text-center text-primary-600 hover:text-primary-700 font-medium py-2 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Go to Homepage
            </Link>
          </div>
        </div>
      </main>

      {/* Bottom padding to account for bottom navigation */}
      <div className="h-20 md:hidden"></div>
    </div>
  );
}
