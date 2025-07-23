import { CalendarIcon, PlayCircleIcon } from "@heroicons/react/24/solid";

const cam1 = "/images/cam1.jpg";
const cam2 = "/images/CAM2.jpg";
const cam3 = "/images/CAM3.jpg";

export default function MediaPlayer() {
  return (
    <section className="rounded-xl bg-white shadow-lg relative overflow-hidden" style={{ width: '19cm', height: '11cm' }}>     
      <div className="relative w-full h-full bg-white">
        <img src={cam1} alt="Camera 01" className="object-cover w-full h-full" style={{ filter: 'brightness(1.15)' }} />
        {/* Timestamp */}
        <div className="absolute top-4 left-4 flex items-center bg-white bg-opacity-80 px-3 py-1 rounded text-xs text-black font-medium">
          <CalendarIcon className="w-4 h-4 mr-1 text-gray-700" />
          11/7/2025 – 03:12:37
        </div>
        {/* Play Button */}
        <button className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-yellow-300 bg-opacity-90 rounded-full p-2 shadow-lg hover:bg-opacity-100 transition">
          <PlayCircleIcon className="w-16 h-16 text-[#181818]" />
        </button>
        {/* Camera Thumbnails - bottom right */}
        <div className="absolute bottom-4 right-4 flex gap-3">
          {/* Camera 2 - Peach */}
          <div className="bg-[#FFDAB9] rounded-lg overflow-hidden shadow border border-[#e5e5e5]">
            <img src={cam2} alt="Camera 02" className="w-24 h-16 object-cover" style={{ filter: 'brightness(1.15)' }} />
            <div className="text-xs text-black px-2 py-1">Camera - 02</div>
          </div>
          {/* Camera 3 - Yellow */}
          <div className="bg-yellow-300 rounded-lg overflow-hidden shadow border border-[#e5e5e5]">
            <img src={cam3} alt="Camera 03" className="w-24 h-16 object-cover" style={{ filter: 'brightness(1.15)' }} />
            <div className="text-xs text-black px-2 py-1">Camera - 03</div>
          </div>
        </div>
        {/* Camera Label - Camera 1 (red, recording) */}
        <div className="absolute left-4 bottom-4 flex items-center text-black text-sm">
          <span className="w-2 h-2 bg-red-600 rounded-full mr-2 inline-block" />
          Camera - 01
        </div>
      </div>
    </section>
  );
}