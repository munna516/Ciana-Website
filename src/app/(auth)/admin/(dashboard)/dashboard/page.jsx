'use client';

import { Users, User, UserCheck, UsersRound, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';

const overviewData = [
    {
        title: 'Total User',
        value: '981',
        change: '+8% from yesterday',
        icon: Users,
        bgColor: 'bg-pink-100',
        iconColor: 'text-pink-600',
        changeColor: 'text-pink-500',
    },
    {
        title: 'Senior',
        value: '256',
        change: '+5% from yesterday',
        icon: User,
        bgColor: 'bg-yellow-100',
        iconColor: 'text-yellow-600',
        changeColor: 'text-yellow-500',
    },
    {
        title: 'Referred',
        value: '455',
        change: '+1,2% from yesterday',
        icon: UserCheck,
        bgColor: 'bg-green-100',
        iconColor: 'text-green-600',
        changeColor: 'text-green-500',
    },
    {
        title: 'Veterans',
        value: '230',
        change: '0,5% from yesterday',
        icon: UsersRound,
        bgColor: 'bg-purple-100',
        iconColor: 'text-purple-600',
        changeColor: 'text-purple-500',
    },
];

const chartData = [
    { month: 'January', Cancel: 140, Active: 130 },
    { month: 'February', Cancel: 170, Active: 120 },
    { month: 'March', Cancel: 60, Active: 220 },
    { month: 'April', Cancel: 160, Active: 60 },
    { month: 'May', Cancel: 120, Active: 115 },
    { month: 'June', Cancel: 165, Active: 125 },
    { month: 'July', Cancel: 210, Active: 115 },
];

export default function Dashboard() {
    return (
        <div className="space-y-6">
            {/* Today's Overview Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Today's Overview</h2>
                        <p className="text-sm text-gray-500 mt-1">Summary</p>
                    </div>
                    <Button variant="outline" className="flex items-center gap-2 cursor-pointer">
                        <Download className="w-4 h-4" />
                        Export
                    </Button>
                </div>

                {/* Overview Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {overviewData.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <div
                                key={index}
                                className={`${item.bgColor} rounded-xl p-6 transition-all hover:shadow-md`}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`${item.iconColor} bg-white rounded-full p-3`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                </div>
                                <div className="mb-2">
                                    <h3 className="text-3xl font-bold text-gray-800">{item.value}</h3>
                                    <p className="text-sm font-medium text-gray-600 mt-1">{item.title}</p>
                                </div>
                                <p className={`text-xs font-medium ${item.changeColor}`}>
                                    {item.change}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* User Growth Chart Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">User Growth</h2>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                        data={chartData}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis
                            dataKey="month"
                            stroke="#6b7280"
                            style={{ fontSize: '12px' }}
                        />
                        <YAxis
                            stroke="#6b7280"
                            style={{ fontSize: '12px' }}
                            domain={[0, 250]}
                            ticks={[0, 50, 100, 150, 200, 250]}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#fff',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                            }}
                        />
                        <Legend
                            wrapperStyle={{ paddingTop: '20px' }}
                            iconType="circle"
                        />
                        <Bar
                            dataKey="Cancel"
                            fill="#3b82f6"
                            radius={[8, 8, 0, 0]}
                        />
                        <Bar
                            dataKey="Active"
                            fill="#10b981"
                            radius={[8, 8, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}