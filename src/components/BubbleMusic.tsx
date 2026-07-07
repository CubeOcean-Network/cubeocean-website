"use client";

import React, { useState, useEffect, useRef } from "react";
import { Music, Trash2, Play, Pause, X, Disc, AlertTriangle } from "lucide-react";

interface Track {
  id: number;
  title: string;
  artist: string;
  src: string; 
}

export default function BubblePlayer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isMusicModalOpen, setIsMusicModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  const [tracks] = useState<Track[]>([
    { id: 1, title: "Glass Tide (Cubeocean version)", artist: "-", src: "/music/glass_tide_(cubeocean).mp3" },
    { id: 2, title: "Glass and the shore (Cubeocean version)", artist: "-", src: "/music/glass_and_the_shore(cubeocean).mp3" },
    { id: 3, title: "The Glass Wave (Cubeocean version)", artist: "-", src: "/music/the_glass_wave_(cubeocean).mp3" },
  ]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const bubbleRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setPosition({
        x: window.innerWidth - 96,
        y: window.innerHeight - 96,
    });},  
    []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (bubbleRef.current && !bubbleRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (currentTrack) {
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }
      audioRef.current.src = currentTrack.src;
      if (isPlaying) {
        audioRef.current.play().catch((err) => console.log("Audio play blocked:", err));
      }
    }
  }, [currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((err) => console.log("Audio play blocked:", err));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  const handlePlayPause = (track: Track) => {
    if (currentTrack?.id === track.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  const handleConfirmDelete = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
    setIsDeleted(true);
    setIsConfirmDeleteOpen(false);
  };

  if (isDeleted) return null;

  return (
    <div className="fixed bottom-8 right-8 z-50" ref={bubbleRef}>
      
      <button
        onClick={() => {
          setIsMusicModalOpen(true);
          setIsOpen(false);
        }}
        className={`absolute bottom-20 right-2 flex h-12 w-12 items-center justify-center rounded-full bg-white text-blue-600 shadow-xl border border-gray-100 transition-all duration-300 hover:scale-110 ${
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
        title="List Music"
      >
        <Music className="h-5 w-5" />
      </button>

      <button
        onClick={() => {
          setIsConfirmDeleteOpen(true);
          setIsOpen(false);
        }}
        className={`absolute bottom-2 right-20 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600 shadow-xl border border-red-100 transition-all duration-300 hover:scale-110 ${
          isOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4 pointer-events-none"
        }`}
        title="Delete Bubble"
      >
        <Trash2 className="h-5 w-5" />
      </button>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex h-16 w-16 items-center justify-center rounded-full text-white shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 ${
          isPlaying 
            ? "bg-gradient-to-tr from-indigo-500 to-purple-500 animate-pulse" 
            : "bg-gradient-to-tr from-gray-800 to-gray-900"
        }`}
      >
        {isPlaying ? (
          <Disc className="h-7 w-7 animate-spin [animation-duration:4s]" />
        ) : (
          <Disc className="h-7 w-7" />
        )}
      </button>

      {isMusicModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white/90 p-6 shadow-2xl border border-white/20 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Music className="h-5 w-5 text-purple-500" /> Playlist Musik
              </h3>
              <button 
                onClick={() => setIsMusicModalOpen(false)}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* List Lagu */}
            <div className="mt-4 space-y-2">
              {tracks.map((track) => {
                const isThisPlaying = currentTrack?.id === track.id && isPlaying;
                return (
                  <div 
                    key={track.id} 
                    className={`flex items-center justify-between rounded-xl p-3 transition border ${
                      currentTrack?.id === track.id 
                        ? "bg-purple-50/80 border-purple-200" 
                        : "bg-gray-50/50 border-transparent hover:bg-gray-50"
                    }`}
                  >
                    <div>
                      <p className="font-medium text-sm text-gray-800">{track.title}</p>
                      <p className="text-xs text-gray-500">{track.artist}</p>
                    </div>
                    <button
                      onClick={() => handlePlayPause(track)}
                      className={`flex h-9 w-9 items-center justify-center rounded-full transition ${
                        isThisPlaying 
                          ? "bg-purple-600 text-white" 
                          : "bg-white text-gray-700 shadow-sm border hover:bg-gray-50"
                      }`}
                    >
                      {isThisPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current ml-0.5" />}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {isConfirmDeleteOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-gray-100 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">Hapus Bubble?</h3>
            <p className="mt-2 text-sm text-gray-500">
              Delete bubble = <span className="font-semibold text-red-600">music berhenti</span>. Kamu tidak bisa membuka menu ini lagi sebelum me-refresh halaman.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setIsConfirmDeleteOpen(false)}
                className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-medium text-white hover:bg-red-700 transition shadow-lg shadow-red-600/20"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}