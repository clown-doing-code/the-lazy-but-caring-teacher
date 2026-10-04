import { Avatar, AvatarFallback } from "@/components/ui/avatar"

type Props = {
  name: string
  /** Already-optimized URL. Omit to show initials instead. */
  src?: string
  /** Intrinsic size of `src`, emitted so the box is reserved before paint. */
  width?: number
  height?: number
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
// per-component SSR boundary, so the parts must be composed inside a single
// React component. Astro renders each .tsx it encounters as its own root, which
// is why this lives here and user-avatar.astro cannot: splitting the two parts
// across the boundary leaves AvatarFallback without the root it reads from.
//
// The photo is a plain <img>, not Base UI's AvatarImage: that part only mounts
// after a client-side `load` event (`enabled: keepMounted || mounted`, and
// keepMounted defaults to false), so it renders nothing in static HTML and only
// the initials fallback appears.
//
// There is no `loading="lazy"` here: this avatar sits in the byline, above the
// fold on every page that shows one, so deferring it only made it pop in after
// the text around it.
export function UserAvatarFrame({
  name,
  src,
  width,
  height,
  className,
  initialsClassName,
}: Props) {
  return (
    <Avatar className={className}>
      {src ? (
        <img
          src={src}
          alt=""
          decoding="async"
          width={width}
          height={height}
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
