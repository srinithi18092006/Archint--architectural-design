export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative flex items-center justify-center">
        {/* Glow behind the logo */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#4CAF50] to-[#81C784] blur-md opacity-45 rounded-xl"></div>
        {/* Logo Container */}
        <div className="relative bg-neutral-900 border border-neutral-800 p-2.5 rounded-xl shadow-xl flex items-center justify-center w-10 h-10">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-6 text-[#4CAF50] drop-shadow-[0_0_8px_rgba(76,175,80,0.5)]"
          >
            {/* Architectural Isometric Cube / A symbol */}
            <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="url(#logo-grad-green)" />
            <path d="M2 17l10 5 10-5" stroke="url(#logo-grad-green)" />
            <path d="M2 12l10 5 10-5" stroke="url(#logo-grad-green)" />
            <path d="M12 12v10" stroke="url(#logo-grad-green)" />
            <defs>
              <linearGradient id="logo-grad-green" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4CAF50" />
                <stop offset="100%" stopColor="#81C784" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="flex items-baseline font-black font-sans leading-none tracking-tight">
          <span className="text-xl bg-gradient-to-r from-[#4CAF50] to-[#81C784] bg-clip-text text-transparent font-extrabold" style={{ background: 'linear-gradient(135deg, #4CAF50, #81C784)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Smart</span>
          <span className="text-xl text-neutral-800 dark:text-neutral-100 ml-1">AI Plan</span>
        </div>
        <p className="text-[9px] uppercase tracking-[0.15em] text-neutral-500 dark:text-neutral-400 font-bold leading-none mt-1">
          Intelligent Architecture
        </p>
      </div>
    </div>
  );
}
