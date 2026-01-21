'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, AlertCircle } from 'lucide-react';
import leaveService, { LeaveBalance } from '@/services/api/leaveService';

interface LeaveBalanceProps {
  onBalanceLoad?: (balances: LeaveBalance[]) => void;
}

export  function LeaveBalanceCards({ onBalanceLoad }: LeaveBalanceProps) {
  const [balances, setBalances] = useState<LeaveBalance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBalance = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await leaveService.getLeaveBalance();
        setBalances(data);
        onBalanceLoad?.(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load leave balance');
      } finally {
        setLoading(false);
      }
    };

    loadBalance();
  }, [onBalanceLoad]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
            <div className="h-8 bg-gray-300 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center gap-2 text-red-700">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (balances.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <p className="text-gray-600">No leave balance information available</p>
      </div>
    );
  }

  const getBalanceStatus = (remaining: number, total: number) => {
    const percentage = (remaining / total) * 100;
    if (percentage > 50) return { color: 'text-green-700', bg: 'bg-green-50' };
    if (percentage > 25) return { color: 'text-yellow-700', bg: 'bg-yellow-50' };
    return { color: 'text-red-700', bg: 'bg-red-50' };
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Leave Balance</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {balances.map((balance) => {
          const status = getBalanceStatus(balance.remaining, balance.total);
          const percentage = (balance.remaining / balance.total) * 100;

          return (
            <div key={balance.id} className={`rounded-lg shadow p-6 border-l-4 ${status.bg}`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600 font-medium">
                    {balance.leaveType?.name || 'Leave Type'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Year: {balance.year}
                  </p>
                </div>
                <TrendingUp size={20} className={status.color} />
              </div>

              <div className="space-y-3">
                {/* Total Allotted */}
                <div>
                  <p className="text-xs text-gray-600">Total Allotted</p>
                  <p className="text-2xl font-bold text-gray-900">{balance.total} days</p>
                </div>

                {/* Used Days */}
                <div className="flex justify-between">
                  <div>
                    <p className="text-xs text-gray-600">Used</p>
                    <p className="text-lg font-semibold text-gray-700">{balance.used} days</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Remaining</p>
                    <p className={`text-lg font-bold ${status.color}`}>
                      {balance.remaining} days
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      percentage > 50
                        ? 'bg-green-500'
                        : percentage > 25
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.max(percentage, 5)}%` }}
                  ></div>
                </div>

                {/* Percentage Text */}
                <p className="text-xs text-gray-600 text-center">
                  {Math.round(percentage)}% remaining
                </p>

                {/* Carried Forward (if any) */}
                {balance.carriedForward > 0 && (
                  <div className="pt-3 border-t border-gray-300">
                    <p className="text-xs text-gray-600">Carried Forward</p>
                    <p className="text-sm font-semibold text-gray-700">
                      {balance.carriedForward} days
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-3">Leave Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Total Allotted</p>
            <p className="text-2xl font-bold text-blue-600">
              {balances.reduce((sum, b) => sum + b.total, 0)} days
            </p>
          </div>
          <div>
            <p className="text-gray-600">Total Used</p>
            <p className="text-2xl font-bold text-yellow-600">
              {balances.reduce((sum, b) => sum + b.used, 0)} days
            </p>
          </div>
          <div>
            <p className="text-gray-600">Total Remaining</p>
            <p className="text-2xl font-bold text-green-600">
              {balances.reduce((sum, b) => sum + b.remaining, 0)} days
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeaveBalanceCards;
