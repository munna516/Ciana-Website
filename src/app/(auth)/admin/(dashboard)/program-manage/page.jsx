"use client"

import React from 'react'
import { ArrowLeft, Plus, Pencil, Trash2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { getAllPrograms } from '@/lib/api'

export default function ProgramManage() {
    const router = useRouter()

    // Fetch programs using TanStack Query
    const { data: programsData, isLoading: loading, error, refetch } = useQuery({
        queryKey: ['programs'],
        queryFn: async () => {
            const data = await getAllPrograms()
            // Map API response to component format
            return data.map((program, index) => ({
                id: program.id,
                srNo: index + 1,
                programName: program.name,
                subHeading: program.short_description || '',
                programId: `#${program.id}`,
                // Keep original API data for reference
                originalData: program
            }))
        },
    })

    const programs = programsData || []

    const handleAddProgram = () => {
        router.push('/admin/program-manage/create-program')
    }

    const handleEdit = (id) => {
        router.push(`/admin/program-manage/create-program?id=${id}`)
    }

    const handleDelete = (id) => {
        // TODO: Implement delete functionality
        console.log('Delete program:', id)
    }

    return (
        <div className="w-full bg-white rounded-lg p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-2xl font-semibold">Program Manage</h1>
                </div>
                <div>
                    <Button
                        onClick={handleAddProgram}
                        className="bg-[#FFA100] hover:bg-[#FFA100]/90 text-white rounded-md px-4 py-2 flex items-center gap-2 cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        Add Program
                    </Button>
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-[#FFA100]" />
                    <span className="ml-2 text-gray-600">Loading programs...</span>
                </div>
            )}

            {/* Error State */}
            {error && !loading && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
                    <p>Error: {error.message || 'Failed to fetch programs'}</p>
                    <Button
                        onClick={() => refetch()}
                        variant="outline"
                        className="mt-2 cursor-pointer"
                        size="sm"
                    >
                        Retry
                    </Button>
                </div>
            )}

            {/* Table */}
            {!loading && (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-4 font-medium text-gray-700">SR-No</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-700">Program Name</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-700">Sub-Heading</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-700">Program ID</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-700">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {programs.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-8 text-gray-500">
                                        No programs found
                                    </td>
                                </tr>
                            ) : (
                                programs.map((program) => (
                                    <tr key={program.id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-4 px-4 text-gray-600">{program.srNo}</td>
                                        <td className="py-4 px-4 text-gray-800 font-medium">{program.programName}</td>
                                        <td className="py-4 px-4 text-gray-600">{program.subHeading}</td>
                                        <td className="py-4 px-4 text-gray-600">{program.programId}</td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleEdit(program.id)}
                                                    className="w-8 h-8 bg-blue-500 hover:bg-blue-600 text-white rounded flex items-center justify-center transition-colors cursor-pointer"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(program.id)}
                                                    className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded flex items-center justify-center transition-colors cursor-pointer"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
