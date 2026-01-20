'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getVisibleMenuItems, UserRole } from '@/config/rbac';
import { ChevronDown } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { COLORS } from '@/config/theme';

interface SidebarProps {
  isCollapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
}

export const Sidebar = ({ isCollapsed = false, onCollapse }: SidebarProps) => {
  const pathname = usePathname();
  const { user } = useAuth();
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set());

  if (!user) return null;

  const userRole = (user.role as UserRole) || UserRole.EMPLOYEE;
  const menuItems = getVisibleMenuItems(userRole);

  const toggleMenu = (menuId: string) => {
    const newExpanded = new Set(expandedMenus);
    if (newExpanded.has(menuId)) {
      newExpanded.delete(menuId);
    } else {
      newExpanded.add(menuId);
    }
    setExpandedMenus(newExpanded);
  };

  const isActive = (href?: string) => {
    if (!href) return false;
    return pathname === href || pathname.startsWith(href + '/');
  };

  const renderIcon = (iconName: string) => {
    const IconComponent = LucideIcons[iconName as keyof typeof LucideIcons] as any;
    return IconComponent ? <IconComponent size={20} /> : null;
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-white transition-all duration-300 z-40 border-r`}
      style={{
        width: isCollapsed ? '80px' : '280px',
        borderRightColor: COLORS.border,
        backgroundColor: '#FFFFFF',
      }}
    >
      {/* Logo Section */}
      <div
        className="flex items-center justify-between h-16 px-6 border-b"
        style={{ borderBottomColor: COLORS.border }}
      >
        {!isCollapsed && (
          <Link href="/dashboard" className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
              style={{ backgroundColor: COLORS.primary[800] }}
            >
              ERP
            </div>
            <span className="text-lg font-bold" style={{ color: COLORS.primary[800] }}>
              Payroll
            </span>
          </Link>
        )}
        <button
          onClick={() => onCollapse?.(!isCollapsed)}
          className="p-1 hover:bg-gray-100 rounded-lg transition"
        >
          <ChevronDown
            size={18}
            style={{
              color: COLORS.textSecondary,
              transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s',
            }}
          />
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto py-6">
        <div className="space-y-1 px-3">
          {menuItems.map((item) => (
            <div key={item.id}>
              {/* Parent Menu Item */}
              {item.children && item.children.length > 0 ? (
                <button
                  onClick={() => toggleMenu(item.id)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-lg transition group relative"
                  style={{
                    backgroundColor: expandedMenus.has(item.id) ? COLORS.backgroundLight : 'transparent',
                    color: expandedMenus.has(item.id) ? COLORS.primary[800] : COLORS.textPrimary,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      style={{
                        color: expandedMenus.has(item.id) ? COLORS.primary[600] : COLORS.textSecondary,
                      }}
                    >
                      {renderIcon(item.icon)}
                    </div>
                    {!isCollapsed && <span className="font-medium text-sm">{item.label}</span>}
                  </div>
                  {!isCollapsed && (
                    <ChevronDown
                      size={16}
                      style={{
                        transform: expandedMenus.has(item.id) ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s',
                        color: COLORS.textSecondary,
                      }}
                    />
                  )}
                </button>
              ) : (
                <Link
                  href={item.href || '#'}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition relative group"
                  style={{
                    backgroundColor: isActive(item.href) ? COLORS.backgroundLight : 'transparent',
                    color: isActive(item.href) ? COLORS.primary[800] : COLORS.textPrimary,
                  }}
                >
                  <div
                    style={{
                      color: isActive(item.href) ? COLORS.primary[600] : COLORS.textSecondary,
                    }}
                  >
                    {renderIcon(item.icon)}
                  </div>
                  {!isCollapsed && (
                    <span className="font-medium text-sm flex-1 text-left">{item.label}</span>
                  )}
                  {isActive(item.href) && (
                    <div
                      className="absolute left-0 top-0 bottom-0 w-1 rounded-r-lg"
                      style={{ backgroundColor: COLORS.primary[600] }}
                    />
                  )}
                </Link>
              )}

              {/* Child Menu Items */}
              {item.children && expandedMenus.has(item.id) && !isCollapsed && (
                <div className="ml-4 mt-1 space-y-1 border-l" style={{ borderLeftColor: COLORS.border }}>
                  {item.children.map((child) => (
                    <Link
                      key={child.id}
                      href={child.href || '#'}
                      className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition relative group"
                      style={{
                        backgroundColor: isActive(child.href) ? COLORS.backgroundLight : 'transparent',
                        color: isActive(child.href) ? COLORS.primary[800] : COLORS.textSecondary,
                      }}
                    >
                      <div
                        style={{
                          color: isActive(child.href) ? COLORS.primary[600] : COLORS.textSecondary,
                        }}
                      >
                        {renderIcon(child.icon)}
                      </div>
                      <span className="font-medium">{child.label}</span>
                      {isActive(child.href) && (
                        <div
                          className="absolute left-0 top-0 bottom-0 w-1 rounded-r-lg"
                          style={{ backgroundColor: COLORS.primary[600] }}
                        />
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* Footer Section */}
      <div
        className="border-t px-3 py-4"
        style={{ borderTopColor: COLORS.border }}
      >
        {!isCollapsed && (
          <div
            className="px-4 py-3 rounded-lg text-xs"
            style={{ backgroundColor: COLORS.backgroundLight }}
          >
            <p style={{ color: COLORS.textPrimary }} className="font-semibold">
              {user.firstName} {user.lastName}
            </p>
            <p style={{ color: COLORS.textSecondary }}>{user.role}</p>
          </div>
        )}
      </div>
    </aside>
  );
};
