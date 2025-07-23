"use client";
import { ExclamationTriangleIcon, VideoCameraIcon, CheckCircleIcon, ArrowRightIcon, CalendarIcon } from "@heroicons/react/24/solid";
import { useEffect, useState, ReactElement } from "react";
import { fetchIncidents, resolveIncident } from "../lib/incidentApi";

type Incident = {
  id: string | number;
  type: string;
  camera_location: string;
  start_time: string;
  img: string;
};

const iconMap: Record<string, ReactElement> = {
  "Unauthorised Access": <ExclamationTriangleIcon className="w-5 h-5 text-orange-500" />,
  "Gun Threat": <VideoCameraIcon className="w-5 h-5 text-red-600" />,
};

export default function IncidentList() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [resolvedCount, setResolvedCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [resolvingId, setResolvingId] = useState<string | number | null>(null);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      fetchIncidents(),
      fetch("/api/incidents?resolved=true").then(res => res.ok ? res.json() : [])
    ])
      .then(([unresolved, resolved]) => {
        if (mounted) {
          setIncidents(unresolved);
          setResolvedCount(Array.isArray(resolved) ? resolved.length : 0);
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted) {
          setError("Failed to fetch incidents");
          setLoading(false);
        }
      });
    return () => { mounted = false; };
  }, []);

  const handleResolve = async (id: string | number) => {
    setResolvingId(id);
    try {
      await resolveIncident(id);
      setIncidents(prev => prev.filter(inc => inc.id !== id));
      setResolvedCount(count => count + 1);
    } catch {
      setError("Failed to resolve incident");
    } finally {
      setResolvingId(null);
    }
  };

  return (
    <aside className="flex-1 flex flex-col rounded-xl p-4 shadow-lg" style={{ backgroundColor: '#131212', height: '11cm', minWidth: 380 }}>
      {/* Header + Resolved Incidents Top Right */}
      <div className="flex items-center justify-between mb-4 w-full">
        <div className="flex items-center">
          <ExclamationTriangleIcon className="w-6 h-6 text-red-500 mr-2" />
          <span className="text-white text-lg font-semibold">{incidents.length} Unresolved Incidents</span>
        </div>
        <div className="flex items-center bg-[#232323] rounded-full px-3 py-1 border border-gray-700 shadow-sm">
          <CheckCircleIcon className="w-4 h-4 text-green-400 mr-1.5" />
          <span className="text-gray-200 text-xs font-medium">{resolvedCount} resolved incidents</span>
        </div>
      </div>
      {/* List - scrollable */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden pr-1 min-h-0 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        {loading ? (
          <div className="text-gray-400 text-center mt-8">Loading incidents...</div>
        ) : error ? (
          <div className="text-red-400 text-center mt-8">{error}</div>
        ) : incidents.length === 0 ? (
          <div className="text-gray-400 text-center mt-8">No unresolved incidents</div>
        ) : (
          incidents.map((incident, idx) => (
            <div key={incident.id || idx} className="flex items-start gap-3 mb-3 rounded-lg p-2 transition hover:bg-[#222322]" style={{ backgroundColor: '#131212', minHeight: 64 }}>
              <div className="w-20 h-14 rounded-lg border border-[#444] flex-shrink-0 bg-blue-600 flex items-center justify-center">
                {/* Optionally add an icon or text here */}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 mb-0.5">
                  {iconMap[incident.type] || <ExclamationTriangleIcon className="w-5 h-5 text-orange-500" />}
                  <span className={`text-sm font-semibold truncate text-white ${incident.type === 'Gun Threat' ? 'text-red-500' : 'text-white'}`}>{incident.type}</span>
                </div>
                <div className="flex items-center text-white text-xs gap-1 mb-0.5 truncate">
                  <VideoCameraIcon className="w-3.5 h-3.5" />
                  {incident.camera_location}
                </div>
                <div className="flex items-center text-white text-xs gap-1 truncate">
                  <CalendarIcon className="w-3.5 h-3.5" />
                  {incident.start_time}
                </div>
              </div>
              <button
                className="self-center ml-1 flex items-center text-yellow-400 hover:text-yellow-300 font-medium text-xs whitespace-nowrap px-1 py-0.5"
                onClick={() => handleResolve(incident.id)}
                disabled={resolvingId === incident.id}
              >
                {resolvingId === incident.id ? "Resolving..." : <>Resolve <ArrowRightIcon className="w-3.5 h-3.5 ml-0.5" /></>}
              </button>
            </div>
          ))
        )}
      </div>
      {/* Resolved Incidents */}
    </aside>
  );
}