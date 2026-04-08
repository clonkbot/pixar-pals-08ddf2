import { Doc } from "../../convex/_generated/dataModel";

interface VideoPlayerModalProps {
  video: Doc<"videos">;
  onClose: () => void;
}

export function VideoPlayerModal({ video, onClose }: VideoPlayerModalProps) {
  if (!video.videoUrl) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brown/80 backdrop-blur-md animate-fade-in">
      <div
        className="absolute inset-0"
        onClick={onClose}
      />

      <div className="relative w-full max-w-4xl animate-modal-pop">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 w-10 h-10 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-all z-10"
        >
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>

        {/* Video container styled like a movie theater screen */}
        <div className="relative">
          {/* Theater frame */}
          <div className="absolute -inset-4 md:-inset-6 bg-gradient-to-b from-brown to-brown/90 rounded-3xl shadow-2xl" />

          {/* Curtain decorations */}
          <div className="absolute -top-6 left-0 right-0 h-8 bg-gradient-to-b from-pink/40 to-transparent rounded-t-3xl" />

          {/* Video player */}
          <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl">
            <video
              src={video.videoUrl}
              controls
              autoPlay
              className="w-full aspect-video"
              playsInline
            >
              Your browser does not support video playback.
            </video>
          </div>

          {/* Bottom theater lights */}
          <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-yellow rounded-full animate-twinkle"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>

        {/* Video info */}
        <div className="mt-8 text-center">
          <h3 className="font-baloo text-2xl md:text-3xl text-white">
            {video.title}
          </h3>
          <p className="font-nunito text-white/60 mt-2 max-w-lg mx-auto">
            {video.prompt}
          </p>
        </div>
      </div>
    </div>
  );
}
