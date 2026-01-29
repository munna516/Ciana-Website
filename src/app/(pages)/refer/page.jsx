'use client'

export const dynamic = 'force-dynamic'
export const revalidate = 0

import PreScreenWizard from '@/components/PreScreen/PreScreenWizard'

export default function ReferPage() {
  return <PreScreenWizard mode="refer" />
}

