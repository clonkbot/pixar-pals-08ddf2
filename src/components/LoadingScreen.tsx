export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          {/* Animated film reel */}
          <div className="w-20 h-20 md:w-24 md:h-24 mx-auto relative">
            <div className="absolute inset-0 border-4 border-orange rounded-full animate-spin-slow" />
            <div className="absolute inset-2 border-4 border-pink rounded-full animate-spin-reverse" />
            <div className="absolute inset-4 bg-gradient-to-br from-orange to-pink rounded-full animate-pulse" />
          </div>

          {/* Sparkles */}
          <div className="absolute -top-2 -right-2 animate-twinkle">
            <svg className="w-6 h-6 text-yellow" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.6-6.3 4.6 2.3-7-6-4.6h7.6z" />
            </svg>
          </div>
        </div>

        <h2 className="font-baloo text-2xl md:text-3xl text-brown mt-6 animate-bounce-gentle">
          Loading Magic...
        </h2>
      </div>
    </div>
  );
}
