'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useEditorStore } from '@/lib/store'
import EditorShell from '@/components/EditorShell'
import DashboardView from '@/components/views/DashboardView'
import OverviewView from '@/components/views/OverviewView'
import PlayersView from '@/components/views/PlayersView'
import ItemsView from '@/components/views/ItemsView'
import TruckView from '@/components/views/TruckView'

export default function EditorPage() {
  const router = useRouter()
  const { jsonData, currentView } = useEditorStore()

  useEffect(() => {
    if (!jsonData) router.replace('/')
  }, [jsonData, router])

  if (!jsonData) return null

  const VIEW = {
    dashboard: <DashboardView />,
    overview:  <OverviewView />,
    players:   <PlayersView />,
    items:     <ItemsView />,
    truck:     <TruckView />,
  }

  return (
    <EditorShell>
      {VIEW[currentView]}
    </EditorShell>
  )
}
