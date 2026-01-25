'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
    format,
    addDays,
    subDays,
    addWeeks,
    subWeeks,
    isTuesday,
    previousTuesday,
    nextMonday,
    isMonday,
    parseISO,
    startOfDay,
    startOfWeek,
} from 'date-fns';
import { useAuth } from '@/hooks/useAuth';
import { DashboardLayout } from '@/components/DashboardLayout';
import {
    Calendar,
    Save,
    Send,
    CheckCircle,
    XCircle,
    Clock,
    Info,
    ChevronLeft,
    ChevronRight,
    FileText,
    Settings,
    MoreHorizontal,
    Search // replacing Review with Search or similar if needed, or just removing
} from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const TimesheetPage = () => {
    const { user, token } = useAuth();

    const isAdmin = user?.role === 'ADMIN';

    const [weekStart, setWeekStart] = useState<Date>(() => {
        const today = new Date();
        return startOfDay(startOfWeek(today, { weekStartsOn: 1 }));
    });

    const [formData, setFormData] = useState<Record<string, Record<string, number>>>({});
    const [comments, setComments] = useState<Record<string, string>>({});
    const [status, setStatus] = useState<'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED'>('DRAFT');
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
    const [employees, setEmployees] = useState<any[]>([]);
    const [submitDate, setSubmitDate] = useState<string | null>(null);
    const [approvalDate, setApprovalDate] = useState<string | null>(null);
    const [reviewerComment, setReviewerComment] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const id = user?.employeeId || user?.id;
        if (id) {
            setSelectedEmployeeId(id);
        }
    }, [user?.employeeId, user?.id]);

    useEffect(() => {
        if (isAdmin && token) {
            fetchEmployees();
        }
    }, [isAdmin, token]);

    const fetchEmployees = async () => {
        try {
            const res = await fetch(`${API_BASE}/employees`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const result = await res.json();
                setEmployees(result.data || []);
            }
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    const days = useMemo(() => {
        return Array.from({ length: 5 }).map((_, i) => addDays(weekStart, i));
    }, [weekStart]);

    const weekEnd = days[4];

    const categories = [
        { id: 'workHours', label: 'Work', isOT: true },
        { id: 'annualLeaveHours', label: 'Annual Leave', isOT: false },
        { id: 'sickHours', label: 'Sick Leave', isOT: false },
        { id: 'personalHours', label: 'Personal', isOT: false },
    ];

    useEffect(() => {
        fetchTimesheet();
    }, [weekStart, selectedEmployeeId]);

    const fetchTimesheet = async () => {
        if (!selectedEmployeeId || !token) return;
        setLoading(true);
        try {
            const formattedDate = format(weekStart, 'yyyy-MM-dd');
            const res = await fetch(`${API_BASE}/timesheet/week?employeeId=${selectedEmployeeId}&date=${formattedDate}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                if (data) {
                    const newFormData: Record<string, Record<string, number>> = {};
                    data.entries.forEach((entry: any) => {
                        const dateKey = format(parseISO(entry.date), 'yyyy-MM-dd');
                        newFormData[dateKey] = {
                            workHours: entry.workHours,
                            annualLeaveHours: entry.annualLeaveHours,
                            sickHours: entry.sickHours,
                            personalHours: entry.personalHours,
                        };
                    });
                    setFormData(newFormData);
                    setStatus(data.status || 'DRAFT');
                    setSubmitDate(data.submittedAt ? format(parseISO(data.submittedAt), 'MMM d, yyyy') : null);
                    setApprovalDate(data.approvedAt ? format(parseISO(data.approvedAt), 'MMM d, yyyy') : null);
                    setReviewerComment(data.rejectionReason || '');
                } else {
                    setFormData({});
                    setStatus('DRAFT');
                    setSubmitDate(null);
                    setApprovalDate(null);
                    setReviewerComment('');
                }
            }
        } catch (error) {
            console.error('Error fetching timesheet:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (dateStr: string, categoryId: string, value: string) => {
        if (status !== 'DRAFT' && status !== 'REJECTED') return;

        const val = parseFloat(value) || 0;
        setFormData(prev => ({
            ...prev,
            [dateStr]: {
                ...(prev[dateStr] || {}),
                [categoryId]: val
            }
        }));
    };

    const calculateDailyTotal = (dateStr: string) => {
        const dayData = formData[dateStr] || {};
        return categories.reduce((sum, cat) => sum + (dayData[cat.id] || 0), 0);
    };

    const calculateCategoryTotal = (categoryId: string) => {
        return days.reduce((sum, day) => {
            const dateStr = format(day, 'yyyy-MM-dd');
            return sum + (formData[dateStr]?.[categoryId] || 0);
        }, 0);
    };

    const totalHours = useMemo(() => {
        return categories.reduce((sum, cat) => sum + calculateCategoryTotal(cat.id), 0);
    }, [formData]);

    const otHours = useMemo(() => {
        const workTotal = calculateCategoryTotal('workHours');
        const standard = 40;
        return workTotal > standard ? workTotal - standard : 0;
    }, [formData]);

    const handleSave = async (isSubmit = false) => {
        if (!selectedEmployeeId || !token) return;

        // Validation for Sick/Personal/Annual: must be 8 or 0
        const errors: string[] = [];
        days.forEach(day => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const data = formData[dateStr] || {};
            ['sickHours', 'personalHours', 'annualLeaveHours'].forEach(key => {
                if (data[key] > 0 && data[key] !== 8) {
                    const label = categories.find(c => c.id === key)?.label;
                    errors.push(`${label} on ${format(day, 'EEE MM/dd')} must be 8 hours.`);
                }
            });
        });

        if (errors.length > 0) {
            alert(errors.join('\n'));
            return;
        }

        setLoading(true);
        const apiEntries = days.map(day => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const data = formData[dateStr] || {};
            return {
                date: day.toISOString(),
                dayOfWeek: format(day, 'EEEE').toUpperCase(),
                workHours: data.workHours || 0,
                sickHours: data.sickHours || 0,
                personalHours: data.personalHours || 0,
                annualLeaveHours: data.annualLeaveHours || 0,
                comments: ''
            };
        });

        try {
            const res = await fetch(`${API_BASE}/timesheet/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    employeeId: selectedEmployeeId,
                    weekStartDate: weekStart.toISOString(),
                    entries: apiEntries,
                    status: isSubmit ? 'SUBMITTED' : 'DRAFT'
                })
            });

            if (res.ok) {
                alert(isSubmit ? 'Timesheet submitted successfully!' : 'Timesheet saved as draft.');
                fetchTimesheet();
            } else {
                const err = await res.text();
                alert('Error: ' + err);
            }
        } catch (error) {
            console.error('Error saving timesheet:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleWeekEndChange = (value: string) => {
        const date = parseISO(value);
        setWeekStart(startOfDay(startOfWeek(date, { weekStartsOn: 1 })));
    };

    const navigateWeek = (weeks: number) => {
        setWeekStart(prev => addWeeks(prev, weeks));
    };

    return (
        <DashboardLayout>
            <div className="flex flex-col space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between pb-6 border-b border-slate-200">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">Timesheet Management</h1>
                        <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
                            <FileText size={14} />
                            <span>Corporate ERP</span>
                            <span>/</span>
                            <span className="text-blue-600 font-medium">Weekly Entry</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {isAdmin && (
                            <div className="flex items-center gap-2 mr-4 bg-slate-100 p-1 rounded-lg border border-slate-200">
                                <span className="text-[10px] font-bold text-slate-500 uppercase px-2">Viewing Employee</span>
                                <select
                                    className="text-sm font-semibold bg-white border border-slate-300 rounded px-3 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={selectedEmployeeId}
                                    onChange={(e) => setSelectedEmployeeId(e.target.value)}
                                >
                                    <option value={user?.employeeId || user?.id}>Self ({user?.firstName})</option>
                                    {employees.map(emp => emp.id !== (user?.employeeId || user?.id) && (
                                        <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                        <button
                            onClick={() => handleSave(false)}
                            disabled={loading || (status !== 'DRAFT' && status !== 'REJECTED')}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-all disabled:opacity-50"
                        >
                            <Save size={16} />
                            Save
                        </button>
                        <button
                            onClick={() => handleSave(true)}
                            disabled={loading || (status !== 'DRAFT' && status !== 'REJECTED')}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 transition-all shadow-sm disabled:opacity-50"
                        >
                            <Send size={16} />
                            Submit
                        </button>
                        {isAdmin && (
                            <>
                                <button
                                    onClick={async () => {
                                        if (!selectedEmployeeId || !token) return;
                                        try {
                                            const tsRes = await fetch(`${API_BASE}/timesheet/week?employeeId=${selectedEmployeeId}&date=${format(weekStart, 'yyyy-MM-dd')}`, { headers: { 'Authorization': `Bearer ${token}` } });
                                            const tsData = await tsRes.json();
                                            if (!tsData.id) return alert("Timesheet not found for this week.");

                                            const res = await fetch(`${API_BASE}/timesheet/review`, {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                                                body: JSON.stringify({
                                                    timesheetId: tsData.id,
                                                    status: 'APPROVED'
                                                })
                                            });
                                            if (res.ok) {
                                                alert('Timesheet Approved Successfully');
                                                fetchTimesheet();
                                            }
                                        } catch (e) {
                                            console.error(e);
                                        }
                                    }}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-all"
                                >
                                    <CheckCircle size={16} className="text-green-600" />
                                    Approve
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-all text-slate-400">
                                    <Settings size={16} />
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex gap-8">
                    {/* Left Side: Entry Table */}
                    <div className="flex-1 overflow-y-auto space-y-6">
                        {/* Controls & Date Selection */}
                        <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center bg-slate-100 rounded border border-slate-200 p-0.5">
                                    <button onClick={() => navigateWeek(-1)} className="p-1.5 hover:bg-white rounded transition shadow-sm bg-transparent"><ChevronLeft size={18} /></button>
                                    <span className="px-4 text-sm font-bold min-w-[200px] text-center">
                                        {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
                                    </span>
                                    <button onClick={() => navigateWeek(1)} className="p-1.5 hover:bg-white rounded transition shadow-sm bg-transparent"><ChevronRight size={18} /></button>
                                </div>
                                <span className={`px-3 py-1 text-xs font-bold rounded-full border ${status === 'APPROVED' ? 'bg-green-50 text-green-700 border-green-200' :
                                    status === 'SUBMITTED' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                        status === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-200' :
                                            'bg-slate-50 text-slate-600 border-slate-200'
                                    }`}>
                                    {status}
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Week Ending Date</label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        value={format(weekEnd, 'yyyy-MM-dd')}
                                        onChange={(e) => handleWeekEndChange(e.target.value)}
                                        className="pl-9 pr-3 py-2 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-44"
                                    />
                                    <Calendar size={16} className="absolute left-3 top-2.5 text-slate-400" />
                                </div>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200">
                                        <th className="p-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider border-r border-slate-200 w-48">Hours Category</th>
                                        {days.map(day => (
                                            <th key={day.toISOString()} className="p-4 text-center border-r border-slate-200 bg-white">
                                                <div className="text-xs font-bold text-slate-900 mb-0.5">{format(day, 'EEEE')}</div>
                                                <div className="text-[10px] text-slate-400 font-medium">{format(day, 'MMM d')}</div>
                                            </th>
                                        ))}
                                        <th className="p-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-50">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories.map(cat => (
                                        <tr key={cat.id} className={`group border-b border-slate-100 hover:bg-blue-50/30 transition-colors ${cat.isOT ? 'bg-blue-50/10' : ''}`}>
                                            <td className="p-4 border-r border-slate-200">
                                                <div className="flex items-center gap-2">
                                                    <span className={`w-1.5 h-1.5 rounded-full ${cat.isOT ? 'bg-blue-500' : 'bg-slate-300'}`}></span>
                                                    <span className="text-sm font-semibold text-slate-700">{cat.label}</span>
                                                    {cat.isOT && <span className="text-[8px] font-bold text-blue-600 border border-blue-200 bg-blue-50 px-1 rounded uppercase">OT Qualified</span>}
                                                </div>
                                            </td>
                                            {days.map(day => {
                                                const dateStr = format(day, 'yyyy-MM-dd');
                                                const val = formData[dateStr]?.[cat.id] || '';
                                                return (
                                                    <td key={dateStr} className="p-2 border-r border-slate-200">
                                                        <input
                                                            type="number"
                                                            value={val}
                                                            disabled={status !== 'DRAFT' && status !== 'REJECTED'}
                                                            onChange={(e) => handleInputChange(dateStr, cat.id, e.target.value)}
                                                            className={`w-full text-center py-2 px-1 text-sm font-medium border border-transparent rounded hover:border-slate-300 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all ${Number(val) > 0 ? 'text-slate-900' : 'text-slate-300'}`}
                                                            placeholder="0.00"
                                                        />
                                                    </td>
                                                );
                                            })}
                                            <td className="p-4 text-center font-bold text-slate-900 bg-slate-50/50">
                                                {calculateCategoryTotal(cat.id).toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                    {/* Total Row */}
                                    <tr className="bg-slate-100/50 font-bold border-t-2 border-slate-200">
                                        <td className="p-4 border-r border-slate-200 text-sm uppercase tracking-wider text-slate-600">Total Hours</td>
                                        {days.map(day => (
                                            <td key={day.toISOString()} className="p-4 text-center border-r border-slate-200 text-blue-700">
                                                {calculateDailyTotal(format(day, 'yyyy-MM-dd')).toFixed(2)}
                                            </td>
                                        ))}
                                        <td className="p-4 text-center text-lg text-blue-800 bg-blue-50">
                                            {totalHours.toFixed(2)}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Reviewer Comment Section */}
                        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Clock size={18} className="text-slate-400" />
                                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Reviewer Section</h3>
                            </div>
                            <div className="space-y-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-slate-600 uppercase tracking-tight">Manager Feedback / Rejection Reason</label>
                                    <textarea
                                        className="w-full min-h-[100px] p-4 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 text-slate-700"
                                        placeholder="No reviewer comments yet..."
                                        value={reviewerComment}
                                        onChange={(e) => isAdmin && setReviewerComment(e.target.value)}
                                        readOnly={!isAdmin}
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Summary Panel */}
                    <aside className="w-80 flex flex-col gap-6 overflow-y-auto">
                        {/* Status Info */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full -mr-12 -mt-12"></div>
                            <h3 className="text-sm font-bold text-slate-900 mb-6 relative z-10">Submission Summary</h3>

                            <div className="space-y-5 relative z-10">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-slate-500 font-bold uppercase tracking-tight">Status</span>
                                    <span className={`font-bold ${status === 'APPROVED' ? 'text-green-600' :
                                        status === 'SUBMITTED' ? 'text-blue-600' :
                                            'text-slate-600'
                                        }`}>{status}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-slate-500 font-bold uppercase tracking-tight">Submit Date</span>
                                    <span className="text-slate-900 font-semibold">{submitDate || '--'}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-slate-500 font-bold uppercase tracking-tight">Approval Date</span>
                                    <span className="text-slate-900 font-semibold">{approvalDate || '--'}</span>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col gap-3">
                                {status === 'DRAFT' ? (
                                    <div className="flex items-center gap-2 p-3 bg-slate-50 text-slate-500 rounded-lg text-[10px] italic">
                                        <Info size={14} />
                                        <span>Review your hours before submitting.</span>
                                    </div>
                                ) : status === 'SUBMITTED' ? (
                                    <div className="flex items-center gap-2 p-3 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold">
                                        <Clock size={14} />
                                        <span>Pending Approval</span>
                                    </div>
                                ) : status === 'APPROVED' ? (
                                    <div className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-lg text-xs font-semibold">
                                        <CheckCircle size={14} />
                                        <span>Payment Processed</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg text-xs font-semibold">
                                        <XCircle size={14} />
                                        <span>Requires Correction</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Performance / Hours Summary */}
                        <div className="bg-slate-900 text-white rounded-xl shadow-lg shadow-blue-900/10 p-6 overflow-hidden relative">
                            <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mb-16 -mr-16"></div>
                            <h3 className="text-sm font-bold opacity-70 mb-6 uppercase tracking-widest">Timesheet Logic</h3>

                            <div className="space-y-6">
                                <div>
                                    <div className="flex justify-between items-end mb-1">
                                        <span className="text-xs font-medium opacity-60">All Hours Credited</span>
                                        <span className="text-xl font-bold">{totalHours.toFixed(2)}</span>
                                    </div>
                                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-blue-400 h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (totalHours / 45) * 100)}%` }}></div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                                        <div className="text-[10px] font-bold opacity-50 uppercase tracking-wider mb-1">Qualifying for OT</div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg font-bold">{calculateCategoryTotal('workHours').toFixed(2)}</span>
                                            <span className="text-[10px] px-1.5 py-0.5 bg-blue-500/20 text-blue-300 rounded border border-blue-500/30 font-bold uppercase italic">
                                                Exempt
                                            </span>
                                        </div>
                                    </div>

                                    <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                                        <div className="text-[10px] font-bold opacity-50 uppercase tracking-wider mb-1">Standard Work Week</div>
                                        <div className="text-lg font-bold">40.00</div>
                                    </div>

                                    <div className="bg-blue-500 p-3 rounded-lg shadow-lg shadow-blue-500/20">
                                        <div className="text-[10px] font-bold text-white/70 uppercase tracking-wider mb-1">Credited OT Hours</div>
                                        <div className="text-2xl font-black text-white">{otHours.toFixed(2)}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default TimesheetPage;
