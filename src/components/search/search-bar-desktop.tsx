"use client";

import Image from "next/image";
import { Button } from "../ui/button";
import { Search } from "lucide-react";
import { useAppStore } from "@/providers/app-store-provider";
import { useSearchParams } from "next/navigation";
import CategoryTabs, { categories } from "../home/category-tabs";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { cities, countries } from "../layout/search-bar";
import { PropertyType } from "@/lib/graphql/types";
import { useRouter } from "@/i18n/routing";

const types = ["Apartment", "House", "Room", "Studio", "Hotel", "Guesthouse"];

const dropdownVariants = {
  hidden: { opacity: 0, y: -8, pointerEvents: "none" },
  visible: { opacity: 1, y: 0, pointerEvents: "auto" },
};

const SearchBarDesktop = () => {
  const { category, country, setCountry, city, setCity, type, setType } =
    useAppStore((state) => state);

  const router = useRouter();
  const params = useSearchParams();
  const param = {
    country: params.get("country") ?? undefined,
    city: params.get("city") ?? undefined,
    type: params.get("type") ?? undefined,
  };
  const COUNTRY = country ?? param.country;
  const CITY = city ?? param.city;
  const TYPE = type ?? param.type;
  const handleSearch = () => {
    router.push(`/search?country=${COUNTRY}&city=${CITY}&type=${TYPE}`);
  };

  const cat = categories.find((c) => c.id === category);

  const [hovered, setHovered] = useState<null | "country" | "city" | "type">(
    null
  );

  return (
    <div className="relative min-w-[480px] flex items-center h-12 bg-card border rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 px-2 text-base">
      {/* Country */}
      <div
        className="relative flex items-center gap-2 px-5 py-2 border-r cursor-pointer"
        onMouseEnter={() => setHovered("country")}
        onMouseLeave={() => setHovered(null)}
      >
        <Image
          src={cat?.icon as string}
          alt={cat?.label as string}
          width={32}
          height={32}
        />
        <span className="font-semibold">
          {country || param.country || "All Countries"}
        </span>

        <AnimatePresence>
          {hovered === "country" && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={dropdownVariants}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 mt-3 bg-white rounded-xl shadow-lg p-4 w-80 z-50"
            >
              <ul className="space-y-3 text-base">
                <CategoryTabs />
                {countries.map((c) => (
                  <li
                    key={c}
                    className={`cursor-pointer hover:text-primary ${
                      country === c ? "font-bold text-primary" : ""
                    }`}
                    onClick={() => setCountry(c)}
                  >
                    {c}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* City */}
      <div
        className="w-full relative flex-1 px-5 py-2 border-r cursor-pointer"
        onMouseEnter={() => setHovered("city")}
        onMouseLeave={() => setHovered(null)}
      >
        <span className="font-semibold">
          {city || param.city || "All Cities"}
        </span>

        <AnimatePresence>
          {hovered === "city" && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={dropdownVariants}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 mt-3 bg-white rounded-xl shadow-lg p-4 w-72 max-h-72 overflow-y-auto z-50"
            >
              <ul className="grid grid-cols-2 gap-3 text-base">
                {cities.map((c) => (
                  <li
                    key={c}
                    className={`cursor-pointer hover:text-primary ${
                      city === c ? "font-bold text-primary" : ""
                    }`}
                    onClick={() => setCity(c)}
                  >
                    {c}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Type */}
      <div
        className="w-full relative flex-1 px-5 py-2 cursor-pointer"
        onMouseEnter={() => setHovered("type")}
        onMouseLeave={() => setHovered(null)}
      >
        <span className="font-semibold">
          {type || param.type || "All Types"}
        </span>

        <AnimatePresence>
          {hovered === "type" && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={dropdownVariants}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 mt-3 bg-white rounded-xl shadow-lg p-4 w-64 z-50"
            >
              <ul className="grid grid-cols-2 gap-3 text-base">
                {types.map((t) => (
                  <li
                    key={t}
                    className={`cursor-pointer hover:text-primary ${
                      type === t ? "font-bold text-primary" : ""
                    }`}
                    onClick={() => setType(t as PropertyType)}
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Search button */}
      <div className="flex items-center justify-center pl-2">
        <Button
          size="icon"
          onClick={handleSearch}
          className="rounded-full w-10 h-10 bg-primary hover:bg-primary/90"
        >
          <Search className="h-5 w-5 text-primary-foreground" />
        </Button>
      </div>
    </div>
  );
};

export default SearchBarDesktop;
