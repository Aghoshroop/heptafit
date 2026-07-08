import { useState } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/Button";

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: 'Training' | 'Competition' | 'Camp' | 'Holiday' | 'Recovery';
  content?: string;
  athleteId?: string;
  athleteName?: string;
}

interface CalendarProps {
  events: CalendarEvent[];
  onDateClick?: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
}

export function Calendar({ events, onDateClick, onEventClick }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  
  // To get the full grid (including padding days from prev/next month)
  const startDate = new Date(monthStart);
  startDate.setDate(startDate.getDate() - startDate.getDay()); // Start on Sunday
  
  const endDate = new Date(monthEnd);
  endDate.setDate(endDate.getDate() + (6 - endDate.getDay())); // End on Saturday

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'Training': return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
      case 'Competition': return 'bg-rose-500/20 text-rose-500 border-rose-500/30';
      case 'Camp': return 'bg-purple-500/20 text-purple-500 border-purple-500/30';
      case 'Holiday': return 'bg-amber-500/20 text-amber-500 border-amber-500/30';
      case 'Recovery': return 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30';
      default: return 'bg-primary/20 text-primary border-primary/30';
    }
  };

  return (
    <div className="w-full bg-card/40 backdrop-blur-md border border-border rounded-xl overflow-hidden shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/50 bg-muted/20">
        <h2 className="text-xl font-bold tracking-tight">{format(currentDate, "MMMM yyyy")}</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={prevMonth} className="h-8 w-8">
            <ChevronLeft size={16} />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())} className="h-8">
            Today
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth} className="h-8 w-8">
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 border-b border-border/50 bg-muted/30">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="py-2 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {day}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 auto-rows-[120px]">
        {days.map((day, idx) => {
          const dayEvents = events.filter(e => isSameDay(new Date(e.date), day));
          const isCurrentMonth = isSameMonth(day, currentDate);
          
          return (
            <div 
              key={day.toISOString()} 
              onClick={() => onDateClick?.(day)}
              className={`p-2 border-r border-b border-border/30 transition-colors ${!isCurrentMonth ? 'bg-muted/10 opacity-50' : 'hover:bg-accent/30 cursor-pointer'} ${isToday(day) ? 'bg-primary/5' : ''}`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`text-sm font-medium w-6 h-6 flex items-center justify-center rounded-full ${isToday(day) ? 'bg-primary text-primary-foreground' : 'text-foreground'}`}>
                  {format(day, "d")}
                </span>
              </div>
              
              <div className="space-y-1 overflow-y-auto max-h-[70px] no-scrollbar">
                {dayEvents.map(event => (
                  <div 
                    key={event.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick?.(event);
                    }}
                    className={`text-xs px-1.5 py-1 rounded-md border truncate cursor-pointer transition-transform hover:scale-[1.02] ${getTypeColor(event.type)}`}
                    title={event.title}
                  >
                    <span className="font-semibold">{event.title}</span>
                    {event.athleteName && <span className="block text-[10px] opacity-80 truncate">{event.athleteName}</span>}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
