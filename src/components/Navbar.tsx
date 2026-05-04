'use client';

interface NavbarProps {
  credits: number;
  isLoaded: boolean;
}

export default function Navbar({ credits, isLoaded }: NavbarProps) {
  return (
    <nav className="relative z-20 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full">
      {/* Logo */}
      <div className="flex flex-col">
        <span className="text-2xl font-black text-white tracking-tight">
          Rizzume
          <span className="text-purple-400 ml-0.5">✦</span>
        </span>
        <span className="text-[10px] tracking-[0.25em] text-slate-500 uppercase font-medium -mt-0.5">
          Level up your application
        </span>
      </div>

      {/* Nav links */}
      <div className="hidden md:flex items-center gap-6 text-sm text-slate-400">
        <button className="hover:text-white transition-colors">Get Started</button>
        <button className="hover:text-white transition-colors">How It Works</button>
        <button className="hover:text-white transition-colors">Sign In</button>
        <span className="px-2.5 py-0.5 text-xs rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 font-medium">
          Beta
        </span>
        {isLoaded && (
          <span className="credit-badge">
            {credits} credit{credits !== 1 ? 's' : ''} left
          </span>
        )}
      </div>

      {/* Mobile credits */}
      {isLoaded && (
        <span className="md:hidden credit-badge">
          {credits} left
        </span>
      )}
    </nav>
  );
}
