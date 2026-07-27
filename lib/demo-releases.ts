// seed data + in-memory CRUD for the demo — stands in for prisma.release.
// mutations only live as long as the server process; restarts reset everything.

export interface DemoRelease {
    id: string
    linkName: string
    isPublic: boolean
    title: string
    artist: string
    artwork: string
    identifier: string
    views: number
    spotifyLink?: string
    appleLink?: string
    soundcloudLink?: string
    youtubeLink?: string
}

export const demoReleases: DemoRelease[] = [
    {
        id: "demo-1",
        linkName: "nightdrive",
        isPublic: true,
        title: "Nightdrive",
        artist: "Wildflower",
        artwork: "https://picsum.photos/seed/nightdrive/800/800",
        identifier: "WLDFLWR001",
        views: 1284,
        spotifyLink: "https://open.spotify.com",
        appleLink: "https://music.apple.com",
        youtubeLink: "https://music.youtube.com",
    },
    {
        id: "demo-2",
        linkName: "glasshouse",
        isPublic: true,
        title: "Glasshouse",
        artist: "Wildflower",
        artwork: "https://picsum.photos/seed/glasshouse/800/800",
        identifier: "WLDFLWR002",
        views: 3021,
        spotifyLink: "https://open.spotify.com",
        appleLink: "https://music.apple.com",
        soundcloudLink: "https://soundcloud.com",
    },
    {
        id: "demo-3",
        linkName: "static",
        isPublic: true,
        title: "Static",
        artist: "Kites & Lanterns",
        artwork: "https://picsum.photos/seed/static/800/800",
        identifier: "KTLNT001",
        views: 542,
        spotifyLink: "https://open.spotify.com",
        appleLink: "https://music.apple.com",
    },
]

// treat empty strings from form inputs as "no link"
const linkOrUndefined = (value?: string) => value || undefined

function identifierTaken(identifier: string, excludeId?: string) {
    return demoReleases.some((r) => r.identifier === identifier && r.id !== excludeId)
}

export function findDemoRelease(linkName: string) {
    return demoReleases.find((r) => r.linkName === linkName && r.isPublic)
}

export interface NewDemoReleaseInput {
    title: string
    artist: string
    identifier: string
    linkName: string
    releaseDate: string
    artwork: string
    spotifyLink?: string
    appleLink?: string
    soundcloudLink?: string
    youtubeLink?: string
    isPublic: boolean
}

export function addDemoRelease(input: NewDemoReleaseInput) {
    if (identifierTaken(input.identifier)) {
        return { error: "That identifier is already in use" }
    }

    const release: DemoRelease = {
        id: crypto.randomUUID(),
        linkName: input.linkName,
        isPublic: input.isPublic,
        title: input.title,
        artist: input.artist,
        artwork: input.artwork,
        identifier: input.identifier,
        views: 0,
        spotifyLink: linkOrUndefined(input.spotifyLink),
        appleLink: linkOrUndefined(input.appleLink),
        soundcloudLink: linkOrUndefined(input.soundcloudLink),
        youtubeLink: linkOrUndefined(input.youtubeLink),
    }

    demoReleases.push(release)
    return release
}

export interface UpdateDemoReleaseInput {
    id: string
    title?: string
    artist?: string
    identifier?: string
    linkName?: string
    spotifyLink?: string
    appleLink?: string
    soundcloudLink?: string
    youtubeLink?: string
    isPublic?: boolean
}

export function updateDemoRelease(input: UpdateDemoReleaseInput) {
    const release = demoReleases.find((r) => r.id === input.id)
    if (!release) return { error: "Release not found" }

    if (input.identifier && identifierTaken(input.identifier, input.id)) {
        return { error: "That identifier is already in use" }
    }

    Object.assign(release, {
        title: input.title ?? release.title,
        artist: input.artist ?? release.artist,
        identifier: input.identifier ?? release.identifier,
        linkName: input.linkName ?? release.linkName,
        spotifyLink: input.spotifyLink === undefined ? release.spotifyLink : linkOrUndefined(input.spotifyLink),
        appleLink: input.appleLink === undefined ? release.appleLink : linkOrUndefined(input.appleLink),
        soundcloudLink: input.soundcloudLink === undefined ? release.soundcloudLink : linkOrUndefined(input.soundcloudLink),
        youtubeLink: input.youtubeLink === undefined ? release.youtubeLink : linkOrUndefined(input.youtubeLink),
        isPublic: input.isPublic ?? release.isPublic,
    })

    return release
}

export function deleteDemoRelease(id: string) {
    const index = demoReleases.findIndex((r) => r.id === id)
    if (index === -1) return { error: "Release not found" }
    demoReleases.splice(index, 1)
    return { success: true }
}