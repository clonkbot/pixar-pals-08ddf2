import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Doc } from "../../convex/_generated/dataModel";

interface VideoCardProps {
  video: Doc<"videos">;
  index: number;
  onClick: () => void;
}

export function VideoCard({ video, index, onClick }: VideoCardProps) {
  const removeVideo = useMutation(api.videos.remove);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Delete this video?")) {
      await removeVideo({ id: video._id });
    }
  };

  const isGenerating = video.status === "generating";
  const isFailed = video.status === "failed";
  const isCompleted = video.status === "completed";

  return (
    <div
      onClick={isCompleted ? onClick : undefined}
      className={`
        group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl
        transform hover:scale-[1.02] transition-all duration-300 border-4 border-white
        animate-fade-in-up cursor-pointer
        ${isCompleted ? "hover:border-orange/30" : "cursor-default"}
      `}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Thumbnail area */}
      <div className="aspect-video relative bg-gradient-to-br from-orange/10 to-pink/10">
        {video.thumbnailBase64 ? (
          <img
            src={`data:image/png;base64,${video.thumbnailBase64}`}
            alt={video.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-orange/20 to-pink/20 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-orange/50" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/>
              </svg>
            </div>
          </div>
        )}

        {/* Status overlay */}
        {isGenerating && (
          <div className="absolute inset-0 bg-brown/60 flex flex-col items-center justify-center">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-white/30 rounded-full animate-spin">
                <div className="absolute top-0 left-1/2 w-2 h-2 bg-white rounded-full -translate-x-1/2" />
              </div>
            </div>
            <p className="font-baloo text-white text-lg mt-4">Creating Magic...</p>
            <p className="font-nunito text-white/70 text-sm">This may take 1-2 minutes</p>
          </div>
        )}

        {isFailed && (
          <div className="absolute inset-0 bg-pink/80 flex flex-col items-center justify-center">
            <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
            <p className="font-baloo text-white text-lg mt-2">Oops!</p>
            <p className="font-nunito text-white/90 text-sm px-4 text-center">
              {video.errorMessage || "Something went wrong"}
            </p>
          </div>
        )}

        {/* Play button overlay for completed videos */}
        {isCompleted && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-brown/20">
            <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-xl transform group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 text-orange ml-1" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
        )}

        {/* Delete button */}
        <button
          onClick={handleDelete}
          className="absolute top-3 right-3 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:scale-110"
        >
          <svg className="w-4 h-4 text-pink" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
          </svg>
        </button>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-baloo text-lg text-brown truncate">
          {video.title}
        </h3>
        <p className="font-nunito text-sm text-brown/60 line-clamp-2 mt-1">
          {video.prompt}
        </p>
        <div className="flex items-center gap-2 mt-3">
          <span className={`
            px-3 py-1 rounded-full text-xs font-nunito font-semibold
            ${isGenerating ? "bg-yellow/20 text-yellow" : ""}
            ${isCompleted ? "bg-mint/20 text-mint" : ""}
            ${isFailed ? "bg-pink/20 text-pink" : ""}
          `}>
            {isGenerating ? "Generating..." : isCompleted ? "Ready to Watch!" : "Failed"}
          </span>
          <span className="font-nunito text-xs text-brown/40">
            {new Date(video.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
}
