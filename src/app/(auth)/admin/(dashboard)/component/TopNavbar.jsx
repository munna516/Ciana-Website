"use client";

import { Bell, Menu, User, LogOut, Search, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import toast from "react-hot-toast";

export default function TopNavbar({
    isSidebarOpen,
    setIsSidebarOpen,
    mobileSidebar,
    setMobileSidebar,
    user = null,
}) {
    const router = useRouter();

    const handleSignOut = () => {
        localStorage.removeItem('rememberMe');
        toast.success("Signed out successfully");
        router.push('/admin/login');
    };

    const userName = user?.name || user?.email || "Moni Roy";
    const userImage = user?.image || "";
    const userRole = user?.role || "Admin";
    const userInitial = userName.charAt(0).toUpperCase();

    return (
        <nav className="h-20 border-b border-gray-200 flex items-center px-3 sm:px-4 md:px-6 z-20 bg-white">
            <div className="flex items-center justify-between w-full gap-2 sm:gap-4">
                {/* Left: Hamburger Menu + Search Bar */}
                <div className="flex items-center gap-1 sm:gap-4 flex-1 min-w-0">
                    <button
                        onClick={() => {
                            if (window.innerWidth < 768) {
                                setMobileSidebar(!mobileSidebar);
                            } else {
                                setIsSidebarOpen(!isSidebarOpen);
                            }
                        }}
                        className="p-1.5 rounded-md hover:bg-gray-100 transition-colors flex-shrink-0"
                        aria-label="Toggle sidebar"
                    >
                        <Menu className="cursor-pointer text-gray-600 hover:text-gray-900 w-5 h-5 sm:w-6 sm:h-6" />
                    </button>

                    {/* Search Bar */}
                    <div className="flex-1 max-w-xl min-w-0">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 sm:w-6 sm:h-6" />
                            <input
                                type="text"
                                placeholder="Search"
                                className="w-full pl-12 sm:pl-14 pr-4 py-3 sm:py-3.5 bg-gray-100 rounded-full border outline-none focus:ring-2 focus:ring-primary/50 text-base sm:text-lg placeholder:text-gray-400"
                            />
                        </div>
                    </div>
                </div>



                {/* Right: Notifications, Language, User */}
                <div className="flex items-center gap-2 sm:gap-3 md:gap-10 flex-shrink-0">
                    {/* Notification Bell */}
                    <Button variant="ghost" size="icon" className="relative h-9 w-9 sm:h-10 sm:w-10">
                        <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 font-bold " />
                        <span className="absolute top-0 right-0 w-3 h-3 sm:w-4 sm:h-4 bg-red-500 text-white text-[10px] sm:text-xs rounded-full flex items-center justify-center">
                            6
                        </span>
                    </Button>

                    {/* Language Selector - Hidden on mobile */}
                    {/* <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="hidden sm:flex items-center gap-1 sm:gap-2 h-auto py-2">

                                <span className="text-xs sm:text-sm text-gray-600 hidden md:inline">English</span>
                                <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>English</DropdownMenuItem>
                            <DropdownMenuItem>Spanish</DropdownMenuItem>
                            <DropdownMenuItem>French</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu> */}

                    {/* User Profile */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div className="flex items-center gap-2 sm:gap-3 cursor-pointer">
                                <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                                    <AvatarImage src={userImage} alt="Profile" />
                                    <AvatarFallback className="bg-primary text-white text-xs sm:text-sm">
                                        {userInitial}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="hidden lg:flex flex-col items-start">
                                    <span className="text-sm font-semibold text-gray-800">
                                        {userName}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {userRole}
                                    </span>
                                </div>
                                <ChevronDown className="w-4 h-4 text-gray-400 hidden lg:block" />
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">
                                        {userName}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {userRole}
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                                className="text-red-600 cursor-pointer"
                                onClick={handleSignOut}
                            >
                                <LogOut className="mr-2 h-4 w-4 font-bold" />
                                <span className="font-bold">Logout</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </nav>
    );
}