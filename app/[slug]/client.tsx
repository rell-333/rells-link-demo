"use client"

import React, { use, useEffect, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSoundcloud, faSpotify } from "@fortawesome/free-brands-svg-icons"
import { SiApplemusic, SiYoutubemusic } from "react-icons/si"

interface Release {
    id: string
    title: string
    artist: string
    artwork: string
    identifier: string
    spotifyLink: string | null
    appleLink: string | null
    soundcloudLink: string | null
    youtubeLink: string | null
}

// one entry per DSP — adding a platform means adding a line here,
// not another copy of the button markup
const PLATFORMS = [
    {
        key: "spotifyLink",
        name: "Spotify",
        icon: <FontAwesomeIcon icon={faSpotify} className="text-[#1DB954]" style={{ width: 22, height: 22 }} />,
    },
    {
        key: "appleLink",
        name: "Apple Music",
        icon: <SiApplemusic size={22} className="text-[#fc3c44]" />,
    },
    {
        key: "soundcloudLink",
        name: "SoundCloud",
        icon: <FontAwesomeIcon icon={faSoundcloud} className="text-[#ff5500]" style={{ width: 22, height: 22 }} />,
    },
    {
        key: "youtubeLink",
        name: "YouTube Music",
        icon: <SiYoutubemusic size={22} className="text-[#ff0000]" />,
    },
] as const

export default function ReleasePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params)
    const [release, setRelease] = useState<Release | null>(null)
    const [notFound, setNotFound] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch(`/api/release/${slug}`)
            .then(res => {
                if (!res.ok) {
                    setNotFound(true)
                    return null
                }
                return res.json()
            })
            .then(data => {
                if (data) setRelease(data)
                setLoading(false)
            })
    }, [slug])

    if (loading) return null

    if (notFound || !release) {
        return (
            <div className="h-screen w-full bg-black flex flex-col items-center justify-center px-6 text-center">
                <h1 className="text-white text-3xl font-semibold mb-2">Link not found</h1>
                <p className="text-white/50 text-sm max-w-xs">
                    This release link doesn&apos;t exist. Double check the URL and try again.
                </p>
            </div>
        )
    }

    const links = PLATFORMS.filter(p => release[p.key])

    const gridClass = links.length === 1
        ? "flex justify-center w-full max-w-xs"
        : "grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-xs md:max-w-lg"

    return (
        <div className="h-screen overflow-hidden bg-black flex flex-col">

            <div className="fixed inset-0 z-0">
                <img
                    src={release.artwork}
                    className="w-full h-full object-cover scale-110"
                    alt=""
                    aria-hidden
                />
                <div className="absolute inset-0 bg-black/60 backdrop-blur-3xl"/>
            </div>

            <main className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 py-8">

                <div className="w-70 h-70 md:w-110 md:h-110 rounded-3xl overflow-hidden shadow-2xl mb-8">
                    <img
                        src={release.artwork}
                        alt={`${release.artist} - ${release.title}`}
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="text-center mb-10">
                    <p className="text-white/60 text-sm uppercase tracking-widest mb-1">{release.artist}</p>
                    <h1 className="text-white text-4xl md:text-5xl font-semibold tracking-tight">{release.title}</h1>
                    <p className="text-white/40 text-xs uppercase tracking-widest mt-2">{release.identifier}</p>
                </div>

                <div className={gridClass}>
                    {links.map(platform => (
                        <a
                            key={platform.key}
                            href={release[platform.key]!}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-2xl px-5 py-4 transition-all duration-200 w-full"
                        >
                            {platform.icon}
                            <span className="text-md font-bold">Listen on {platform.name}</span>
                        </a>
                    ))}
                </div>
            </main>

        </div>
    )
}