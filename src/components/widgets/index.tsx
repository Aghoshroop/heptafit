"use client";

import React from "react";
import { motion } from "framer-motion";
import { LineChart, Line, AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar } from "recharts";
import { Activity, Zap, Heart, Flame, Target, ChevronRight, Brain, Orbit, ActivitySquare } from "lucide-react";

// Helper components
const WidgetContainer = ({ children, className = "", span = 1 }: { children: React.ReactNode, className?: string, span?: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-[#11141A] rounded-2xl p-5 border border-[#1F2937] shadow-xl ${span > 1 ? `md:col-span-${span}` : ''} ${className}`}
  >
    {children}
  </motion.div>
);

const WidgetHeader = ({ title, icon: Icon, color = "text-[#8B5CF6]" }: any) => (
  <div className="flex items-center gap-2 mb-4">
    <div className={`p-1.5 rounded-lg bg-[#1F2937] ${color}`}>
      <Icon size={16} />
    </div>
    <h3 className="font-semibold text-[#E5E7EB] text-sm">{title}</h3>
  </div>
);

// 1. Readiness Widget (General)
export const ReadinessWidget = () => (
  <WidgetContainer>
    <WidgetHeader title="Daily Readiness" icon={Activity} color="text-[#34D399]" />
    <div className="flex items-center gap-6 mt-2">
      <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
        <svg className="w-full h-full transform -rotate-90">
          <circle className="text-[#1F2937]" strokeWidth="6" stroke="currentColor" fill="transparent" r="42" cx="48" cy="48" />
          <circle 
            className="text-[#34D399] transition-all duration-1000 ease-in-out"
            strokeWidth="6" strokeDasharray="264" strokeDashoffset={264 - (85 / 100) * 264}
            strokeLinecap="round" stroke="currentColor" fill="transparent" r="42" cx="48" cy="48" 
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-black text-white">85</span>
          <span className="text-[10px] text-[#9CA3AF] uppercase font-bold">Optimal</span>
        </div>
      </div>
      <div className="flex flex-col gap-3 w-full">
        <div className="flex justify-between items-center text-xs">
          <span className="text-[#6B7280]">Resting HR</span>
          <span className="font-mono text-white font-semibold">42 bpm</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-[#6B7280]">HRV</span>
          <span className="font-mono text-white font-semibold">112 ms</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-[#6B7280]">Sleep</span>
          <span className="font-mono text-white font-semibold">8h 15m</span>
        </div>
      </div>
    </div>
  </WidgetContainer>
);

// 2. Sprint Kinetics (Speed Profile)
export const SprintKineticsWidget = () => {
  const data = [
    { split: "10m", time: 1.85 }, { split: "20m", time: 2.90 }, { split: "30m", time: 3.80 },
    { split: "40m", time: 4.65 }, { split: "50m", time: 5.50 }, { split: "60m", time: 6.40 },
  ];
  return (
    <WidgetContainer span={2}>
      <WidgetHeader title="Sprint Kinetics" icon={Zap} color="text-[#FBBF24]" />
      <div className="flex gap-6 h-full">
        <div className="h-[140px] w-full min-w-0">
          <ResponsiveContainer width="100%" height={140}>
            <LineChart data={data}>
              <XAxis dataKey="split" stroke="#4B5563" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#4B5563" fontSize={10} tickLine={false} axisLine={false} domain={['dataMin', 'dataMax']} />
              <Tooltip contentStyle={{ backgroundColor: '#11141A', borderColor: '#374151', borderRadius: '8px', fontSize: '12px' }} />
              <Line type="monotone" dataKey="time" stroke="#FBBF24" strokeWidth={3} dot={{ r: 4, fill: '#11141A', strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="w-1/3 flex flex-col justify-center gap-4">
          <div className="bg-[#1F2937]/50 rounded-lg p-3 border border-[#374151]">
            <p className="text-[10px] text-[#9CA3AF] uppercase font-semibold">Max Velocity</p>
            <p className="text-xl font-black text-white mt-1">11.4 <span className="text-xs font-normal text-[#6B7280]">m/s</span></p>
          </div>
          <div className="bg-[#1F2937]/50 rounded-lg p-3 border border-[#374151]">
            <p className="text-[10px] text-[#9CA3AF] uppercase font-semibold">Block Clearance</p>
            <p className="text-xl font-black text-white mt-1">0.142 <span className="text-xs font-normal text-[#6B7280]">s</span></p>
          </div>
        </div>
      </div>
    </WidgetContainer>
  );
};

// 3. Aerobic Base (Endurance Profile)
export const AerobicBaseWidget = () => {
  const data = [
    { week: "W1", vo2: 65, mileage: 45 }, { week: "W2", vo2: 66, mileage: 50 },
    { week: "W3", vo2: 67, mileage: 55 }, { week: "W4", vo2: 68, mileage: 40 },
    { week: "W5", vo2: 68, mileage: 60 }, { week: "W6", vo2: 69, mileage: 65 },
  ];
  return (
    <WidgetContainer span={2}>
      <WidgetHeader title="Aerobic Engine" icon={Heart} color="text-[#EF4444]" />
      <div className="flex gap-6">
        <div className="flex-1 h-[140px] min-w-0">
          <ResponsiveContainer width="100%" height={140}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="vo2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="week" stroke="#4B5563" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#11141A', borderColor: '#374151', borderRadius: '8px', fontSize: '12px' }} />
              <Area type="monotone" dataKey="vo2" stroke="#EF4444" strokeWidth={2} fillOpacity={1} fill="url(#vo2)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="w-1/3 flex flex-col justify-center gap-4">
          <div className="bg-[#1F2937]/50 rounded-lg p-3 border border-[#374151]">
            <p className="text-[10px] text-[#9CA3AF] uppercase font-semibold">Est. VO2 Max</p>
            <p className="text-xl font-black text-white mt-1">69.2 <span className="text-xs font-normal text-[#6B7280]">ml/kg/min</span></p>
          </div>
          <div className="bg-[#1F2937]/50 rounded-lg p-3 border border-[#374151]">
            <p className="text-[10px] text-[#9CA3AF] uppercase font-semibold">Weekly Vol.</p>
            <p className="text-xl font-black text-white mt-1">65 <span className="text-xs font-normal text-[#6B7280]">km</span></p>
          </div>
        </div>
      </div>
    </WidgetContainer>
  );
};

// 4. Jump Mechanics (Jump Profile)
export const JumpMechanicsWidget = () => (
  <WidgetContainer>
    <WidgetHeader title="Take-off Mechanics" icon={ActivitySquare} color="text-[#60A5FA]" />
    <div className="flex flex-col gap-4 mt-4">
      <div className="flex justify-between items-center pb-3 border-b border-[#1F2937]">
        <span className="text-xs text-[#9CA3AF]">Approach Speed</span>
        <span className="text-sm font-bold text-white">10.2 <span className="text-[10px] text-[#6B7280] font-normal">m/s</span></span>
      </div>
      <div className="flex justify-between items-center pb-3 border-b border-[#1F2937]">
        <span className="text-xs text-[#9CA3AF]">Take-off Angle</span>
        <span className="text-sm font-bold text-white">21.5 <span className="text-[10px] text-[#6B7280] font-normal">°</span></span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-xs text-[#9CA3AF]">Flight Time</span>
        <span className="text-sm font-bold text-white">0.82 <span className="text-[10px] text-[#6B7280] font-normal">s</span></span>
      </div>
    </div>
  </WidgetContainer>
);

// 5. Throw Kinetics (Throw Profile)
export const ThrowKineticsWidget = () => (
  <WidgetContainer span={2}>
    <WidgetHeader title="Release Kinetics" icon={Orbit} color="text-[#F97316]" />
    <div className="grid grid-cols-3 gap-4 mt-2">
      <div className="bg-[#1F2937]/40 rounded-xl p-4 border border-[#374151] flex flex-col items-center text-center">
        <div className="w-10 h-10 rounded-full bg-[#F97316]/20 text-[#F97316] flex items-center justify-center mb-2">
          <Activity size={18} />
        </div>
        <p className="text-2xl font-black text-white">28.4</p>
        <p className="text-[10px] text-[#9CA3AF] uppercase font-bold mt-1">Velocity (m/s)</p>
      </div>
      <div className="bg-[#1F2937]/40 rounded-xl p-4 border border-[#374151] flex flex-col items-center text-center">
        <div className="w-10 h-10 rounded-full bg-[#F97316]/20 text-[#F97316] flex items-center justify-center mb-2">
          <Orbit size={18} />
        </div>
        <p className="text-2xl font-black text-white">36.2</p>
        <p className="text-[10px] text-[#9CA3AF] uppercase font-bold mt-1">Angle (°)</p>
      </div>
      <div className="bg-[#1F2937]/40 rounded-xl p-4 border border-[#374151] flex flex-col items-center text-center">
        <div className="w-10 h-10 rounded-full bg-[#F97316]/20 text-[#F97316] flex items-center justify-center mb-2">
          <Zap size={18} />
        </div>
        <p className="text-2xl font-black text-white">2.4</p>
        <p className="text-[10px] text-[#9CA3AF] uppercase font-bold mt-1">Rotation (rad/s)</p>
      </div>
    </div>
  </WidgetContainer>
);

// 6. Decathlon Radar (Combined Events)
export const DecathlonRadarWidget = () => {
  const data = [
    { subject: '100m', A: 90, fullMark: 100 },
    { subject: 'LJ', A: 85, fullMark: 100 },
    { subject: 'SP', A: 60, fullMark: 100 },
    { subject: 'HJ', A: 75, fullMark: 100 },
    { subject: '400m', A: 88, fullMark: 100 },
    { subject: '110mH', A: 80, fullMark: 100 },
    { subject: 'DT', A: 65, fullMark: 100 },
    { subject: 'PV', A: 70, fullMark: 100 },
    { subject: 'JT', A: 55, fullMark: 100 },
    { subject: '1500m', A: 82, fullMark: 100 },
  ];
  return (
    <WidgetContainer span={2}>
      <WidgetHeader title="Event Proficiency" icon={Target} color="text-[#8B5CF6]" />
      <div className="h-[200px] w-full flex items-center justify-center min-w-0">
        <ResponsiveContainer width="100%" height={200}>
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid stroke="#374151" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF', fontSize: 10 }} />
            <Radar name="Score" dataKey="A" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </WidgetContainer>
  );
};

// 7. Points Target (Combined Events)
export const PointsTargetWidget = () => (
  <WidgetContainer>
    <WidgetHeader title="Qualification Target" icon={Target} color="text-[#EC4899]" />
    <div className="mt-4">
      <div className="flex justify-between items-end mb-2">
        <div>
          <p className="text-[10px] text-[#9CA3AF] uppercase font-bold">Current PB</p>
          <p className="text-2xl font-black text-white leading-none mt-1">7,842</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-[#9CA3AF] uppercase font-bold">Target (Worlds)</p>
          <p className="text-sm font-bold text-[#EC4899] leading-none mt-1">8,150</p>
        </div>
      </div>
      <div className="w-full bg-[#1F2937] rounded-full h-3 mt-4 overflow-hidden relative">
        <div className="bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] h-full rounded-full transition-all duration-1000" style={{ width: "92%" }}></div>
      </div>
      <p className="text-xs text-[#9CA3AF] text-center mt-3">308 points to go</p>
    </div>
  </WidgetContainer>
);

// 8. Power Output (Speed/Jump/Throw)
export const PowerOutputWidget = () => (
  <WidgetContainer>
    <WidgetHeader title="Peak Power" icon={Zap} color="text-[#FBBF24]" />
    <div className="flex flex-col items-center justify-center h-[120px]">
      <p className="text-4xl font-black text-white">28.4 <span className="text-sm font-normal text-[#6B7280]">W/kg</span></p>
      <p className="text-xs text-[#34D399] flex items-center mt-2 font-medium">
        <Flame size={12} className="mr-1" /> +1.2% from last block
      </p>
    </div>
  </WidgetContainer>
);

// 9. Consistency (General)
export const ConsistencyWidget = () => {
  const data = [
    { day: "M", val: 100 }, { day: "T", val: 80 }, { day: "W", val: 100 }, 
    { day: "T", val: 90 }, { day: "F", val: 100 }, { day: "S", val: 60 }, { day: "S", val: 0 }
  ];
  return (
    <WidgetContainer>
      <WidgetHeader title="Weekly Consistency" icon={ActivitySquare} color="text-[#60A5FA]" />
      <div className="h-[120px] mt-2 min-w-0">
        <ResponsiveContainer width="100%" height={120}>
          <BarChart data={data}>
            <XAxis dataKey="day" stroke="#4B5563" fontSize={10} tickLine={false} axisLine={false} />
            <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#11141A', borderColor: '#374151', borderRadius: '8px', fontSize: '12px' }} />
            <Bar dataKey="val" fill="#60A5FA" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </WidgetContainer>
  );
};

// 10. AI Insights (General)
export const AIInsightsWidget = () => (
  <WidgetContainer span={2}>
    <WidgetHeader title="CoachOS Intelligence" icon={Brain} color="text-[#8B5CF6]" />
    <div className="bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 rounded-xl p-4 mt-2">
      <p className="text-sm text-[#E5E7EB] leading-relaxed">
        Based on your recent block, your <strong>Max Velocity</strong> has stabilized, but your <strong>Block Clearance</strong> (0.142s) is trailing behind your peers. Focus on explosive starts and reaction drills this week.
      </p>
      <button className="mt-3 text-xs text-[#8B5CF6] font-semibold hover:text-[#7C3AED] flex items-center transition-colors">
        View Training Recommendations <ChevronRight size={14} />
      </button>
    </div>
  </WidgetContainer>
);

// 11. Pacing Analysis (Endurance)
export const PacingAnalysisWidget = () => {
  const data = [
    { split: "1k", pace: 185 }, { split: "2k", pace: 182 }, { split: "3k", pace: 186 },
    { split: "4k", pace: 181 }, { split: "5k", pace: 175 }
  ];
  // 180s = 3:00/km
  return (
    <WidgetContainer>
      <WidgetHeader title="Split Variance" icon={Activity} color="text-[#10B981]" />
      <div className="h-[120px] mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="split" stroke="#4B5563" fontSize={10} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#11141A', borderColor: '#374151', borderRadius: '8px', fontSize: '12px' }} 
              formatter={(val: any) => [`${Math.floor(val/60)}:${(val%60).toString().padStart(2,'0')}/km`, 'Pace']}
            />
            <Line type="monotone" dataKey="pace" stroke="#10B981" strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </WidgetContainer>
  );
};

// ---------------------------------------------------------
// EVENT SPECIFIC OVERRIDES (Empty States)
// ---------------------------------------------------------

const EmptyStateOverlay = ({ message, icon: Icon }: any) => (
  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#11141A]/80 backdrop-blur-sm rounded-2xl p-4 text-center border border-[#1F2937]/50">
    <div className="w-12 h-12 rounded-full bg-[#1F2937] flex items-center justify-center mb-3">
      <Icon size={20} className="text-[#6B7280]" />
    </div>
    <p className="text-sm font-semibold text-[#D1D5DB]">{message}</p>
    <p className="text-xs text-[#6B7280] mt-1 px-4 leading-relaxed">Connect timing gates or supported wearables to unlock.</p>
  </div>
);

// 100m / 60m / 200m
export const StartMechanicsWidget = () => (
  <WidgetContainer span={2} className="relative overflow-hidden">
    <WidgetHeader title="Block Clearance & Start Mechanics" icon={Zap} color="text-[#FBBF24]" />
    <div className="h-[140px] opacity-20 pointer-events-none filter blur-[2px]">
      <div className="grid grid-cols-3 gap-4 h-full">
        <div className="bg-[#1F2937] rounded-xl"></div>
        <div className="bg-[#1F2937] rounded-xl"></div>
        <div className="bg-[#1F2937] rounded-xl"></div>
      </div>
    </div>
    <EmptyStateOverlay message="Start Mechanics Data Missing" icon={ActivitySquare} />
  </WidgetContainer>
);

// 400m / 400mH
export const LactateToleranceWidget = () => (
  <WidgetContainer span={2} className="relative overflow-hidden">
    <WidgetHeader title="Lactate Threshold & Speed Endurance" icon={Flame} color="text-[#EF4444]" />
    <div className="h-[140px] opacity-20 pointer-events-none filter blur-[2px]">
      <div className="w-full h-full bg-gradient-to-r from-[#EF4444]/20 to-transparent rounded-xl"></div>
    </div>
    <EmptyStateOverlay message="Speed Endurance Analytics Locked" icon={Heart} />
  </WidgetContainer>
);

// 800m / 1500m
export const MiddleDistancePacingWidget = () => (
  <WidgetContainer span={2} className="relative overflow-hidden">
    <WidgetHeader title="Lap-by-Lap Pacing Strategy" icon={Activity} color="text-[#10B981]" />
    <div className="h-[140px] opacity-20 pointer-events-none filter blur-[2px] flex items-end justify-between px-4 pb-2">
      <div className="w-8 bg-[#10B981]/50 h-[60%] rounded-t-md"></div>
      <div className="w-8 bg-[#10B981]/50 h-[65%] rounded-t-md"></div>
      <div className="w-8 bg-[#10B981]/50 h-[70%] rounded-t-md"></div>
      <div className="w-8 bg-[#10B981]/50 h-[80%] rounded-t-md"></div>
      <div className="w-8 bg-[#10B981]/50 h-[100%] rounded-t-md"></div>
    </div>
    <EmptyStateOverlay message="Pacing Variance requires GPS/Track Data" icon={Target} />
  </WidgetContainer>
);

// High Jump / Pole Vault
export const VerticalJumpMechanicsWidget = () => (
  <WidgetContainer span={2} className="relative overflow-hidden">
    <WidgetHeader title="Vertical Clearance Analytics" icon={ActivitySquare} color="text-[#60A5FA]" />
    <div className="h-[140px] opacity-20 pointer-events-none filter blur-[2px]">
      <div className="w-full h-full border-t-2 border-dashed border-[#60A5FA] mt-10 relative">
        <div className="absolute top-[-10px] left-1/2 w-4 h-4 rounded-full bg-[#60A5FA]"></div>
      </div>
    </div>
    <EmptyStateOverlay message="Bar Clearance Data Not Found" icon={Orbit} />
  </WidgetContainer>
);

// Long Jump / Triple Jump
export const HorizontalJumpMechanicsWidget = () => (
  <WidgetContainer span={2} className="relative overflow-hidden">
    <WidgetHeader title="Board Accuracy & Flight Phase" icon={ActivitySquare} color="text-[#EC4899]" />
    <div className="h-[140px] opacity-20 pointer-events-none filter blur-[2px]">
      <div className="flex w-full h-full items-center">
        <div className="w-1/4 h-full border-r-4 border-red-500/50"></div>
        <div className="w-3/4 h-full bg-[#1F2937]/30"></div>
      </div>
    </div>
    <EmptyStateOverlay message="Take-off Board Analytics Locked" icon={Target} />
  </WidgetContainer>
);
