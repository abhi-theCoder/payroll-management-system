'use client';

import React, { useState, useEffect } from 'react';
import { format, startOfWeek, addDays, subWeeks, addWeeks } from 'date-fns';

const TimesheetPage = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
    const [entries, setEntries] = useState<any[]>([]); // Should fetch from API
    const [loading, setLoading] = useState(false);

    // Rows configuration
    const entryTypes = [
        { key: 'workHours', label: 'Work' },
        { key: 'sickHours', label: 'Sick' },
        { key: 'personalHours', label: 'Personal' },
    ];

    // Initialize empty grid if no data
    const days = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));

    // Local state for form data: map of date_key -> { work, sick, personal }
    const [formData, setFormData] = useState<Record<string, Record<string, number>>>({});

    useEffect(() => {
        // Reset data when week changes
        setWeekStart(startOfWeek(currentDate, { weekStartsOn: 1 }));
        // TODO: Fetch existing timesheet data here
        setFormData({}); // temporary reset
    }, [currentDate]);

    const handleDateChange = (amount: number) => {
        setCurrentDate(addWeeks(currentDate, amount));
    };

    const handleInputChange = (dateStr: string, type: string, value: string) => {
        const val = parseFloat(value) || 0;

        // Validation logic happens on blur or submit, but we can constrain input here if needed?
        // User wants: "Sick and Personal leave must be of full day ... i.e. 8 hrs"
        // We can show error if not 8 or 0.

        setFormData(prev => ({
            ...prev,
            [dateStr]: {
                ...prev[dateStr],
                [type]: val
            }
        }));
    };

    const validate = () => {
        const errors = [];
        for (const dateStr in formData) {
            const dayData = formData[dateStr];
            if (dayData.sickHours > 0 && dayData.sickHours !== 8) {
                errors.push(`Sick leave on ${dateStr} must be 8 hours`);
            }
            if (dayData.personalHours > 0 && dayData.personalHours !== 8) {
                errors.push(`Personal leave on ${dateStr} must be 8 hours`);
            }
        }
        return errors;
    };

    const handleSubmit = async () => {
        const formErrors = validate();
        if (formErrors.length > 0) {
            alert(formErrors.join('\n'));
            return;
        }

        setLoading(true);
        // Format data for API
        const apiEntries = [];
        // Iterate over days to capture 0s as well if needed, or just formData?
        // Better to map over `days`
        for (const day of days) {
            const dateStr = format(day, 'yyyy-MM-dd');
            const dayData = formData[dateStr] || {};

            apiEntries.push({
                date: day.toISOString(),
                dayOfWeek: format(day, 'EEE').toUpperCase(),
                workHours: dayData.workHours || 0,
                sickHours: dayData.sickHours || 0,
                personalHours: dayData.personalHours || 0,
                comments: ''
            });
        }

        try {
            const res = await fetch('http://localhost:3000/api/timesheet/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` }, // Adjust auth
                body: JSON.stringify({
                    employeeId: 'current-user-id', // TODO: Get from context/auth
                    weekStartDate: weekStart.toISOString(),
                    entries: apiEntries,
                    status: 'SUBMITTED'
                })
            });
            if (!res.ok) throw new Error(await res.text());
            alert('Timesheet Submitted Successfully');
        } catch (e: any) {
            console.error(e);
            alert('Error: ' + e.message);
        } finally {
            setLoading(false);
        }
    };

    const calculateTotal = (type?: string) => {
        let total = 0;
        for (const day of days) {
            const dateStr = format(day, 'yyyy-MM-dd');
            const data = formData[dateStr];
            if (!data) continue;
            if (type) {
                total += (data[type] || 0);
            } else {
                total += (data.workHours || 0) + (data.sickHours || 0) + (data.personalHours || 0);
            }
        }
        return total;
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <header className="mb-6 flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Timesheets</h1>
                    <p className="text-gray-500">Manage and submit your weekly hours</p>
                </div>
                <div className="space-x-2">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition" onClick={handleSubmit} disabled={loading}>
                        {loading ? 'Submitting...' : 'Submit'}
                    </button>
                </div>
            </header>

            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <div className="flex items-center space-x-4 mb-6">
                    <h2 className="text-lg font-semibold text-gray-700 mb-0 flex-1">Timesheet Entry</h2>
                    <div className="flex items-center bg-gray-100 rounded-lg p-1">
                        <button onClick={() => handleDateChange(-1)} className="px-3 py-1 hover:bg-white rounded-md text-gray-600">←</button>
                        <span className="px-4 font-medium text-gray-700">
                            Week of {format(weekStart, 'MMM d, yyyy')}
                        </span>
                        <button onClick={() => handleDateChange(1)} className="px-3 py-1 hover:bg-white rounded-md text-gray-600">→</button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr>
                                <th className="p-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-32">Type</th>
                                {days.map(day => (
                                    <th key={day.toString()} className="p-3 border-b-2 border-gray-200 bg-gray-50 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[100px]">
                                        <div className="text-gray-900">{format(day, 'EEE')}</div>
                                        <div className="text-gray-500 text-[10px]">{format(day, 'MM/dd')}</div>
                                    </th>
                                ))}
                                <th className="p-3 border-b-2 border-gray-200 bg-gray-50 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider w-24">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {entryTypes.map(type => (
                                <tr key={type.key} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-3 border-b border-gray-100 font-medium text-gray-700">{type.label}</td>
                                    {days.map(day => {
                                        const dateStr = format(day, 'yyyy-MM-dd');
                                        const val = formData[dateStr]?.[type.key] || '';
                                        return (
                                            <td key={dateStr} className="p-2 border-b border-gray-100">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="24"
                                                    step="0.5"
                                                    className="w-full text-center border border-gray-300 rounded-md py-1 px-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                                    value={val}
                                                    onChange={(e) => handleInputChange(dateStr, type.key, e.target.value)}
                                                />
                                            </td>
                                        )
                                    })}
                                    <td className="p-3 border-b border-gray-100 text-center font-bold text-gray-700 bg-gray-50/50">
                                        {calculateTotal(type.key).toFixed(1)}
                                    </td>
                                </tr>
                            ))}
                            <tr className="bg-blue-50/30 font-bold">
                                <td className="p-3 border-t border-gray-200 text-gray-800">Total</td>
                                {days.map(day => {
                                    const dateStr = format(day, 'yyyy-MM-dd');
                                    let dayTotal = 0;
                                    entryTypes.forEach(t => dayTotal += (formData[dateStr]?.[t.key] || 0));
                                    return (
                                        <td key={dateStr} className="p-3 border-t border-gray-200 text-center text-blue-700">
                                            {dayTotal.toFixed(1)}
                                        </td>
                                    )
                                })}
                                <td className="p-3 border-t border-gray-200 text-center text-blue-800 text-lg">
                                    {calculateTotal().toFixed(1)}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 flex items-start space-x-2 text-sm text-gray-500 bg-blue-50 border border-blue-100 p-3 rounded-lg">
                    <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <p>Sick leave and Personal leave must be taken as full days (8 hours). Half-days or partial hours are not allowed for these categories.</p>
                </div>
            </div>
        </div>
    );
};

export default TimesheetPage;
