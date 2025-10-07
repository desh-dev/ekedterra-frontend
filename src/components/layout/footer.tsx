"use client";

import useIsDesktop from "@/hooks/useIsDesktop";

export default function Footer() {
  const { isStandalone } = useIsDesktop();
  
  if (isStandalone) return null;
  
  return (
    <footer className="w-full bg-gray-50 border-t border-gray-200 pt-10 pb-4 mt-8 text-sm">
      <div className="max-w-7xl mx-auto px-4">
        {/* Inspiration Section */}
        <div className="mb-10">
          <h2 className="font-semibold text-lg mb-4">
            Inspiration for future getaways
          </h2>
          <div className="flex flex-wrap gap-8 border-b border-gray-200 pb-4 mb-6">
            <div className="flex gap-8 w-full">
              <div className="flex flex-col gap-2 min-w-[180px]">
                <div className="font-medium border-b-2 border-black pb-1 w-fit">
                  Travel tips & inspiration
                </div>
                <div className="font-semibold">Family travel hub</div>
                <div className="text-gray-500">Tips and inspiration</div>
                <div className="font-semibold">Family budget travel</div>
                <div className="text-gray-500">Get there for less</div>
                <div className="font-semibold">
                  Vacation ideas for any budget
                </div>
                <div className="text-gray-500">
                  Make it special without making it expensive
                </div>
                <div className="font-semibold">Travel Europe on a budget</div>
                <div className="text-gray-500">
                  How to take the kids to Europe for less
                </div>
                <div className="font-semibold">Outdoor adventure</div>
                <div className="text-gray-500">
                  Explore nature with the family
                </div>
                <div className="font-semibold">Bucket list national parks</div>
                <div className="text-gray-500">
                  Must-see parks for family travel
                </div>
                <div className="font-semibold">Kid-friendly state parks</div>
                <div className="text-gray-500">
                  Check out these family-friendly hi
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Links Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="font-semibold mb-2">Support</div>
            <ul className="space-y-1">
              <li>
                <a href="#" className="hover:underline">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Get help with a safety issue
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  AirCover
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Anti-discrimination
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Disability support
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Cancellation options
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Report neighborhood concern
                </a>
              </li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-2">Hosting</div>
            <ul className="space-y-1">
              <li>
                <a href="#" className="hover:underline">
                  ekedterra your home
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  ekedterra your experience
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  ekedterra your service
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  AirCover for Hosts
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Hosting resources
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Community forum
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Hosting responsibly
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  ekedterra-friendly apartments
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Join a free Hosting class
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Find a co-host
                </a>
              </li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-2">ekedterra</div>
            <ul className="space-y-1">
              <li>
                <a href="#" className="hover:underline">
                  2025 Summer Release
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Newsroom
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Investors
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Gift cards
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  ekedterra.org emergency stays
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between border-t border-gray-200 pt-4">
          <div className="text-gray-500 mb-2 md:mb-0">
            &copy; {new Date().getFullYear()} ekedterra. Terms &nbsp;·&nbsp;
            Sitemap &nbsp;·&nbsp; Privacy &nbsp;·&nbsp; Your Privacy Choices
          </div>
          <div className="flex items-center space-x-4 text-gray-500">
            <span>English (US)</span>
            <span>$ USD</span>
            <span className="inline-block w-5 h-5 bg-gray-300 rounded-full" />
            <span className="inline-block w-5 h-5 bg-gray-300 rounded-full" />
            <span className="inline-block w-5 h-5 bg-gray-300 rounded-full" />
          </div>
        </div>
      </div>
    </footer>
  );
}
