import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import SignoutButton from "@/components/auth/SignoutButton"

interface ProfileHeaderProps {
  name?: string | null
  email?: string | null
  image?: string | null
  stats: { label: string; value: string }[]
}

const initials = (name?: string | null, email?: string | null) =>
  (name || email || "?")
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()

export default function ProfileHeader({ name, email, image, stats }: ProfileHeaderProps) {
  return (
    <header className="space-y-8">
      <div className="flex items-center gap-4 sm:gap-6">
        <Avatar className="size-16 border-2 border-foreground sm:size-24">
          <AvatarImage src={image || undefined} alt="" referrerPolicy="no-referrer" />
          <AvatarFallback className="text-xl font-bold sm:text-3xl">{initials(name, email)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-3xl font-black tracking-tight sm:text-5xl">{name || "Your account"}</h1>
          <p className="truncate text-sm text-muted-foreground">{email}</p>
        </div>
        <div className="hidden sm:block">
          <SignoutButton />
        </div>
      </div>

      <dl className="grid grid-cols-3 divide-x rounded-xl border bg-card">
        {stats.map((stat) => (
          <div key={stat.label} className="px-4 py-4 sm:px-6 sm:py-5">
            <dd className="text-2xl font-bold tabular-nums sm:text-4xl">{stat.value}</dd>
            <dt className="mt-1 text-xs text-muted-foreground sm:text-sm">{stat.label}</dt>
          </div>
        ))}
      </dl>

      <div className="sm:hidden">
        <SignoutButton />
      </div>
    </header>
  )
}
