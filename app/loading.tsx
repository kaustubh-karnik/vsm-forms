import { Text } from "@/components/retroui/Text";

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[color:var(--color-cream)] z-50 p-4">
      {/* Immersive backdrop paper grain */}
      <div className="absolute inset-0 opacity-[0.035] mix-blend-overlay pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
      }} />

      {/* Retro loading card */}
      <div className="w-full max-w-[320px] rounded-[24px] border-2 border-black bg-[color:var(--color-card)] shadow-[6px_6px_0_0_#000] overflow-hidden">
        {/* Header bar */}
        <div className="h-10 w-full border-b-2 border-black bg-saffron flex items-center justify-between px-4 relative overflow-hidden">
          <div className="flex gap-1.5 z-10">
            <span className="w-2.5 h-2.5 rounded-full border border-black bg-[#FF5F56]" />
            <span className="w-2.5 h-2.5 rounded-full border border-black bg-[#FFBD2E]" />
            <span className="w-2.5 h-2.5 rounded-full border border-black bg-[#27C93F]" />
          </div>
          <div className="text-[8px] font-mono font-bold uppercase tracking-[0.2em] text-white z-10">
            VSM FORMS...
          </div>
        </div>

        {/* Content */}
        <div className="p-6 text-center space-y-5">
          <div className="flex justify-center">
            {/* Custom retro spinner: VSM Stamp logo static */}
            <div className="relative flex h-14 w-14 items-center justify-center rounded-full border-2 border-black bg-[color:var(--color-card)] shadow-[2px_2px_0_0_#000]">
              <img
                src="/logo.png"
                alt="Loading..."
                className="h-9 w-9 object-contain"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Text as="h3" className="font-mono text-xs font-bold uppercase tracking-wider text-dark">
              Vivekanand Seva Mandal
            </Text>
            <p className="font-mono text-[9px] text-muted-foreground animate-pulse">
              Loading content, please wait...
            </p>
          </div>

          {/* Progress bar container */}
          <div className="w-full h-4 border-2 border-black bg-[color:var(--color-card)] rounded-md overflow-hidden relative">
            <div 
              className="absolute top-0 bottom-0 left-0 bg-saffron border-r-2 border-black animate-[loading-bar_1.2s_infinite_linear]" 
              style={{ width: "30%" }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
