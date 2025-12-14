import { Suspense } from "react"
import { DataRetrieval } from "@/components/data-retrieval"
import { Header } from "@/components/header"
import { StatsBar } from "@/components/stats-bar"
import { LoadingSpinner } from "@/components/loading-spinner"

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      {/* Animated background effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10">
        <Header />

        <main className="container mx-auto px-4 py-6 md:py-8">
          <Suspense fallback={<LoadingSpinner />}>
            <StatsBar />
          </Suspense>

          <Suspense fallback={<LoadingSpinner />}>
            <DataRetrieval />
          </Suspense>
        </main>
      </div>
    </div>
  )
}
