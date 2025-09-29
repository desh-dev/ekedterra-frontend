"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { PropertyCategory } from "@/lib/graphql/types";
import { useAppStore } from "@/providers/category-store-provider";

export const categories = [
  { id: "housing", label: "Homes", icon: "/homes-icon.png" },
  { id: "land", label: "Land", icon: "/land-icon.png" },
  { id: "business", label: "Stores", icon: "/stores-icon.png" },
];

const CategoryTabs = () => {
  const { category, setCategory, setType } = useAppStore((state) => state);
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    if (!isMobile) return;
    setScrolled(latest > 0);
  });
  const handleCategoryClick = (catId: PropertyCategory) => {
    if (catId !== "housing") {
      setType(undefined);
    }
    setCategory(catId);
  };

  return (
    <nav className="flex items-center space-x-14 md:space-x-8">
      {categories.map((cat) => (
        <motion.button
          key={cat.id}
          onClick={() => handleCategoryClick(cat.id as PropertyCategory)}
          className={`flex flex-col md:flex-row items-center space-x-2 pb-2 cursor-pointer transition-all ${
            category === cat.id
              ? "border-b-2 border-primary"
              : "hover:border-b-2 hover:border-gray-300"
          }`}
          animate={isMobile && scrolled ? { y: -2 } : { y: 0 }}
          transition={{
            type: "spring",
            duration: 0.1,
          }}
        >
          <motion.div
            initial={{ scale: 1, opacity: 1 }}
            animate={
              isMobile && scrolled
                ? { scale: 0, opacity: 0, display: "none" }
                : { scale: 1, opacity: 1 }
            }
            transition={{ duration: 0.1, ease: "easeInOut" }}
          >
            <Image src={cat.icon} alt={cat.label} width={60} height={60} />
          </motion.div>

          <span
            className={`text-sm transition-colors ${
              category === cat.id
                ? "font-semibold text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {cat.label}
          </span>
        </motion.button>
      ))}
    </nav>
  );
};

export default CategoryTabs;
