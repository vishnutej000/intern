"use client"

import { useState, useEffect, useRef } from "react"

export default function TimelinePlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [currentDate, setCurrentDate] = useState("")
  const [showSpeedMenu, setShowSpeedMenu] = useState(false)
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const speedMenuRef = useRef<HTMLDivElement>(null)
  const moreMenuRef = useRef<HTMLDivElement>(null)

  // Update current date
  useEffect(() => {
    const updateDate = () => {
      const now = new Date()
      const formatted = now.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      setCurrentDate(formatted)
    }

    updateDate()
    const dateInterval = setInterval(updateDate, 1000)

    return () => clearInterval(dateInterval)
  }, [])

  // Timer for current time when playing
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentTime((prev) => prev + 1)
      }, 1000 / playbackSpeed)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying, playbackSpeed])

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (speedMenuRef.current && !speedMenuRef.current.contains(event.target as Node)) {
        setShowSpeedMenu(false)
      }
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setShowMoreMenu(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handlePrevious = () => {
    setCurrentTime(0)
    console.log("Previous track")
  }

  const handleNext = () => {
    setCurrentTime(0)
    console.log("Next track")
  }

  const handleRewind = () => {
    setCurrentTime((prev) => Math.max(0, prev - 10))
  }

  const handleForward = () => {
    setCurrentTime((prev) => prev + 10)
  }

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed)
    setShowSpeedMenu(false)
  }

  return (
    <div className="text-white flex items-center px-4 py-2 h-12" style={{ backgroundColor: "#131212" }}>
      {/* Previous Track */}
      <button
        className="h-8 w-8 text-white hover:bg-gray-800 rounded-md flex items-center justify-center"
        onClick={handlePrevious}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m11 17-5-5 5-5"></path>
          <path d="m18 17-5-5 5-5"></path>
        </svg>
      </button>

      {/* Rewind 10s */}
      <button
        className="h-8 w-8 text-white hover:bg-gray-800 rounded-md ml-1 flex items-center justify-center relative"
        onClick={handleRewind}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
          <path d="M3 3v5h5"></path>
        </svg>
        <span className="absolute text-[8px] font-medium" style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>10</span>
      </button>

      {/* Play/Pause Button */}
      <button
        className="h-8 w-8 bg-white text-black hover:bg-gray-200 rounded-full ml-1 flex items-center justify-center"
        onClick={handlePlayPause}
      >
        {isPlaying ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="6" y="4" width="4" height="16"></rect>
            <rect x="14" y="4" width="4" height="16"></rect>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
        )}
      </button>

      {/* Forward 10s */}
      <button
        className="h-8 w-8 text-white hover:bg-gray-800 rounded-md ml-1 flex items-center justify-center relative"
        onClick={handleForward}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12a9 9 0 1 0-9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path>
          <path d="M21 21v-5h-5"></path>
        </svg>
        <span className="absolute text-[8px] font-medium" style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>10</span>
      </button>

      {/* Next Track */}
      <button
        className="h-8 w-8 text-white hover:bg-gray-800 rounded-md ml-1 flex items-center justify-center"
        onClick={handleNext}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m6 17 5-5-5-5"></path>
          <path d="m13 17 5-5-5-5"></path>
        </svg>
      </button>

      {/* Time Display */}
      <div className="text-sm font-medium ml-6">
        {formatTime(currentTime)} ({currentDate})
      </div>

      {/* Speed Control */}
      <div className="relative" ref={speedMenuRef}>
        <button
          className="text-sm font-medium ml-6 h-8 px-2 text-white hover:bg-gray-800 rounded-md"
          onClick={() => setShowSpeedMenu(!showSpeedMenu)}
        >
          {playbackSpeed}x
        </button>
        {showSpeedMenu && (
          <div className="absolute z-10 mt-1 bg-gray-900 border border-gray-700 rounded-md shadow-lg">
            {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
              <div
                key={speed}
                className="px-4 py-2 text-white hover:bg-gray-800 cursor-pointer"
                onClick={() => handleSpeedChange(speed)}
              >
                {speed}x
              </div>
            ))}
          </div>
        )}
      </div>

      {/* More Options */}
      <div className="relative" ref={moreMenuRef}>
        <button
          className="h-8 w-8 text-white hover:bg-gray-800 rounded-md ml-6 flex items-center justify-center"
          onClick={() => setShowMoreMenu(!showMoreMenu)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="1"></circle>
            <circle cx="19" cy="12" r="1"></circle>
            <circle cx="5" cy="12" r="1"></circle>
          </svg>
        </button>
        {showMoreMenu && (
          <div className="absolute right-0 z-10 mt-1 bg-gray-900 border border-gray-700 rounded-md shadow-lg">
            <div className="px-4 py-2 text-white hover:bg-gray-800 cursor-pointer">Settings</div>
            <div className="px-4 py-2 text-white hover:bg-gray-800 cursor-pointer">Playlist</div>
            <div className="px-4 py-2 text-white hover:bg-gray-800 cursor-pointer">Equalizer</div>
          </div>
        )}
      </div>
    </div>
  )
}