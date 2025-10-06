"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html>
      <body className="antialiased bg-white">
        <div className="min-h-screen flex flex-col">
          {/* Simple Header */}
          <header className="w-full border-b border-gray-200 bg-white">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex items-center space-x-2">
                <div>
                  <Link
                    href="/"
                    className="flex place-self-center hidden lg:block"
                  >
                    <Image
                      src="https://files.edgestore.dev/7muc2z5blt7yqz78/assets/_public/logo-lg.webp"
                      alt="Logo"
                      width={140}
                      height={80}
                    />
                  </Link>
                  <Link
                    href="/"
                    className="flex place-self-center hidden md:block lg:hidden"
                  >
                    <Image
                      src="https://files.edgestore.dev/7muc2z5blt7yqz78/assets/_public/logo.webp"
                      alt="Logo"
                      width={120}
                      height={60}
                    />
                  </Link>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 flex items-center justify-center px-6 py-12">
            <div className="max-w-6xl w-full grid md:grid-cols-2 gap-12 items-center">
              {/* Left side - Text content */}
              <div className="space-y-6">
                <h1 className="text-6xl md:text-7xl font-bold text-gray-800">
                  Shoot!
                </h1>

                <p className="text-xl md:text-2xl text-gray-700">
                  Well, this is unexpected...
                </p>

                <div className="space-y-4">
                  <p className="text-sm text-gray-600 font-medium">
                    Error code: 500
                  </p>

                  <div className="space-y-2">
                    <p className="text-sm text-gray-700">
                      An error has occurred and we're working to fix the
                      problem! We'll be up and running shortly.
                    </p>

                    <p className="text-sm text-gray-700">
                      If you need immediate help from our customer service team
                      about an ongoing reservation, please{" "}
                      <a
                        href="/contact"
                        className="text-[#FF385C] hover:underline font-medium"
                      >
                        contact us
                      </a>
                      . If it isn't an urgent matter, please visit our{" "}
                      <a
                        href="/help"
                        className="text-[#FF385C] hover:underline font-medium"
                      >
                        Help Center
                      </a>{" "}
                      for additional information. Thanks for your patience!
                    </p>

                    <div className="pt-4">
                      <button
                        onClick={reset}
                        className="px-6 py-3 bg-[#FF385C] text-white rounded-lg font-medium hover:bg-[#E31C5F] transition-colors"
                      >
                        Try again
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right side - Illustration */}
              <div className="flex justify-center md:justify-end">
                <div className="relative w-64 h-96 md:w-80 md:h-[28rem]">
                  {/* Character illustration - similar to not-found but slightly different pose */}
                  <svg viewBox="0 0 300 400" className="w-full h-full">
                    {/* Shadow */}
                    <ellipse
                      cx="150"
                      cy="380"
                      rx="80"
                      ry="15"
                      fill="#E5E7EB"
                      opacity="0.5"
                    />

                    {/* Spilled items */}
                    <path
                      d="M 235 375 Q 245 370 250 380 L 255 390 Q 250 395 240 390 Z"
                      fill="#FF385C"
                    />
                    <circle
                      cx="260"
                      cy="385"
                      r="5"
                      fill="#FF385C"
                      opacity="0.6"
                    />

                    {/* Legs */}
                    <rect
                      x="120"
                      y="280"
                      width="20"
                      height="100"
                      fill="#4B5563"
                      rx="10"
                    />
                    <rect
                      x="160"
                      y="280"
                      width="20"
                      height="100"
                      fill="#4B5563"
                      rx="10"
                    />

                    {/* Shoes */}
                    <ellipse cx="130" cy="385" rx="25" ry="12" fill="#0EA5E9" />
                    <ellipse cx="170" cy="385" rx="25" ry="12" fill="#0EA5E9" />

                    {/* Body/Dress */}
                    <path
                      d="M 100 180 L 90 280 L 210 280 L 200 180 Z"
                      fill="#14B8A6"
                    />

                    {/* Stripes on dress */}
                    <rect
                      x="90"
                      y="200"
                      width="120"
                      height="8"
                      fill="#4B5563"
                      opacity="0.3"
                    />
                    <rect
                      x="90"
                      y="240"
                      width="120"
                      height="8"
                      fill="#4B5563"
                      opacity="0.3"
                    />

                    {/* Buttons */}
                    <circle cx="150" cy="215" r="6" fill="#4B5563" />
                    <circle cx="150" cy="255" r="6" fill="#4B5563" />

                    {/* Arms */}
                    <rect
                      x="70"
                      y="190"
                      width="18"
                      height="70"
                      fill="#FCA5A5"
                      rx="9"
                      transform="rotate(-15 79 190)"
                    />
                    <rect
                      x="212"
                      y="190"
                      width="18"
                      height="70"
                      fill="#FCA5A5"
                      rx="9"
                      transform="rotate(25 221 190)"
                    />

                    {/* Hands */}
                    <circle cx="70" cy="258" r="12" fill="#FCA5A5" />
                    <circle cx="235" cy="250" r="12" fill="#FCA5A5" />

                    {/* Item in hand */}
                    <path
                      d="M 228 240 L 238 235 L 248 245 L 238 250 Z"
                      fill="#FBBF24"
                    />

                    {/* Neck */}
                    <rect
                      x="135"
                      y="165"
                      width="30"
                      height="20"
                      fill="#FCA5A5"
                      rx="5"
                    />

                    {/* Head */}
                    <circle cx="150" cy="140" r="45" fill="#FCA5A5" />

                    {/* Hair - three buns style */}
                    <circle cx="150" cy="100" r="20" fill="#0E7490" />
                    <circle cx="120" cy="115" r="15" fill="#0E7490" />
                    <circle cx="180" cy="115" r="15" fill="#0E7490" />
                    <path
                      d="M 110 130 Q 105 110 150 100 Q 195 110 190 130"
                      fill="#0E7490"
                    />

                    {/* Hair decorations */}
                    <path d="M 155 90 L 165 85 L 160 100 Z" fill="#FBBF24" />
                    <circle cx="162" cy="92" r="3" fill="#FBBF24" />

                    {/* Face details */}
                    <circle cx="135" cy="135" r="4" fill="#4B5563" />
                    <circle cx="165" cy="135" r="4" fill="#4B5563" />
                    <circle
                      cx="125"
                      cy="148"
                      r="9"
                      fill="#FCA5A5"
                      opacity="0.5"
                    />
                    <circle
                      cx="175"
                      cy="148"
                      r="9"
                      fill="#FCA5A5"
                      opacity="0.5"
                    />

                    {/* Mouth - concerned expression */}
                    <path
                      d="M 140 158 Q 150 162 160 158"
                      stroke="#4B5563"
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
