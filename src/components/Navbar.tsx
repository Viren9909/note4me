'use client'
import React from 'react'
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { User } from 'next-auth';
import {
    LogOut,
    User as UserIcon,
    Settings,
    StickyNote,
    LayoutDashboard,
    LogIn
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from './ui/dropdown-menu';

const Navbar = () => {
    const { data: session } = useSession();
    const isAuthenticated = !!session;
    const user: User = session?.user as User;

    return (
        <nav className='bg-primary text-primary-foreground px-5 md:px-8 shadow-md fixed top-0 left-0 w-full z-50'>
            <div className='flex items-center justify-between px-4 py-3 md:px-6'>
                
                <Link href="/dashboard" className='text-2xl font-bold flex items-center gap-1'>
                    Note<span className='text-accent'>4</span>Me
                </Link>

                {isAuthenticated && (
                    <div className='hidden md:flex items-center gap-6'>
                        <Link href="/dashboard" className='flex items-center gap-1 font-semibold'>
                            <LayoutDashboard size={18} /> Dashboard
                        </Link>
                        {/* <Link href="/notes" className='flex items-center gap-1 font-semibold'>
                            <StickyNote size={18} /> Notes
                        </Link>
                        <Link href="/profile" className='flex items-center gap-1 font-semibold'>
                            <UserIcon size={18} /> Profile
                        </Link> */}
                    </div>
                )}

                <div className='flex items-center gap-3'>
                    {isAuthenticated ? (
                        <>
                            <span className='hidden md:inline'>Welcome, {user?.username || "User"}</span>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Avatar className='cursor-pointer w-10 h-10 bg-secondary'>
                                        <AvatarImage src={user?.image || ""} />
                                        <AvatarFallback>{user?.username?.charAt(0) || "U"}</AvatarFallback>
                                    </Avatar>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align='end'>
                                    <DropdownMenuLabel>{user?.username || "User"}</DropdownMenuLabel>
                                    <DropdownMenuSeparator />

                                    <DropdownMenuItem asChild>
                                        <Link href="/dashboard" className='flex items-center gap-2'>
                                            <LayoutDashboard size={16} /> Dashboard
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/notes" className='flex items-center gap-2'>
                                            <StickyNote size={16} /> Notes
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/profile" className='flex items-center gap-2'>
                                            <UserIcon size={16} /> Profile
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/settings" className='flex items-center gap-2'>
                                            <Settings size={16} /> Settings
                                        </Link>
                                    </DropdownMenuItem>

                                    <DropdownMenuSeparator />

                                    <DropdownMenuItem onClick={() => signOut()} className='text-red-600'>
                                        <LogOut size={16} className='mr-2' /> Sign out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    ) : (
                        <Link href="/sign-in" className='flex items-center gap-2 font-semibold'>
                            <LogIn size={18} /> Sign In
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
