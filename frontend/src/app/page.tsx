import Navigation from "../components/Navigation";
import MediaPlayer from "../components/MediaPlayer";
import IncidentList from "../components/IncidentList";
import TimelinePlayer from "../components/TimelinePlayer";
import CameraTimeline from "../components/timeline";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black font-sans" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Sticky Navigation */}
      <div className="sticky top-0 z-20 w-full">
        <Navigation />
      </div>
      {/* Divider */}
      <div className="w-full h-[2px] bg-gradient-to-r from-[#2d2d2d] to-[#232323]" />
      {/* Main Content */}
      <main className="flex justify-center items-start w-full bg-black pt-8 pb-8">
        <div className="flex w-full max-w-[1400px] gap-8 px-8">
          <MediaPlayer />
          <IncidentList />
        </div>
      </main>
      {/* Timeline Player Controls Section */}
      <div className="flex justify-center w-full bg-black">
        <div className="w-full max-w-[1400px] px-8">
          <TimelinePlayer />
        </div>
      </div>
      
      {/* Gap between Timeline Player and Camera Timeline */}
      <div className="w-full h-4 bg-black" />
      
      {/* Camera Timeline Section */}
      <div className="flex justify-center w-full bg-black pb-8">
        <div className="w-full max-w-[1400px] px-8">
          <CameraTimeline />
        </div>
      </div>
    </div>
  );
}
