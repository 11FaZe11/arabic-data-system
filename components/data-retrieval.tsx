import { Suspense } from "react"
import { SearchPanel } from "@/components/search-panel"
import { DataDisplay } from "@/components/data-display"
import { LoadingSpinner } from "@/components/loading-spinner"

export function DataRetrieval() {
  return (
    <div className="space-y-6">
      <SearchPanel />

      <Suspense fallback={<LoadingSpinner />}>
        <DataDisplay />
      </Suspense>
    </div>
  )
}
