import dynamic from 'next/dynamic'

export const dynamic = 'force-dynamic'

const PreScreenWizard = dynamic(() => import('@/components/PreScreen/PreScreenWizard'), {
    ssr: false,
    loading: () => (
        <div className="min-h-[60vh] flex items-center justify-center text-gray-600">
            Loading...
        </div>
    ),
})

export default function ApplyPage() {
    return <PreScreenWizard mode="apply" />
}

