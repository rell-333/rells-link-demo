"use client"
import { Icon } from "@iconify/react"
import { Button } from "@heroui/react"
import { Archivo_Black } from "next/font/google"

const ArchivoBlack = Archivo_Black({ weight: "400" })

interface NavItem {
    name: string
    icon: string
    view: string
}

interface NavSection {
    label: string
    items: NavItem[]
}

const NAV_SECTIONS: NavSection[] = [
    {
        label: "WORKSPACE",
        items: [
            { name: "Releases", icon: "lucide:link", view: "releases" },
        ]
    },
]

type Props = {
    activeView: string
    onNavigate: (view: string) => void
    releaseCount?: number
}

export default function Sidebar({ activeView, onNavigate, releaseCount = 0 }: Props) {
    // badge values per nav view — add an entry here when a nav item needs a count
    const badges: Record<string, number> = {
        releases: releaseCount,
    }

    return (
        <aside className="flex flex-col h-screen w-70 bg-white border-r border-zinc-100 px-5 py-8 shrink-0">

            <div className="flex items-center gap-3 px-2 mb-8">
                <div className="w-10 h-10 rounded-lg bg-green-900 flex items-center justify-center">
                    <Icon icon="lucide:disc-3" className="text-white text-xl" />
                </div>
                <div>
                    <p className={`${ArchivoBlack.className} text-lg leading-none`}>rell</p>
                    <p className="text-[10px] text-zinc-400 uppercase tracking-wider">Links Demo Console</p>
                </div>
            </div>

            <nav className="flex flex-col gap-6 flex-1">
                {NAV_SECTIONS.map(section => (
                    <div key={section.label}>
                        <p className="text-[10px] text-zinc-400 uppercase tracking-widest px-2 mb-1">
                            {section.label}
                        </p>
                        <ul className="flex flex-col gap-2">
                            {section.items.map(item => {
                                const isActive = activeView === item.view
                                const badge = badges[item.view]
                                return (
                                    <li key={item.view}>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className={`w-full justify-between ${
                                                isActive ? "bg-blue-50 text-blue-600" : "text-zinc-600"
                                            }`}
                                            onClick={() => onNavigate(item.view)}
                                        >
                                            <span className="flex items-center gap-2">
                                                <Icon icon={item.icon} className="text-base"/>
                                                {item.name}
                                            </span>
                                            {badge !== undefined && (
                                                <span className="text-xs bg-blue-100 text-blue-600 rounded-full px-2 py-0.5 font-medium">
                                                    {badge}
                                                </span>
                                            )}
                                        </Button>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                ))}
            </nav>
        </aside>
    )
}