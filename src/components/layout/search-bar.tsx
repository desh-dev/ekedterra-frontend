"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import CategoryTabs from "../home/category-tabs";
import { Card } from "../ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

const countries = ["Cameroon"];
const cities = [
  "Buea",
  "Douala",
  "Yaounde",
  "Garoua",
  "Maroua",
  "Ngaoundere",
  "Bamenda",
  "Kribi",
  "Limbe",
];
const types = ["Apartment", "House", "Room", "Studio", "Hotel", "Guesthouse"];

const SearchBar = () => {
  const [country, setCountry] = useState("Search countries...");
  const [city, setCity] = useState("Search cities...");
  const [type, setType] = useState("");

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="w-full flex items-center h-16 bg-card border rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="w-full md:flex justify-between items-center hidden">
          {/* Country */}
          <div className="flex-1 px-6 py-2 border-b md:border-b-0 md:border-r">
            <div className="text-xs font-semibold text-center text-foreground mb-1">
              Country
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <input
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-transparent text-sm border-none outline-none"
                  placeholder="Search countries"
                />
              </PopoverTrigger>
              <PopoverContent className="p-0 w-[200px]">
                <Command>
                  <CommandInput className="border-none ring-0 outline-none focus:ring-0 focus:outline-none" />
                  <CommandList>
                    <CommandEmpty>No country found.</CommandEmpty>
                    <CommandGroup>
                      {countries.map((c) => (
                        <CommandItem key={c} onSelect={() => setCountry(c)}>
                          {c}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* City */}
          <div className="flex-1 px-6 py-2 border-b md:border-b-0 md:border-r cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="text-xs font-semibold text-foreground text-center mb-1">
              City
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-transparent text-sm placeholder:text-muted-foreground border-none outline-none cursor-pointer"
                  placeholder="Add city"
                />
              </PopoverTrigger>
              <PopoverContent className="p-0 w-[200px]">
                <Command>
                  <CommandInput className="border-none ring-0 outline-none focus:ring-0 focus:outline-none" />
                  <CommandList>
                    <CommandEmpty>No city found.</CommandEmpty>
                    <CommandGroup>
                      {cities.map((c) => (
                        <CommandItem key={c} onSelect={() => setCity(c)}>
                          {c}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex-1 px-6 py-2 pt-4">
            <div className="text-xs font-semibold text-center text-foreground mb-1">
              Type
            </div>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="bg-transparent border-none outline-none text-sm place-self-center mt-[-4px]">
                <SelectValue
                  placeholder="Select type of housing"
                  className="text-center"
                />
              </SelectTrigger>
              <SelectContent>
                {types.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-center p-2">
            <Button
              size="icon"
              className="rounded-full w-8 h-8 bg-primary hover:bg-primary/90"
            >
              <Search className="h-4 w-4 text-primary-foreground" />
            </Button>
          </div>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <div className="md:hidden flex gap-2 items-center justify-center w-full">
              <Search size={16} />
              <p className="text-sm font-bold text-gray-700">
                Start your search
              </p>
            </div>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[100vh] bg-muted">
            <SheetHeader>
              <SheetTitle className="sticky top-0 place-self-center pt-4">
                <CategoryTabs />
              </SheetTitle>
            </SheetHeader>

            {/* Accordion Sections */}
            <div className="px-3 space-y-2 overflow-y-auto">
              <Accordion type="single" collapsible className="w-full space-y-2">
                {/* Country */}
                <AccordionItem value="country" className="bg-white rounded-xl">
                  <AccordionTrigger className="px-4 py-3 text-base font-semibold rounded-xl hover:bg-gray-50 hover:no-underline">
                    Country{" "}
                    {country && country !== "Search countries..." && (
                      <span className="text-gray-500 text-center text-sm">
                        {" "}
                        {country}
                      </span>
                    )}
                  </AccordionTrigger>
                  <AccordionContent className="px-3 pb-3">
                    <div className="bg-card rounded-lg p-3">
                      <Command>
                        <CommandInput
                          placeholder="Search countries..."
                          className="border-none ring-0 outline-none focus:ring-0 focus:outline-none text-base"
                        />
                        <CommandList>
                          <CommandEmpty className="text-base">
                            No country found.
                          </CommandEmpty>
                          <CommandGroup>
                            <CommandItem
                              onSelect={() => setCountry("Nearby")}
                              className="cursor-pointer text-base"
                            >
                              Nearby
                            </CommandItem>
                            {countries.map((c) => (
                              <CommandItem
                                key={c}
                                onSelect={() => setCountry(c)}
                                className="cursor-pointer text-base"
                              >
                                {c}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* City */}
                <AccordionItem value="city" className="bg-white rounded-xl">
                  <AccordionTrigger className="px-4 py-3 text-base font-semibold rounded-xl hover:bg-gray-50 hover:no-underline">
                    City{" "}
                    {city && city !== "Search cities..." && (
                      <span className="text-gray-500 text-center text-sm">
                        {" "}
                        {city}
                      </span>
                    )}
                  </AccordionTrigger>
                  <AccordionContent className="px-3 pb-3">
                    <div className="bg-card rounded-lg p-3">
                      <Command>
                        <CommandInput
                          placeholder="Search cities..."
                          className="border-none ring-0 outline-none focus:ring-0 focus:outline-none text-base"
                        />
                        <CommandList>
                          <CommandEmpty className="text-base">
                            No city found.
                          </CommandEmpty>
                          <CommandGroup>
                            {cities.map((c) => (
                              <CommandItem
                                key={c}
                                onSelect={() => setCity(c)}
                                className="cursor-pointer text-base"
                              >
                                {c}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Type */}
                <AccordionItem value="type" className="bg-white rounded-xl">
                  <AccordionTrigger className="px-4 py-3 text-base font-semibold rounded-xl hover:bg-gray-50 hover:no-underline">
                    Type{" "}
                    {type && (
                      <span className="text-gray-500 text-center text-sm">
                        {" "}
                        {type}
                      </span>
                    )}
                  </AccordionTrigger>
                  <AccordionContent className="px-3 pb-3">
                    <div className="bg-card border-none rounded-lg p-3">
                      <ul className="space-y-2">
                        {types.map((t) => (
                          <li
                            key={t}
                            onClick={() => setType(t)}
                            className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-muted transition text-base ${
                              type === t ? "bg-muted font-medium" : ""
                            }`}
                          >
                            {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <SheetFooter className="sticky bottom-0 left-0 w-full bg-muted px-4 pb-6 shadow-md flex flex-row justify-between items-center">
              <SheetClose asChild>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-md font-semibold"
                >
                  Cancel
                </Button>
              </SheetClose>
              <Button
                size="lg"
                className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-md font-semibold"
              >
                <Search className="h-5 w-5 text-primary-foreground" />
                <span>Search</span>
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default SearchBar;
