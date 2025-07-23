"use client"

import { useState, useEffect, useRef } from "react"

export default function CameraTimelineExact() {
    const [currentTime, setCurrentTime] = useState("01:34:37a")
    const [selectedCamera, setSelectedCamera] = useState<number | null>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [timelinePosition, setTimelinePosition] = useState(6.25)
    const [zoomLevel, setZoomLevel] = useState(1)
    const [scrollPosition, setScrollPosition] = useState(0)
    const timelineRef = useRef<HTMLDivElement>(null)
    const timelineContainerRef = useRef<HTMLDivElement>(null)
    const mainContainerRef = useRef<HTMLDivElement>(null)

    // Background colors
    const backgroundColor = "#131212"
    const highlightColor = "#222322"
    const hoverColor = "#1a1a1a"

    const cameras = [
        { id: 1, name: "Camera - 01" },
        { id: 2, name: "Camera - 02" },
        { id: 3, name: "Camera - 03" }
    ]

    const events = [
        // Camera 01 row
        { id: 1, camera: 1, type: "Unauthorised Access", left: "20.8%" },
        { id: 2, camera: 1, type: "Face Recognised", time: "14:45", left: "61.5%", showTime: true },
        { id: 3, camera: 1, type: "Multiple Events", left: "93.75%", hasTriangle: true },

        // Camera 02 row  
        { id: 4, camera: 2, type: "Unauthorised Access", left: "16.7%" },
        { id: 5, camera: 2, type: "Face Recognised", left: "50%" },

        // Camera 03 row
        { id: 6, camera: 3, type: "Traffic congestion", left: "37.5%" },
        { id: 7, camera: 3, type: "Unauthorised Access", left: "87.5%" }
    ]

    useEffect(() => {
        const interval = setInterval(() => {
            if (!isDragging) {
                const now = new Date()
                const timeStr = now.toLocaleTimeString('en-US', {
                    hour12: true,
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                }).toLowerCase()
                setCurrentTime(timeStr)
            }
        }, 1000)

        return () => clearInterval(interval)
    }, [isDragging])

    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault()
                const delta = e.deltaY > 0 ? -1 : 1
                const newZoomLevel = Math.min(Math.max(zoomLevel + delta, 1), 16)
                setZoomLevel(newZoomLevel)
            }
        }

        const container = mainContainerRef.current
        if (container) {
            container.addEventListener('wheel', handleWheel, { passive: false })
            return () => container.removeEventListener('wheel', handleWheel)
        }
    }, [zoomLevel])

    const handleCameraSelect = (cameraId: number) => {
        setSelectedCamera(cameraId === selectedCamera ? null : cameraId)
    }

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault()
        setIsDragging(true)
        handleMouseMove(e)
    }

    const handleMouseUp = () => {
        setIsDragging(false)
    }

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!timelineRef.current || !timelineContainerRef.current) return

        const containerRect = timelineContainerRef.current.getBoundingClientRect()
        const timelineRect = timelineRef.current.getBoundingClientRect()

        const cameraListWidth = 192
        const x = e.clientX - timelineRect.left + scrollPosition
        const percentage = Math.min(Math.max((x / (timelineRect.width)) * 100, 0), 100)

        if (isDragging || e.type === 'mousedown') {
            setTimelinePosition(percentage)

            const totalMinutes = (24 * 60) / zoomLevel
            const minutes = Math.floor((percentage / 100) * totalMinutes)
            const hours = Math.floor(minutes / 60) % 24
            const mins = minutes % 60
            const secs = 0

            const timeStr = new Date(0, 0, 0, hours, mins, secs).toLocaleTimeString('en-US', {
                hour12: true,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            }).toLowerCase()

            setCurrentTime(timeStr)
        }
    }

    const handleTimelineClick = (e: React.MouseEvent) => {
        if (!isDragging) {
            handleMouseDown(e)
            setIsDragging(false)
        }
    }

    const handleZoom = (delta: number) => {
        const newZoomLevel = Math.min(Math.max(zoomLevel + delta, 1), 16)
        setZoomLevel(newZoomLevel)
    }

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const scrollLeft = e.currentTarget.scrollLeft
        setScrollPosition(scrollLeft)
    }

    const getTimelineWidth = () => {
        return `${zoomLevel * 100}%`
    }

    const getTimeMarkers = () => {
        const totalHours = 24
        const totalMinutes = totalHours * 60
        const markersPerHour = zoomLevel >= 4 ? 60 : zoomLevel >= 2 ? 12 : 4
        const totalMarkers = totalHours * markersPerHour

        return Array.from({ length: totalMarkers }).map((_, i) => {
            const position = (i * 100) / totalMarkers
            const minutes = (i * totalMinutes) / totalMarkers
            const hours = Math.floor(minutes / 60) % 24
            const mins = Math.floor(minutes % 60)

            const isHour = mins === 0
            const isQuarterHour = mins % 15 === 0 && !isHour
            const is5Min = mins % 5 === 0 && !isQuarterHour && !isHour

            return {
                position,
                hours,
                mins,
                isHour,
                isQuarterHour,
                is5Min,
                label: isHour ? `${hours.toString().padStart(2, '0')}:00` :
                    (isQuarterHour && zoomLevel >= 2) ? `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}` :
                        (is5Min && zoomLevel >= 8) ? `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}` : null
            }
        })
    }

    return (
        <div
            ref={mainContainerRef}
            className="font-sans select-none relative flex flex-col"
            style={{ backgroundColor }}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onMouseMove={handleMouseMove}
        >
            {/* Compact Zoom Controls */}
            <div className="flex justify-between items-center px-2 py-1" style={{ backgroundColor }}>
                <div className="flex items-center gap-1">
                    <span className="text-white text-xs">Zoom:</span>
                    <button
                        onClick={() => handleZoom(-1)}
                        className="px-1.5 py-0.5 bg-gray-700 text-white rounded text-xs hover:bg-gray-600"
                        disabled={zoomLevel <= 1}
                    >
                        −
                    </button>
                    <span className="text-white text-xs min-w-[30px] text-center">{zoomLevel}x</span>
                    <button
                        onClick={() => handleZoom(1)}
                        className="px-1.5 py-0.5 bg-gray-700 text-white rounded text-xs hover:bg-gray-600"
                        disabled={zoomLevel >= 16}
                    >
                        +
                    </button>
                    <span className="text-white text-xs ml-2 opacity-75">Ctrl+scroll to zoom</span>
                </div>
                <div className="text-white text-xs">
                    {currentTime}
                </div>
            </div>

            {/* Compact Header */}
            <div className="flex" style={{ backgroundColor }}>
                {/* Camera List Header */}
                <div className="w-40 px-2 py-1 flex-shrink-0 z-10" style={{ backgroundColor }}>
                    <h1 className="text-sm font-medium text-white">Cameras</h1>
                </div>

                {/* Timeline Header */}
                <div className="flex-1 relative overflow-hidden">
                    <div
                        className="overflow-x-auto overflow-y-hidden"
                        ref={timelineContainerRef}
                        onScroll={handleScroll}
                    >
                        <div
                            className="h-8 relative"
                            style={{ width: getTimelineWidth(), minWidth: '100%' }}
                        >
                            {/* Timeline Indicators */}
                            <div className="absolute top-0 left-0 right-0 h-full flex items-start">
                                {getTimeMarkers().map((marker, i) => (
                                    <div
                                        key={i}
                                        className={`absolute top-0 w-px bg-white ${marker.isHour ? "h-3" :
                                            marker.isQuarterHour ? "h-2" :
                                                marker.is5Min ? "h-1.5" : "h-1"
                                            }`}
                                        style={{
                                            left: `${marker.position}%`,
                                            display: marker.position === 0 || marker.position === 100 ? 'none' : 'block'
                                        }}
                                    >
                                        {marker.label && (
                                            <div className="absolute top-3 left-1/2 transform -translate-x-1/2 text-xs text-white font-mono whitespace-nowrap">
                                                {marker.label}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Current Time Badge */}
                            <div
                                className="absolute -top-0.5 bg-yellow-400 text-black px-1.5 py-0.5 rounded text-xs font-mono font-medium z-40 pointer-events-none"
                                style={{ left: `${timelinePosition}%`, transform: 'translateX(-50%)' }}
                            >
                                {currentTime}
                            </div>

                            {/* Yellow Line in Header */}
                            <div
                                className="absolute top-0 bottom-0 w-0.5 bg-yellow-400 z-30 pointer-events-none"
                                style={{
                                    left: `${timelinePosition}%`,
                                    height: '100%'
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Compact Main Content Area */}
            <div className="flex" style={{ backgroundColor }}>
                {/* Camera List Sidebar */}
                <div className="w-40 flex-shrink-0 z-10" style={{ backgroundColor, height: `${cameras.length * 48}px` }}>
                    {cameras.map((camera) => (
                        <div
                            key={camera.id}
                            className={`h-12 px-2 flex items-center gap-2 cursor-pointer transition-colors ${selectedCamera === camera.id ? 'bg-[#222322]' : 'hover:bg-[#1a1a1a]'
                                }`}
                            onClick={() => handleCameraSelect(camera.id)}
                            onMouseDown={handleMouseDown}
                        >
                            {/* Camera Icon */}
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586l-.707-.707A1 1 0 0013 4H7a1 1 0 00-.707.293L5.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs text-white font-normal">{camera.name}</span>
                        </div>
                    ))}
                </div>

                {/* Timeline Grid */}
                <div className="flex-1 relative overflow-hidden">
                    <div
                        className="overflow-x-auto overflow-y-hidden"
                        onScroll={handleScroll}
                        style={{ height: `${cameras.length * 48}px` }} // Match exact height
                    >
                        <div
                            className="relative cursor-crosshair"
                            ref={timelineRef}
                            onMouseDown={handleMouseDown}
                            onClick={handleTimelineClick}
                            style={{
                                width: getTimelineWidth(),
                                minWidth: '100%',
                                height: `${cameras.length * 48}px` // 3 cameras * 48px each
                            }}
                        >
                            {/* Yellow Line spanning the timeline grid */}
                            <div
                                className="absolute top-0 bottom-0 w-0.5 bg-yellow-400 z-30 pointer-events-none"
                                style={{
                                    left: `${timelinePosition}%`,
                                    height: '100%'
                                }}
                            />

                            {cameras.map((camera) => (
                                <div
                                    key={camera.id}
                                    className={`h-12 relative transition-colors ${selectedCamera === camera.id ? 'bg-[#222322]' : 'hover:bg-[#1a1a1a]'
                                        }`}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleCameraSelect(camera.id)
                                    }}
                                >
                                    {/* Event Badges */}
                                    {events
                                        .filter(event => event.camera === camera.id)
                                        .map((event) => (
                                            <div
                                                key={event.id}
                                                className={`absolute top-2 px-1.5 py-0.5 rounded text-xs font-medium flex items-center gap-1 z-20 pointer-events-none ${event.type === "Unauthorised Access" ? "bg-orange-600 text-white" :
                                                    event.type === "Face Recognised" ? "bg-blue-600 text-white" :
                                                        event.type === "Traffic congestion" ? "bg-teal-600 text-white" :
                                                            event.type === "Multiple Events" ? "bg-gray-600 text-white" :
                                                                "bg-gray-600 text-white"
                                                    }`}
                                                style={{ left: event.left, transform: 'translateX(-50%)' }}
                                            >
                                                {/* Event Icons */}
                                                {event.type === "Unauthorised Access" && (
                                                    <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                                {event.type === "Face Recognised" && (
                                                    <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                                {event.type === "Traffic congestion" && (
                                                    <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                                                        <path d="M3 4a1 1 0 011-1h1a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM8 4a1 1 0 011-1h6a1 1 0 011 1v3a1 1 0 01-1 1H9a1 1 0 01-1-1V4z" />
                                                    </svg>
                                                )}

                                                <span className="text-xs">{event.type}</span>

                                                {event.showTime && (
                                                    <span className="text-gray-200 ml-1 text-xs">{event.time}</span>
                                                )}

                                                {event.hasTriangle && (
                                                    <svg className="w-2.5 h-2.5 ml-1" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                            </div>
                                        ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}