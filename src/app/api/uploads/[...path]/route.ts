import fs from "fs"
import path from "path"


const CONTENT_TYPES: Record<string, string> = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".gif": "image/gif",
    ".avif": "image/avif",
}

const UPLOADS_DIR = path.join(process.cwd(), "data", "uploads")


export async function GET(_request: Request, { params }: { params: Promise<{ path: string[] }> }) {

    const { path: segments } = await params

    const filePath = path.resolve(UPLOADS_DIR, ...segments)
    if (!filePath.startsWith(UPLOADS_DIR + path.sep)) return new Response("Not found", { status: 404 })
    if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) return new Response("Not found", { status: 404 })

    const body = new Uint8Array(fs.readFileSync(filePath))

    return new Response(body, {
        headers: {
            "Content-Type": CONTENT_TYPES[path.extname(filePath).toLowerCase()] ?? "application/octet-stream",
            "Cache-Control": "public, max-age=31536000, immutable",
        },
    })
}
