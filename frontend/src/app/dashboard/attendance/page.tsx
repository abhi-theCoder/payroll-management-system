'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Navigation } from '@/components/Navigation';

export default function AttendancePage() {
  const [selectedMonth, setSelectedMonth] = useState<string>('2024-01');
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [viewType, setViewType] = useState<'calendar' | 'table'>('calendar');

  const employees = [
    { id: '1', name: 'John Doe', code: 'EMP001', department: 'Engineering' },
    { id: '2', name: 'Jane Smith', code: 'EMP002', department: 'HR' },
    { id: '3', name: 'Mike Johnson', code: 'EMP003', department: 'Finance' },
  ];

  const attendanceData = [
    { date: 1, status: 'P', notes: 'Present' },
    { date: 2, status: 'P', notes: 'Present' },
    { date: 3, status: 'L', notes: 'Leave' },
    { date: 4, status: 'A', notes: 'Absent' },
    { date: 5, status: 'P', notes: 'Present' },
    { date: 6, status: 'H', notes: 'Half Day' },
    { date: 7, status: 'P', notes: 'Present' },
    { date: 8, status: 'P', notes: 'Present' },
    { date: 9, status: 'P', notes: 'Present' },
    { date: 10, status: 'L', notes: 'Leave' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'P':
        return 'bg-green-100 text-green-800';
      case 'A':
        return 'bg-red-100 text-red-800';
      case 'L':
        return 'bg-blue-100 text-blue-800';
      case 'H':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Attendance Management</h1>
          <p className="text-gray-600 mt-2">Track employee attendance and manage records</p>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Employee</label>
              <select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">All Employees</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">View</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewType('calendar')}
                  className={`px-3 py-2 text-sm rounded-md ${
                    viewType === 'calendar'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  Calendar
                </button>
                <button
                  onClick={() => setViewType('table')}
                  className={`px-3 py-2 text-sm rounded-md ${
                    viewType === 'table'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  Table
                </button>
              </div>
            </div>
            <div className="flex items-end">
              <Button variant="primary" size="sm" className="w-full">
                Mark Attendance
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          {[
            { label: 'Total Days', value: '22', color: 'bg-blue-100 text-blue-800' },
            { label: 'Present', value: '18', color: 'bg-green-100 text-green-800' },
            { label: 'Absent', value: '1', color: 'bg-red-100 text-red-800' },
            { label: 'Leave', value: '2', color: 'bg-blue-100 text-blue-800' },
            { label: 'Half Day', value: '1', color: 'bg-yellow-100 text-yellow-800' },
          ].map((stat) => (
            <div key={stat.label} className={`${stat.color} rounded-lg p-4 text-center`}>
              <p className="text-sm font-medium opacity-75">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Calendar View */}
        {viewType === 'calendar' && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Attendance Calendar - January 2024</h2>
            <div className="grid grid-cols-7 gap-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center font-semibold text-gray-600 py-2">
                  {day}
                </div>
              ))}
              {/* Empty cells for days before 1st */}
              {[...Array(3)].map((_, i) => (
                <div key={`empty-${i}`}></div>
              ))}
              {/* Attendance days */}
              {attendanceData.map((day) => (
                <div
                  key={day.date}
                  className={`${getStatusColor(day.status)} rounded-lg p-3 text-center cursor-pointer hover:shadow-md transition`}
                >
                  <p className="font-bold">{day.date}</p>
                  <p className="text-xs">{day.status}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Table View */}
        {viewType === 'table' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Notes</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {attendanceData.map((record, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">Jan {record.date}, 2024</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                        {record.notes}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{record.notes}</td>
                    <td className="px-6 py-4">
                      <Button variant="secondary" size="sm">
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Legend */}
        <div className="mt-6 bg-white rounded-lg shadow-md p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Legend</h3>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 bg-green-100 text-green-800 rounded text-center text-xs font-bold">P</span>
              <span className="text-sm text-gray-600">Present</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 bg-red-100 text-red-800 rounded text-center text-xs font-bold">A</span>
              <span className="text-sm text-gray-600">Absent</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-100 text-blue-800 rounded text-center text-xs font-bold">L</span>
              <span className="text-sm text-gray-600">Leave</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 bg-yellow-100 text-yellow-800 rounded text-center text-xs font-bold">H</span>
              <span className="text-sm text-gray-600">Half Day</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
