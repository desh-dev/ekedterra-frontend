'use client';

import { useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';
import CategoryTabs from '../home/category-tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';
import { useAppStore } from '@/providers/app-store-provider';
import { usePathname, useRouter } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';
import { PropertyType } from '@/lib/graphql/types';
import useIsDesktop from '@/hooks/useIsDesktop';
import { useTranslations } from 'next-intl';

export const countries = ['Cameroon'];
export const cities = [
  'Buea',
  'Douala',
  'Yaounde',
  'Garoua',
  'Maroua',
  'Ngaoundere',
  'Bamenda',
  'Kribi',
  'Limbe',
];
const types = ['Apartment', 'House', 'Room', 'Studio', 'Hotel', 'Guesthouse'];

const SearchBar = () => {
  const { category, country, setCountry, city, setCity, type, setType } =
    useAppStore((state) => state);
  const [tempCountry, setTempCountry] = useState(country);
  const [tempCity, setTempCity] = useState(city);
  const [tempType, setTempType] = useState(type);
  const router = useRouter();
  const searchParams = useSearchParams();
  const path = usePathname();
  const sheetCloseRef = useRef<HTMLButtonElement>(null);
  const { isStandalone, isIOS } = useIsDesktop();
  const t = useTranslations('common');

  const handleSearch = () => {
    setCountry(tempCountry);
    setCity(tempCity);
    setType(tempType);

    if (path !== '/search') {
      const params = new URLSearchParams();
      if (country) params.append('country', country);
      if (city) params.append('city', city);
      if (type) params.append('type', type);
      router.push(`/search?${params.toString()}`);
    }
    sheetCloseRef.current?.click();
  };
  const onClose = () => {
    setTempCountry(undefined);
    setTempCity(undefined);
    setTempType(undefined);
    setCountry(undefined);
    setCity(undefined);
    setType(undefined);
  };
  const COUNTRY = country ?? searchParams.get('country') ?? '';
  const CITY = city ?? searchParams.get('city') ?? '';
  const TYPE = type ?? searchParams.get('type') ?? '';

  const displaySearchText = useMemo(
    () => () => {
      if (TYPE && CITY && COUNTRY) {
        return `${TYPE}s in ${CITY}`;
      } else if (CITY && COUNTRY) {
        return `${category} in ${CITY}`;
      } else if (COUNTRY) {
        return `${category} in ${COUNTRY}`;
      } else if (TYPE) {
        return `All ${TYPE}s`;
      } else {
        return `All ${category}`;
      }
    },
    [category, COUNTRY, CITY, TYPE]
  );

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="w-full flex items-center h-16 bg-card border rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="w-full md:flex justify-between items-center hidden">
          {/* Country */}
          <div className="flex-1 px-6 py-2 border-b md:border-b-0 md:border-r">
            <div className="text-sm font-semibold text-center text-foreground mb-1">
              {t('country')}
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <input
                  value={tempCountry ?? t('searchCountries')}
                  // onChange={(e) => setTempCountry(e.target.value)}
                  className="w-full bg-transparent text-sm border-none outline-none cursor-pointer placeholder:text-muted-foreground"
                  placeholder={t('searchCountries')}
                />
              </PopoverTrigger>
              <PopoverContent className="p-0 w-[200px]">
                <Command>
                  <CommandInput className="border-none ring-0 outline-none focus:ring-0 focus:outline-none" />
                  <CommandList>
                    <CommandEmpty>{t('noCountryFound')}</CommandEmpty>
                    <CommandGroup>
                      {countries.map((c) => (
                        <CommandItem key={c} onSelect={() => setTempCountry(c)}>
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
          <div className="flex-1 px-6 py-2 border-b md:border-b-0 md:border-r cursor-pointer">
            <div className="text-sm font-semibold text-foreground text-center mb-1">
              {t('city')}
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <input
                  value={tempCity ?? t('searchCities')}
                  // onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-transparent text-sm placeholder:text-muted-foreground border-none outline-none cursor-pointer"
                  placeholder={t('addCity')}
                />
              </PopoverTrigger>
              <PopoverContent className="p-0 w-[200px]">
                <Command>
                  <CommandInput className="border-none ring-0 outline-none focus:ring-0 focus:outline-none" />
                  <CommandList>
                    <CommandEmpty>{t('noCityFound')}</CommandEmpty>
                    <CommandGroup>
                      {cities.map((c) => (
                        <CommandItem key={c} onSelect={() => setTempCity(c)}>
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
            <div className="text-sm font-semibold text-center text-foreground mb-1">
              {t('type')}
            </div>
            <Select
              value={tempType}
              //@ts-expect-error Object is possibly 'null'.
              onValueChange={setTempType}
            >
              <SelectTrigger className="bg-transparent border-none outline-none text-sm place-self-center mt-[-4px]">
                <SelectValue
                  placeholder={t('selectTypeOfHousing')}
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
              onClick={handleSearch}
              className="rounded-full w-10 h-10 bg-primary hover:bg-primary/90"
            >
              <Search className="h-4 w-4 text-primary-foreground" />
            </Button>
          </div>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <div className="md:hidden flex justify-center w-full">
              {path === '/search' ? (
                <p className="text-sm font-bold text-gray-700 capitalize">
                  {displaySearchText()}
                </p>
              ) : (
                <div className="flex items-center gap-2">
                  <Search size={16} />
                  <p className="text-sm font-bold text-gray-700">
                    {t('startYourSearch')}
                  </p>
                </div>
              )}
            </div>
          </SheetTrigger>
          <SheetContent
            side="bottom"
            className={`${
              isStandalone && isIOS ? 'h-[95vh]' : 'h-[90vh]'
            } bg-muted`}
          >
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
                    {t('country')}{' '}
                    {tempCountry && (
                      <span className="text-gray-500 text-center text-sm">
                        {' '}
                        {tempCountry}
                      </span>
                    )}
                  </AccordionTrigger>
                  <AccordionContent className="px-3 pb-3">
                    <div className="bg-card rounded-lg p-3">
                      <Command>
                        <CommandInput
                          placeholder={t('searchCountries')}
                          className="border-none ring-0 outline-none focus:ring-0 focus:outline-none text-base"
                        />
                        <CommandList>
                          <CommandEmpty className="text-base">
                            {t('noCountryFound')}
                          </CommandEmpty>
                          <CommandGroup>
                            {countries.map((c) => (
                              <CommandItem
                                key={c}
                                onSelect={() => setTempCountry(c)}
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
                    {t('city')}{' '}
                    {tempCity && (
                      <span className="text-gray-500 text-center text-sm">
                        {' '}
                        {tempCity}
                      </span>
                    )}
                  </AccordionTrigger>
                  <AccordionContent className="px-3 pb-3">
                    <div className="bg-card rounded-lg p-3">
                      <Command>
                        <CommandInput
                          placeholder={t('searchCities')}
                          className="border-none ring-0 outline-none focus:ring-0 focus:outline-none text-base"
                        />
                        <CommandList>
                          <CommandEmpty className="text-base">
                            {t('noCityFound')}
                          </CommandEmpty>
                          <CommandGroup>
                            {cities.map((c) => (
                              <CommandItem
                                key={c}
                                onSelect={() => setTempCity(c)}
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
                {category === 'housing' && (
                  <AccordionItem value="type" className="bg-white rounded-xl">
                    <AccordionTrigger className="px-4 py-3 text-base font-semibold rounded-xl hover:bg-gray-50 hover:no-underline">
                      {t('type')}{' '}
                      {tempType && (
                        <span className="text-gray-500 text-center text-sm">
                          {' '}
                          {tempType}
                        </span>
                      )}
                    </AccordionTrigger>
                    <AccordionContent className="px-3 pb-3">
                      <div className="bg-card border-none rounded-lg p-3">
                        <ul className="space-y-2">
                          {types.map((t) => (
                            <li
                              key={t}
                              onClick={() => setTempType(t as PropertyType)}
                              className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-muted transition text-base ${
                                type === t ? 'bg-muted font-medium' : ''
                              }`}
                            >
                              {t}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}
              </Accordion>
            </div>

            <SheetFooter>
              <SheetClose asChild>
                <button ref={sheetCloseRef} className="hidden"></button>
              </SheetClose>
              <Button
                size="lg"
                variant="outline"
                onClick={onClose}
                className="text-md font-semibold"
              >
                {t('clear')}
              </Button>
              <Button
                size="lg"
                onClick={handleSearch}
                className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-md font-semibold"
              >
                <Search className="h-5 w-5 text-primary-foreground" />
                <span>{t('search')}</span>
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default SearchBar;
