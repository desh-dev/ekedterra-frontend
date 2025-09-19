"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";

const categories = [
  { id: "homes", label: "Homes", icon: "/homes-icon.png" },
  { id: "land", label: "Land", icon: "/land-icon.png" },
  { id: "stores", label: "Stores", icon: "/stores-icon.png" },
];

const CategoryTabs = () => {
  const [activeTab, setActiveTab] = useState("homes");
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

  return (
    <nav className="flex items-center space-x-14 md:space-x-8">
      {categories.map((cat) => (
        <motion.button
          key={cat.id}
          onClick={() => setActiveTab(cat.id)}
          className={`flex flex-col md:flex-row items-center space-x-2 pb-2 cursor-pointer transition-all ${
            activeTab === cat.id
              ? "border-b-2 border-primary"
              : "hover:border-b-2 hover:border-gray-300"
          }`}
          animate={isMobile && scrolled ? { y: -40 } : { y: 0 }}
          transition={{
            type: "spring",
            duration: 0.1,
          }}
        >
          <motion.div
            initial={{ scale: 1, opacity: 1 }}
            animate={
              isMobile && scrolled
                ? { scale: 0, opacity: 0 }
                : { scale: 1, opacity: 1 }
            }
            transition={{ duration: 0.1, ease: "backIn" }}
          >
            <Image src={cat.icon} alt={cat.label} width={40} height={40} />
          </motion.div>

          <span
            className={`text-sm transition-colors ${
              activeTab === cat.id
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
