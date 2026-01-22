import React, { useState } from 'react';
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    addMonths,
    subMonths,
    isToday,
    parseISO,
    isWithinInterval
} from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { LeaveRequest } from '@/services/api/leaveService';

interface LeaveCalendarProps {
    leaves: LeaveRequest[];
}

const LeaveCalendar: React.FC<LeaveCalendarProps> = ({ leaves }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
    const goToToday = () => setCurrentMonth(new Date());

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = eachDayOfInterval({
        start: startDate,
        end: endDate,
    });

    const getDayStatus = (day: Date) => {
        // Find leaves that cover this day
        const dayLeaves = leaves.filter(leave => {
            // Check if day is within leave range
            // Assuming leave.fromDate and leave.toDate are ISO strings
            // We need to parse them strictly
            const start = parseISO(leave.fromDate.split('T')[0]);
            const end = parseISO(leave.toDate.split('T')[0]);

            return isWithinInterval(day, { start, end }) && leave.status !== 'CANCELLED' && leave.status !== 'REJECTED';
        });

        return dayLeaves;
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'APPROVED': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'PENDING': return 'bg-amber-100 text-amber-700 border-amber-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 flex items-center justify-between border-b border-gray-100">
                <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <CalendarIcon className="w-5 h-5 text-blue-600" />
                        {format(currentMonth, 'MMMM yyyy')}
                    </h2>
                </div>
                <div className="flex gap-1">
                    <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <ChevronLeft size={20} />
                    </button>
                    <button onClick={goToToday} className="px-3 py-1 text-sm font-medium hover:bg-gray-100 rounded-lg transition-colors">
                        Today
                    </button>
                    <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 border-b border-gray-100">
                {weekDays.map(day => (
                    <div key={day} className="py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 bg-gray-50">
                {days.map(day => {
                    const dayLeaves = getDayStatus(day);
                    const isCurrentMonth = isSameMonth(day, monthStart);

                    return (
                        <div
                            key={day.toString()}
                            className={`min-h-[100px] bg-white border-b border-r border-gray-50 relative p-1 group transition-colors hover:bg-slate-50
                ${!isCurrentMonth ? 'text-gray-300 bg-gray-50/50' : 'text-gray-900'}
                ${isToday(day) ? 'bg-blue-50/50' : ''}
              `}
                        >
                            <div className={`
                w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium mb-1
                ${isToday(day) ? 'bg-blue-600 text-white shadow-md' : ''}
              `}>
                                {format(day, 'd')}
                            </div>

                            <div className="space-y-1">
                                {dayLeaves.map((leave, idx) => (
                                    <div
                                        key={`${leave.id}-${idx}`}
                                        title={`${leave.leaveType?.name || 'Leave'}: ${leave.reason}`}
                                        className={`text-[10px] px-1.5 py-1 rounded border truncate cursor-help ${getStatusColor(leave.status)}`}
                                    >
                                        {leave.leaveType?.name || 'Leave'}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="p-3 bg-gray-50 border-t border-gray-100 flex gap-4 text-xs text-gray-600">
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-emerald-100 border border-emerald-200"></div>
                    <span>Approved</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-amber-100 border border-amber-200"></div>
                    <span>Pending</span>
                </div>
            </div>
        </div>
    );
};

export default LeaveCalendar;
