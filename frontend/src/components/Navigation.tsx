import React from "react";
import {
  LayoutDashboard,
  AlertTriangle,
  Users,
  ChevronDown,
  LayoutGrid,
} from "lucide-react";
import SurveillanceCameraIcon from "./SurveillanceCameraIcon";

const navItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    active: true,
  },
  {
    label: "Cameras",
    icon: SurveillanceCameraIcon,
    active: false,
  },
  {
    label: "Scenes",
    icon: LayoutGrid,
    active: false,
  },
  {
    label: "Incidents",
    icon: AlertTriangle,
    active: false,
  },
  {
    label: "Users",
    icon: Users,
    active: false,
  },
];

const Navigation = () => {
  return (
    <nav className="w-full h-[56px] flex items-center justify-between px-10 bg-gradient-to-r from-[#23211C] to-[#191A1C] font-sans select-none">
      {/* Logo Section */}
      <div className="flex items-center gap-4 min-w-[180px]">
        <div className="flex items-center gap-2">
          {/* Logo (text placeholder) */}
          <div className="w-8 h-8 flex items-center justify-center bg-[#23211C] rounded-md border border-[#39362F]">
            <span className="text-white font-black text-lg tracking-tight">S</span>
          </div>
          <span className="text-white font-bold text-lg tracking-widest leading-none">SecureSight</span>
        </div>
      </div>
      {/* Navigation Links */}
      <div className="flex items-center gap-10">
        {navItems.map(({ label, icon: Icon, active }) => (
          <div
            key={label}
            className={`flex items-center gap-2 px-2 py-1 cursor-pointer transition-colors ${
              active
                ? "text-yellow-400 font-semibold"
                : "text-white hover:text-yellow-300 font-medium"
            }`}
          >
            <Icon
              size={20}
              className={active ? "text-yellow-400" : "text-white group-hover:text-yellow-300"}
              strokeWidth={2.2}
            />
            <span className="text-sm leading-none">{label}</span>
          </div>
        ))}
      </div>
      {/* User Profile Section */}
      <div className="flex items-center gap-3 min-w-[220px] justify-end">
        {/* Profile Image Placeholder */}
        <div className="w-9 h-9 rounded-full border border-[#39362F] bg-yellow-400 flex items-center justify-center">
          <span className="text-black font-bold text-lg">V</span>
        </div>
        <div className="flex flex-col text-right leading-tight">
          <span className="text-white font-semibold text-[15px]">Vishnu Tej</span>
          <span className="text-gray-300 text-xs">vishnutej@securesight.com</span>
        </div>
        <ChevronDown size={18} className="text-gray-400 ml-1" strokeWidth={2.2} />
      </div>
    </nav>
  );
};

export default Navigation;
