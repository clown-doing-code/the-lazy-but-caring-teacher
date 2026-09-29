import { Avatar, AvatarFallback } from "@/components/ui/avatar"

type Props = {
  name: string
  src?: string
  /** Sizes the avatar box. Omit to use the shadcn `default` size. */
  className?: string
  /** Size of the initials shown when there is no photo. */
  initialsClassName?: string
}

function initialsFrom(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

// Base UI's Avatar parts read context, which does not cross Astro's
// per-component SSR boundary, so the parts are composed in one component.
//
// The photo is a plain <img>, not Base UI's AvatarImage: that part only mounts
// after a client-side `load` event (`enabled: keepMounted || mounted`, and
// keepMounted defaults to false), so it renders nothing in static HTML and only
// the initials fallback appears. Photos here are static files in /public, so the
// markup is emitted directly and initials stand in only when no photo is set.
export function UserAvatar({ name, src, className, initialsClassName }: Props) {
  return (
    <Avatar className={className}>
      {src ? (
        <img
          src={src}
          alt=""
          loading="lazy"
          decoding="async"
          className="aspect-square size-full rounded-full object-cover"
        />
      ) : (
        <AvatarFallback className={initialsClassName}>
          {initialsFrom(name)}
        </AvatarFallback>
      )}
    </Avatar>
  )
}
