import { useState } from "react";
import { useMutation, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";

const PROMPT_STARTERS = [
  { emoji: "🐻", text: "A friendly bear learning to dance in the forest" },
  { emoji: "🚀", text: "A curious robot exploring a candy planet" },
  { emoji: "🦋", text: "A shy butterfly making friends at a garden party" },
  { emoji: "🐙", text: "An octopus chef cooking in an underwater kitchen" },
  { emoji: "🦊", text: "A brave little fox going on a camping adventure" },
  { emoji: "🐰", text: "A bunny astronaut bouncing on the moon" },
  { emoji: "🦁", text: "A lion cub learning to roar for the first time" },
  { emoji: "🐸", text: "A frog prince hosting a magical tea party" },
];

interface CreateVideoModalProps {
  onClose: () => void;
}

export function CreateVideoModal({ onClose }: CreateVideoModalProps) {
  const [prompt, setPrompt] = useState("");
  const [title, setTitle] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createVideo = useMutation(api.videos.create);
  const generateVideo = useAction(api.videos.generate);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || !title.trim()) return;

    setIsGenerating(true);
    setError(null);

    try {
      const videoId = await createVideo({
        prompt: prompt.trim(),
        title: title.trim()
      });

      // Start generation in background
      generateVideo({ videoId, prompt: prompt.trim() }).catch(console.error);

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create video");
      setIsGenerating(false);
    }
  };

  const selectStarter = (starter: typeof PROMPT_STARTERS[0]) => {
    setPrompt(starter.text);
    if (!title) {
      setTitle(starter.text.slice(0, 30) + "...");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brown/50 backdrop-blur-sm animate-fade-in">
      <div
        className="absolute inset-0"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-cream rounded-3xl shadow-2xl border-4 border-white animate-modal-pop">
        {/* Header */}
        <div className="sticky top-0 bg-cream border-b-2 border-orange/20 p-4 md:p-6 rounded-t-3xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-brown/50 hover:text-brown hover:bg-white/50 rounded-full transition-all"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange to-pink rounded-2xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/>
              </svg>
            </div>
            <h2 className="font-baloo text-2xl md:text-3xl text-brown">
              Create Magic!
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6">
          {/* Prompt starters */}
          <div className="mb-6">
            <p className="font-nunito font-semibold text-brown/70 mb-3">
              Try a magical idea:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {PROMPT_STARTERS.map((starter, i) => (
                <button
                  key={i}
                  onClick={() => selectStarter(starter)}
                  className="p-3 bg-white/60 hover:bg-white rounded-2xl border-2 border-transparent hover:border-orange/30 transition-all text-center group"
                >
                  <span className="text-2xl md:text-3xl block mb-1 group-hover:scale-125 transition-transform">
                    {starter.emoji}
                  </span>
                  <span className="font-nunito text-xs text-brown/60 line-clamp-2">
                    {starter.text}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-nunito font-semibold text-brown/80 mb-2">
                Video Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="My Amazing Adventure"
                maxLength={50}
                className="w-full px-4 py-3 rounded-2xl border-3 border-orange/30 focus:border-orange focus:ring-4 focus:ring-orange/20 outline-none font-nunito text-brown bg-white/50 transition-all"
              />
            </div>

            <div>
              <label className="block font-nunito font-semibold text-brown/80 mb-2">
                Describe Your Video
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="A curious little penguin discovers a magical ice cream mountain..."
                rows={4}
                maxLength={500}
                className="w-full px-4 py-3 rounded-2xl border-3 border-orange/30 focus:border-orange focus:ring-4 focus:ring-orange/20 outline-none font-nunito text-brown bg-white/50 transition-all resize-none"
              />
              <p className="text-right text-xs text-brown/40 mt-1 font-nunito">
                {prompt.length}/500
              </p>
            </div>

            {error && (
              <div className="p-3 bg-pink/20 border-2 border-pink rounded-xl animate-shake">
                <p className="font-nunito text-sm text-pink text-center">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isGenerating || !prompt.trim() || !title.trim()}
              className="w-full py-4 bg-gradient-to-r from-orange via-pink to-purple text-white font-baloo text-xl rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-6 h-6 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating Magic...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.6-6.3 4.6 2.3-7-6-4.6h7.6z" />
                  </svg>
                  Create Video
                </span>
              )}
            </button>
          </form>

          {/* Info note */}
          <div className="mt-6 p-4 bg-sky/10 rounded-2xl border-2 border-sky/30">
            <div className="flex gap-3">
              <svg className="w-6 h-6 text-sky flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
              </svg>
              <p className="font-nunito text-sm text-brown/70">
                Video generation takes 1-2 minutes. You can close this and we'll let you know when it's ready!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
