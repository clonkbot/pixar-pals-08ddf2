import { useConvexAuth } from "convex/react";
import { AuthScreen } from "./components/AuthScreen";
import { VideoStudio } from "./components/VideoStudio";
import { LoadingScreen } from "./components/LoadingScreen";

export default function App() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-cream relative overflow-hidden">
      {/* Magical background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 md:w-64 md:h-64 bg-gradient-to-br from-pink/30 to-orange/20 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/3 right-10 w-24 h-24 md:w-48 md:h-48 bg-gradient-to-br from-sky/30 to-mint/20 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute bottom-20 left-1/4 w-28 h-28 md:w-56 md:h-56 bg-gradient-to-br from-yellow/30 to-purple/20 rounded-full blur-3xl animate-float-slow" />

        {/* Floating stars */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          >
            <svg className="w-3 h-3 md:w-4 md:h-4 text-yellow" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.6-6.3 4.6 2.3-7-6-4.6h7.6z" />
            </svg>
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10">
        {isAuthenticated ? <VideoStudio /> : <AuthScreen />}
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 py-3 text-center z-20 bg-gradient-to-t from-cream via-cream/80 to-transparent">
        <p className="text-xs text-brown/40 font-nunito">
          Requested by @web-user · Built by @clonkbot
        </p>
      </footer>
    </div>
  );
}
