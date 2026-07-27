import { demoReleases, addDemoRelease, updateDemoRelease, deleteDemoRelease } from "@/lib/demo-releases"

export async function GET() {
    return Response.json(demoReleases)
}

export async function POST(req: Request) {
    const body = await req.json()

    const result = addDemoRelease(body)
    if ("error" in result) {
        return Response.json({ error: result.error }, { status: 400 })
    }

    return Response.json(result)
}

export async function PATCH(req: Request) {
    const body = await req.json()

    const result = updateDemoRelease(body)
    if ("error" in result) {
        return Response.json({ error: result.error }, { status: 404 })
    }

    return Response.json(result)
}

export async function DELETE(req: Request) {
    const { id } = await req.json()

    const result = deleteDemoRelease(id)
    if ("error" in result) {
        return Response.json({ error: result.error }, { status: 404 })
    }

    return Response.json(result)
}