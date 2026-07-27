"use client"
import { useState, useEffect } from "react"
import ReleasesPage from "@/components/pages/ReleasesPage"
import Sidebar from "@/components/functional/Sidebar";

export default function Admin() {
    const [activeView, setActiveView] = useState("dashboard")
    const [releaseCount, setReleaseCount] = useState(0)

    useEffect(() => {
        fetch("/api/releases")
            .then(res => res.json())
            .then(data => setReleaseCount(data.length))
    }, [])

    return (
        <div className="flex h-screen">
            <Sidebar activeView={activeView} onNavigate={setActiveView} releaseCount={releaseCount} />
            <main className="flex-1 overflow-auto bg-zinc-50 p-8">
                {activeView === "releases" && <ReleasesPage />}
            </main>
        </div>
    )
}