'use client'
import React, { useState, useRef, useEffect } from 'react';
import { signOut } from 'next-auth/react';

interface UserButtonProps {
    user?: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
        username?: string | null;
    } | null;
}

export default function UserButton({ user }: UserButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const displayName = user?.name || user?.username || 'User';
    const avatarUrl = user?.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(displayName)}`;

    return (
        <div className="relative inline-block text-left" ref={menuRef}>
            {/* Avatar Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
            >
                <img
                    className="h-9 w-9 rounded-full object-cover border border-gray-300 dark:border-gray-700"
                    src={avatarUrl}
                    alt={displayName}
                />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl bg-white dark:bg-slate-900 py-1 shadow-lg ring-1 ring-black ring-opacity-5 dark:ring-slate-800 focus:outline-none z-50">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-800">
                        <p className="text-sm font-medium text-gray-900 dark:text-slate-100">{displayName}</p>
                        {user?.email && <p className="text-xs text-gray-500 dark:text-slate-400 truncate">{user.email}</p>}
                    </div>

                    <div className="py-1">
                        <a
                            href="/dashboard"
                            className="block px-4 py-2 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                        >
                            Dashboard
                        </a>
                    </div>

                    <div className="py-1 border-t border-gray-100 dark:border-slate-800">
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                signOut({ callbackUrl: '/sign-in' });
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer"
                        >
                            Sign out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

