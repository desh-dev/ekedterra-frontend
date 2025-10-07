import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center space-x-2">
            <div>
              <Link href="/" className="flex place-self-center hidden lg:block">
                <Image src="/logo-lg.webp" alt="Logo" width={140} height={80} />
              </Link>
              <Link
                href="/"
                className="flex place-self-center hidden md:block lg:hidden"
              >
                <Image src="/logo.webp" alt="Logo" width={120} height={60} />
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
              Oops!
            </h1>

            <p className="text-xl md:text-2xl text-gray-700">
              We can&apos;t seem to find the page you&apos;re looking for.
            </p>

            <div className="space-y-2">
              <p className="text-sm text-gray-600 font-medium">
                Error code: 404
              </p>

              <div className="space-y-1">
                <p className="text-sm text-gray-600">
                  Here are some helpful links instead:
                </p>
                <ul className="space-y-1 text-sm">
                  <li>
                    <Link href="/" className="text-[#FF385C] hover:underline">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/search"
                      className="text-[#FF385C] hover:underline"
                    >
                      Search
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/shop"
                      className="text-[#FF385C] hover:underline"
                    >
                      Shop
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right side - Illustration */}
          <div className="flex justify-center md:justify-end">
            <div className="relative w-64 h-96 md:w-80 md:h-[28rem]">
              {/* Character illustration */}
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

                {/* Spilled item */}
                <path
                  d="M 240 370 Q 250 365 255 375 L 260 385 Q 255 390 245 385 Z"
                  fill="#FF385C"
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

                {/* Buttons */}
                <circle cx="150" cy="210" r="6" fill="#4B5563" />
                <circle cx="150" cy="235" r="6" fill="#4B5563" />
                <circle cx="150" cy="260" r="6" fill="#4B5563" />

                {/* Arms */}
                <rect
                  x="70"
                  y="190"
                  width="18"
                  height="70"
                  fill="#FCA5A5"
                  rx="9"
                  transform="rotate(-20 79 190)"
                />
                <rect
                  x="212"
                  y="190"
                  width="18"
                  height="70"
                  fill="#FCA5A5"
                  rx="9"
                  transform="rotate(20 221 190)"
                />

                {/* Hands */}
                <circle cx="68" cy="255" r="12" fill="#FCA5A5" />
                <circle cx="232" cy="255" r="12" fill="#FCA5A5" />

                {/* Item in hand */}
                <path
                  d="M 225 245 L 235 240 L 245 250 L 235 255 Z"
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

                {/* Hair */}
                <path
                  d="M 110 140 Q 105 100 150 95 Q 195 100 190 140 Q 190 120 150 115 Q 110 120 110 140 Z"
                  fill="#0E7490"
                />

                {/* Hair decoration */}
                <path d="M 165 105 L 175 95 L 170 110 Z" fill="#FBBF24" />
                <circle cx="172" cy="100" r="4" fill="#FBBF24" />

                {/* Face details */}
                <circle cx="135" cy="135" r="4" fill="#4B5563" />
                <circle cx="165" cy="135" r="4" fill="#4B5563" />
                <circle cx="125" cy="145" r="8" fill="#FCA5A5" opacity="0.5" />
                <circle cx="175" cy="145" r="8" fill="#FCA5A5" opacity="0.5" />

                {/* Mouth */}
                <ellipse cx="150" cy="155" rx="8" ry="12" fill="#4B5563" />
              </svg>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
