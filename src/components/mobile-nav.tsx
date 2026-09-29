import { MenuIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { NAV, type NavItem } from "@/config"
import { cn } from "cn"

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href)
}

export function MobileNav({ pathname }: { pathname: string }) {
  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground sm:hidden"
          />
        }
        aria-label="Open menu"
      >
        <MenuIcon />
      </SheetTrigger>
      <SheetContent side="right" className="w-64">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 p-4" aria-label="Mobile">
          {NAV.map((item: NavItem) => {
            const active = isActive(pathname, item.href)
            return (
              <SheetClose
                key={item.href}
                nativeButton={false}
                render={<a href={item.href} />}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-sm px-2 py-1.5 text-sm transition-colors hover:bg-muted",
                  active
                    ? "font-medium text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {item.label}
              </SheetClose>
            )
          })}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
