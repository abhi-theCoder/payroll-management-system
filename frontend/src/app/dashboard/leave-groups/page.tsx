'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { RouteGuard } from '@/components/RouteGuard';
import { Permission } from '@/config/rbac';
import { Users, UserPlus, Settings, Edit, Trash, Check, X } from 'lucide-react';
import leaveService from '@/services/api/leaveService';

export default function LeaveGroupsPage() {
    const [groups, setGroups] = useState<any[]>([]);
    const [staffs, setStaffs] = useState<any[]>([]);
    const [eligibleReviewers, setEligibleReviewers] = useState<any[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
    const [showStaffModal, setShowStaffModal] = useState(false);
    const [showReviewerModal, setShowReviewerModal] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchGroups = async () => {
        try {
            const data = await leaveService.getLeaveGroups();
            setGroups(data);
            if (data.length > 0 && !selectedGroup) {
                setSelectedGroup(data[0].id);
            }
        } catch (error) {
            console.error('Failed to fetch groups:', error);
        }
    };

    const fetchStaffs = async () => {
        try {
            const data = await leaveService.getStaffListing();
            setStaffs(data);
        } catch (error) {
            console.error('Failed to fetch staffs:', error);
        }
    };

    const fetchEligibleReviewers = async () => {
        try {
            const data = await leaveService.getEligibleReviewers();
            setEligibleReviewers(data);
        } catch (error) {
            console.error('Failed to fetch eligible reviewers:', error);
        }
    };

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            await Promise.all([fetchGroups(), fetchStaffs(), fetchEligibleReviewers()]);
            setLoading(false);
        };
        init();
    }, []);

    const activeGroup = groups.find(g => g.id === selectedGroup);

    const handleAssignStaff = async (employeeId: string, leaveGroupId: string) => {
        try {
            await leaveService.assignStaff({ employeeId, leaveGroupId });
            await Promise.all([fetchGroups(), fetchStaffs()]);
        } catch (error: any) {
            alert(error.message || 'Failed to assign staff');
        }
    };

    const handleAssignReviewer = async (reviewerId: string, level: number) => {
        if (!selectedGroup) return;
        try {
            await leaveService.assignReviewer({
                leaveGroupId: selectedGroup,
                reviewerId,
                level
            });
            await fetchGroups();
        } catch (error: any) {
            alert('Failed to assign reviewer. Note: Level must be unique within the group.');
        }
    };

    const handleCreateGroup = async () => {
        const name = prompt('Enter group name:');
        if (!name) return;
        try {
            await leaveService.createLeaveGroup({ name });
            await fetchGroups();
        } catch (error) {
            alert('Failed to create group');
        }
    };

    if (loading) return null;

    return (
        <RouteGuard requiredPermission={Permission.MANAGE_SETTINGS}>
            <DashboardLayout>
                <div className="min-h-screen bg-gray-50 p-6">
                    <div className="max-w-7xl mx-auto">
                        <header className="mb-6 flex justify-between items-center bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 bg-indigo-50 rounded-lg text-indigo-600">
                                    <Users size={24} />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-gray-900">Leave Groups</h1>
                                    <p className="text-sm text-gray-500">Configure approval workflows and assignments</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowStaffModal(true)}
                                    className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition text-sm font-medium shadow-sm">
                                    <Users size={16} />
                                    Staff Listing
                                </button>
                                <button
                                    onClick={handleCreateGroup}
                                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition text-sm font-medium shadow-sm">
                                    <UserPlus size={16} />
                                    New Group
                                </button>
                            </div>
                        </header>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            {/* Groups List Sidebar */}
                            <div className="lg:col-span-4 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[calc(100vh-200px)]">
                                <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                                    <h2 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Workflow Groups</h2>
                                </div>
                                <div className="overflow-y-auto flex-1 p-2 space-y-1">
                                    {groups.map((group) => (
                                        <div
                                            key={group.id}
                                            onClick={() => setSelectedGroup(group.id)}
                                            className={`p-3 rounded-lg cursor-pointer transition flex justify-between items-center group ${selectedGroup === group.id ? 'bg-indigo-50 border border-indigo-100' : 'hover:bg-gray-50 border border-transparent'}`}
                                        >
                                            <div>
                                                <span className={`font-medium ${selectedGroup === group.id ? 'text-indigo-900' : 'text-gray-700'}`}>{group.name}</span>
                                                <p className="text-xs text-gray-500">{group._count?.employees || 0} Staff Members</p>
                                            </div>
                                            {selectedGroup === group.id && <Check size={16} className="text-indigo-600" />}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Main Content Area */}
                            <div className="lg:col-span-8 space-y-6 overflow-y-auto h-[calc(100vh-200px)] pr-2">
                                {/* Reviewers Section */}
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                                    <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                                        <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                                            Reviewers - <span className="text-indigo-600">{activeGroup?.name || 'Select a Group'}</span>
                                        </h2>
                                        <button
                                            onClick={() => setShowReviewerModal(true)}
                                            className="text-xs font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2 py-1 rounded">
                                            Manage Reviewers
                                        </button>
                                    </div>
                                    <div className="p-0">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                                                <tr>
                                                    <th className="px-6 py-3 w-16">Level</th>
                                                    <th className="px-6 py-3">Reviewer Name</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {activeGroup?.reviewers?.length ? activeGroup.reviewers.map((r: any, i: number) => (
                                                    <tr key={r.id}>
                                                        <td className="px-6 py-4 font-medium text-gray-900 border-r border-gray-50">Level {r.level}</td>
                                                        <td className="px-6 py-4">
                                                            <div className="font-medium text-gray-900">{r.reviewer?.firstName} {r.reviewer?.lastName}</div>
                                                            <div className="text-gray-500 text-xs">{r.reviewer?.email}</div>
                                                        </td>
                                                    </tr>
                                                )) : (
                                                    <tr>
                                                        <td colSpan={2} className="px-6 py-12 text-center">
                                                            <div className="flex flex-col items-center gap-2 text-gray-400">
                                                                <Users size={32} />
                                                                <p className="italic">No reviewers assigned yet</p>
                                                                <p className="text-xs">At least one reviewer is required before assigning staff</p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Assigned Staff Section */}
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                                    <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                                        <h2 className="font-semibold text-gray-800">Assigned Staff List</h2>
                                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{staffs.filter(s => s.leaveGroup?.id === selectedGroup).length} Members</span>
                                    </div>
                                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {staffs.filter(s => s.leaveGroup?.id === selectedGroup).length > 0 ? (
                                            staffs.filter(s => s.leaveGroup?.id === selectedGroup).map(s => (
                                                <div key={s.id} className="p-3 border border-gray-100 rounded-lg bg-gray-50/30 flex items-start gap-3">
                                                    <div className="w-8 h-8 rounded bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs uppercase">
                                                        {s.firstName[0]}{s.lastName[0]}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900 text-sm">{s.firstName} {s.lastName}</p>
                                                        <p className="text-xs text-gray-500">{s.designation}</p>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="col-span-full py-8 text-center text-gray-400 text-sm italic">
                                                No staff members assigned to this group.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Staff Listing Modal */}
                        {showStaffModal && (
                            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden">
                                    <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white">
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-lg">Staff Directory</h3>
                                            <p className="text-xs text-gray-500">Assign staff members to leave workflow groups</p>
                                        </div>
                                        <button onClick={() => setShowStaffModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition">
                                            <X size={20} className="text-gray-500" />
                                        </button>
                                    </div>
                                    <div className="flex-1 overflow-auto bg-gray-50/30">
                                        <table className="w-full text-left text-sm">
                                            <thead className="bg-white text-gray-600 font-semibold uppercase text-[10px] tracking-wider sticky top-0 border-b border-gray-100">
                                                <tr>
                                                    <th className="px-6 py-4">Name</th>
                                                    <th className="px-6 py-4">Title & Department</th>
                                                    <th className="px-6 py-4">Assigned Group</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {staffs.map(s => (
                                                    <tr key={s.id} className="bg-white hover:bg-indigo-50/30 transition">
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-bold uppercase">{s.firstName[0]}{s.lastName[0]}</div>
                                                                <div className="font-semibold text-gray-900">{s.firstName} {s.lastName}</div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="text-gray-800">{s.designation}</div>
                                                            <div className="text-indigo-600 text-[11px] font-medium">{s.department}</div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <select
                                                                value={s.leaveGroup?.id || ''}
                                                                onChange={(e) => handleAssignStaff(s.id, e.target.value)}
                                                                className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs bg-white shadow-sm hover:border-indigo-300 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none w-full transition">
                                                                <option value="">No group assigned</option>
                                                                {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                                                            </select>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="p-4 border-t border-gray-100 bg-white flex justify-end">
                                        <button onClick={() => setShowStaffModal(false)} className="bg-indigo-600 text-white px-8 py-2 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/20 active:scale-95">Save Changes</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Reviewer Management Modal */}
                        {showReviewerModal && (
                            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden">
                                    <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white">
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-lg text-amber-600">Manage Workflow Reviewers</h3>
                                            <p className="text-xs text-gray-500">Group: {activeGroup?.name}</p>
                                        </div>
                                        <button onClick={() => setShowReviewerModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition">
                                            <X size={20} className="text-gray-500" />
                                        </button>
                                    </div>
                                    <div className="flex-1 overflow-auto p-5 space-y-4">
                                        <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 flex items-start gap-3">
                                            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-700"><Settings size={20} /></div>
                                            <div>
                                                <h4 className="text-sm font-bold text-indigo-900">Reviewer Assignment Rules</h4>
                                                <ul className="text-xs text-indigo-700 mt-1 list-disc list-inside space-y-0.5">
                                                    <li>Reviewers must have ADMIN, HR, or MANAGER roles.</li>
                                                    <li>At least one reviewer is required before staff can be added.</li>
                                                    <li>Each level must be unique within a group.</li>
                                                </ul>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Eligible Personnel</h4>
                                            <div className="grid grid-cols-1 gap-2">
                                                {eligibleReviewers.map(user => {
                                                    const existing = activeGroup?.reviewers?.find((r: any) => r.reviewerId === user.id);
                                                    return (
                                                        <div key={user.id} className={`p-4 border rounded-xl flex items-center justify-between transition group ${existing ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-gray-100 hover:border-indigo-200 hover:shadow-sm'}`}>
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-indigo-600 font-bold group-hover:scale-110 transition shadow-sm">
                                                                    {user.firstName[0]}{user.lastName[0]}
                                                                </div>
                                                                <div>
                                                                    <div className="font-bold text-gray-900 text-sm leading-tight">{user.firstName} {user.lastName}</div>
                                                                    <div className="flex items-center gap-2 mt-0.5">
                                                                        <span className="text-[10px] font-bold bg-white text-indigo-600 px-1.5 py-0.5 rounded border border-indigo-100 uppercase tracking-tight">{user.role}</span>
                                                                        <span className="text-[10px] text-gray-400 font-medium">{user.email}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                {existing ? (
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-xs font-bold text-indigo-700 bg-indigo-100/50 px-2 py-1 rounded-lg border border-indigo-200">Level {existing.level}</span>
                                                                        <button
                                                                            onClick={() => handleAssignReviewer(user.id, 0)} // Assuming 0 means remove or just toggle
                                                                            className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg transition"
                                                                            title="Remove Reviewer">
                                                                            <Trash size={16} />
                                                                        </button>
                                                                    </div>
                                                                ) : (
                                                                    <div className="flex items-center gap-1.5 bg-gray-50 p-1 rounded-lg border border-gray-100">
                                                                        <select
                                                                            id={`level-${user.id}`}
                                                                            className="text-[10px] font-bold bg-white border border-gray-200 rounded px-1.5 py-1 focus:ring-1 focus:ring-indigo-500 outline-none">
                                                                            <option value="1">L1</option>
                                                                            <option value="2">L2</option>
                                                                            <option value="3">L3</option>
                                                                        </select>
                                                                        <button
                                                                            onClick={() => {
                                                                                const level = (document.getElementById(`level-${user.id}`) as HTMLSelectElement).value;
                                                                                handleAssignReviewer(user.id, parseInt(level));
                                                                            }}
                                                                            className="p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-sm"
                                                                            title="Add Reviewer">
                                                                            <Check size={16} />
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-center">
                                        <p className="text-[10px] text-gray-400 font-medium text-center max-w-xs">
                                            Changes are applied immediately. Reviewers at different levels will process applications sequentially.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </DashboardLayout>
        </RouteGuard>
    )
}
