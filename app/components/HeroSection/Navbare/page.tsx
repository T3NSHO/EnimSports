"use client";
import * as React from "react";
import { Menu, X } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/app/components/ui/navigation-menu";
import Image from "next/image";
const classNames = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="sticky top-0 z-50 w-full bg-gray-900 shadow-lg border-b border-gray-800">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Image
              src="/logo.png"
              width={800}
              height={500}
              alt="ENSMR Sports Logo"
              className="h-10 w-auto sm:h-12"
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-base lg:text-lg bg-transparent text-gray-200 hover:text-blue-400 transition-colors duration-200">
                    About ENIM Sports
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 w-[300px] md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr] bg-gray-900 border border-gray-800">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <a
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-gray-800 to-gray-900 p-6 no-underline outline-none focus:shadow-md hover:scale-105 transition-transform duration-200 text-gray-200"
                            href="/"
                          >
                            <div className="mb-2 mt-4 text-lg font-medium">
                              Sports Committee
                            </div>
                            <p className="text-sm leading-tight text-gray-400">
                              Managing sports activities and facilities at École
                              Nationale Supérieure des Mines de Rabat.
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <ListItem href="/about/rules" title="ENIM">
                        Learn more about L'École Nationale Supérieure des Mines
                        de Rabat.
                      </ListItem>
                      <ListItem href="/about/rules" title="Regulations">
                        Facility usage guidelines and tournament participation
                        rules.
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-base lg:text-lg bg-transparent text-gray-200 hover:text-blue-400 transition-colors duration-200">
                    Tournaments
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[300px] gap-3 p-4 md:w-[400px] md:grid-cols-2 lg:w-[500px] bg-gray-900 border border-gray-800">
                      <ListItem
                        href="/components/HeroSection/Navbare/UpcomingTournments"
                        title="Upcoming Tournaments"
                      >
                        View and register for upcoming sports competitions.
                      </ListItem>
                      <ListItem
                        href="/components/HeroSection/Navbare/OngoingTournments"
                        title="ongoing Matches Results"
                      >
                        view details of the ongoing Matches.
                      </ListItem>
                      <ListItem
                        href="/tournaments/register"
                        title="Team Registration"
                      >
                        Register your team for upcoming tournaments.
                      </ListItem>
                      <ListItem
                        href="/tournaments/schedule"
                        title="Match Schedule"
                      >
                        View the complete tournament schedule and fixtures.
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Login Button */}
          <div className="hidden md:block">
            <a
              href="/login"
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200"
            >
              Login
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-blue-400 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isOpen ? "block" : "hidden"}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-900">
          <div className="space-y-1">
            <button
              className="w-full text-left px-3 py-2 text-base font-medium text-gray-300 hover:text-blue-400 hover:bg-gray-800 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              About ENIM Sports
            </button>
            <div className="pl-4">
              <a
                href="/"
                className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-blue-400 hover:bg-gray-800 rounded-md"
                onClick={() => setIsOpen(false)}
              >
                Sports Committee
              </a>
              <a
                href="/about/rules"
                className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-blue-400 hover:bg-gray-800 rounded-md"
                onClick={() => setIsOpen(false)}
              >
                ENIM
              </a>
              <a
                href="/about/rules"
                className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-blue-400 hover:bg-gray-800 rounded-md"
                onClick={() => setIsOpen(false)}
              >
                Regulations
              </a>
            </div>
          </div>

          <div className="space-y-1">
            <button
              className="w-full text-left px-3 py-2 text-base font-medium text-gray-300 hover:text-blue-400 hover:bg-gray-800 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Tournaments
            </button>
            <div className="pl-4">
              <a
                href="/tournaments"
                className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-blue-400 hover:bg-gray-800 rounded-md"
                onClick={() => setIsOpen(false)}
              >
                Upcoming Tournaments
              </a>
              <a
                href="/tournaments/results"
                className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-blue-400 hover:bg-gray-800 rounded-md"
                onClick={() => setIsOpen(false)}
              >
                Tournament Results
              </a>
              <a
                href="/tournaments/register"
                className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-blue-400 hover:bg-gray-800 rounded-md"
                onClick={() => setIsOpen(false)}
              >
                Team Registration
              </a>
              <a
                href="/tournaments/schedule"
                className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-blue-400 hover:bg-gray-800 rounded-md"
                onClick={() => setIsOpen(false)}
              >
                Match Schedule
              </a>
            </div>
          </div>

          <a
            href="/login"
            className="block w-full px-3 py-2 text-center font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            onClick={() => setIsOpen(false)}
          >
            Login
          </a>
        </div>
      </div>
    </div>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={classNames(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-all duration-200 hover:bg-gray-800 hover:text-blue-400 focus:bg-gray-800 focus:text-blue-400 text-gray-200",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-gray-400">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
