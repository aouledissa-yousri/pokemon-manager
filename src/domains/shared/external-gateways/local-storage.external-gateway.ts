import fs from "fs"
import path from "path"


interface _LocalStorageExternalGateway {
    readonly upload: (file: File, key: string) => Promise<string>
    readonly delete: (publicUrl: string) => void
    readonly createKey: (keyParams: string[], extension: string) => string
}

const UPLOADS_DIR = path.join(process.cwd(), "data", "uploads")
const PUBLIC_PREFIX = "/api/uploads"

export const LocalStorageExternalGateway: _LocalStorageExternalGateway = Object.freeze({

    upload: async (file: File, key: string) => {

        const filePath = path.join(UPLOADS_DIR, key)
        fs.mkdirSync(path.dirname(filePath), { recursive: true })

        const buffer = Buffer.from(await file.arrayBuffer())
        fs.writeFileSync(filePath, buffer)

        return `${PUBLIC_PREFIX}/${key}`
    },

    delete: (publicUrl: string) => {

        if (!publicUrl.startsWith(`${PUBLIC_PREFIX}/`)) return

        const key = publicUrl.slice(PUBLIC_PREFIX.length + 1)
        const filePath = path.resolve(UPLOADS_DIR, key)

        if (!filePath.startsWith(UPLOADS_DIR + path.sep)) return
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
    },

    createKey: (keyParams: string[], extension: string) => `${keyParams.join("/")}.${extension}`,
})
