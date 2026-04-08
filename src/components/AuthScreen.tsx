import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";

export function AuthScreen() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      await signIn("password", formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnonymous = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signIn("anonymous");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      {/* Logo and title */}
      <div className="text-center mb-8 md:mb-12 animate-fade-in">
        <div className="relative inline-block mb-4">
          {/* Film clapboard icon */}
          <div className="w-20 h-20 md:w-28 md:h-28 bg-gradient-to-br from-orange to-pink rounded-3xl shadow-xl flex items-center justify-center transform -rotate-6 hover:rotate-0 transition-transform duration-500">
            <svg className="w-10 h-10 md:w-14 md:h-14 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/>
            </svg>
          </div>
          {/* Sparkle */}
          <div className="absolute -top-2 -right-2 animate-twinkle">
            <svg className="w-8 h-8 text-yellow drop-shadow-lg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.6-6.3 4.6 2.3-7-6-4.6h7.6z" />
            </svg>
          </div>
        </div>

        <h1 className="font-baloo text-4xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-orange via-pink to-purple">
          PixarPals
        </h1>
        <p className="font-nunito text-brown/70 text-base md:text-lg mt-2">
          Create magical animated videos for kids!
        </p>
      </div>

      {/* Auth card */}
      <div className="w-full max-w-md bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-6 md:p-8 border-4 border-white animate-slide-up">
        <h2 className="font-baloo text-2xl md:text-3xl text-brown text-center mb-6">
          {flow === "signIn" ? "Welcome Back!" : "Join the Fun!"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-nunito font-semibold text-brown/80 mb-2">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              placeholder="parent@email.com"
              className="w-full px-4 py-3 md:py-4 rounded-2xl border-3 border-orange/30 focus:border-orange focus:ring-4 focus:ring-orange/20 outline-none font-nunito text-brown bg-white/50 transition-all"
            />
          </div>

          <div>
            <label className="block font-nunito font-semibold text-brown/80 mb-2">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="w-full px-4 py-3 md:py-4 rounded-2xl border-3 border-orange/30 focus:border-orange focus:ring-4 focus:ring-orange/20 outline-none font-nunito text-brown bg-white/50 transition-all"
            />
          </div>

          <input name="flow" type="hidden" value={flow} />

          {error && (
            <div className="p-3 bg-pink/20 border-2 border-pink rounded-xl animate-shake">
              <p className="font-nunito text-sm text-pink text-center">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-gradient-to-r from-orange to-pink text-white font-baloo text-xl rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:transform-none"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Loading...
              </span>
            ) : flow === "signIn" ? (
              "Let's Go!"
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
            className="font-nunito text-purple hover:text-pink underline underline-offset-4 transition-colors"
          >
            {flow === "signIn" ? "New here? Sign up!" : "Already have an account? Sign in"}
          </button>
        </div>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t-2 border-brown/10" />
          </div>
          <div className="relative flex justify-center">
            <span className="px-4 bg-white/80 font-nunito text-brown/50 text-sm">or</span>
          </div>
        </div>

        <button
          onClick={handleAnonymous}
          disabled={isLoading}
          className="w-full py-4 bg-gradient-to-r from-sky to-mint text-white font-baloo text-lg rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:transform-none"
        >
          Try as Guest
        </button>
      </div>

      {/* Cute character peeking */}
      <div className="hidden md:block fixed bottom-20 left-8 animate-peek">
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-br from-sky to-purple rounded-full">
            <div className="absolute top-3 left-3 w-4 h-4 bg-white rounded-full">
              <div className="absolute top-1 left-1 w-2 h-2 bg-brown rounded-full" />
            </div>
            <div className="absolute top-3 right-3 w-4 h-4 bg-white rounded-full">
              <div className="absolute top-1 left-1 w-2 h-2 bg-brown rounded-full" />
            </div>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-4 h-2 bg-pink rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
