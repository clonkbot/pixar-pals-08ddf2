import { useState } from "react";
import { useQuery } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "../../convex/_generated/api";
import { VideoCard } from "./VideoCard";
import { CreateVideoModal } from "./CreateVideoModal";
import { VideoPlayerModal } from "./VideoPlayerModal";
import { Id, Doc } from "../../convex/_generated/dataModel";

export function VideoStudio() {
  const { signOut } = useAuthActions();
  const videos = useQuery(api.videos.list);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState<Id<"videos"> | null>(null);

  const selectedVideo = videos?.find((v: Doc<"videos">) => v._id === selectedVideoId);

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-cream/80 backdrop-blur-lg border-b-4 border-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-orange to-pink rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/>
              </svg>
            </div>
            <h1 className="font-baloo text-xl md:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-orange to-pink">
              PixarPals
            </h1>
          </div>

          <button
            onClick={() => signOut()}
            className="px-4 py-2 font-nunito font-semibold text-brown/60 hover:text-brown hover:bg-white/50 rounded-xl transition-all"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10">
        {/* Hero section */}
        <div className="text-center mb-8 md:mb-12 animate-fade-in">
          <h2 className="font-baloo text-3xl md:text-5xl text-brown mb-3">
            Your Magical Videos
          </h2>
          <p className="font-nunito text-brown/60 text-base md:text-lg">
            Create amazing Pixar-style animated shorts for kids!
          </p>
        </div>

        {/* Create button */}
        <div className="flex justify-center mb-8 md:mb-12">
          <button
            onClick={() => setShowCreateModal(true)}
            className="group relative px-8 py-4 md:px-10 md:py-5 bg-gradient-to-r from-orange via-pink to-purple text-white font-baloo text-xl md:text-2xl rounded-3xl shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95 transition-all"
          >
            <span className="flex items-center gap-3">
              <svg className="w-6 h-6 md:w-8 md:h-8 group-hover:rotate-90 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              </svg>
              Create New Video
            </span>

            {/* Sparkles */}
            <div className="absolute -top-2 -right-2 animate-twinkle">
              <svg className="w-6 h-6 text-yellow" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.6-6.3 4.6 2.3-7-6-4.6h7.6z" />
              </svg>
            </div>
          </button>
        </div>

        {/* Videos grid */}
        {videos === undefined ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="aspect-video bg-white/50 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-orange/20 to-pink/20 rounded-full flex items-center justify-center">
              <svg className="w-16 h-16 text-orange/50" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/>
              </svg>
            </div>
            <h3 className="font-baloo text-2xl text-brown/60 mb-2">
              No videos yet!
            </h3>
            <p className="font-nunito text-brown/40">
              Create your first magical video above
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video: Doc<"videos">, index: number) => (
              <VideoCard
                key={video._id}
                video={video}
                index={index}
                onClick={() => setSelectedVideoId(video._id)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      {showCreateModal && (
        <CreateVideoModal onClose={() => setShowCreateModal(false)} />
      )}

      {selectedVideo && (
        <VideoPlayerModal
          video={selectedVideo}
          onClose={() => setSelectedVideoId(null)}
        />
      )}
    </div>
  );
}
