import Link from "next/link";

export default function Navbar() {
  return (
    <header className="border-b border-white/10">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10 lg:px-16">
        <Link href="/" className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-[#c9a861]" />
          <p className="text-xs uppercase tracking-[0.35em] text-white/60">
            AURELIAN CAPITAL
          </p>
        </Link>

        <nav className="flex items-center gap-6 text-xs uppercase tracking-[0.28em] text-white/45">
          <Link href="/">Home</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/deals/new">New Deal</Link>
        </nav>
      </div>
    </header>
  );
}