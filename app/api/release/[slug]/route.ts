import { findDemoRelease } from "@/lib/demo-releases"

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const release = findDemoRelease(slug)

    if (!release) return Response.json({ error: "Not found" }, { status: 404 })

    release.views += 1

    return Response.json(release)
}