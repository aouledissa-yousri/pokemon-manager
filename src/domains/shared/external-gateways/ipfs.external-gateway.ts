import { HeadObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3"


interface _IpfsExternalGateway {
    readonly upload: (file: File, key: string) => Promise<string>
    readonly createKey: (keyParams: string[], extension: string) => string
}

const s3Client = new S3Client({
    endpoint: "https://s3.filebase.com",
    region: "us-east-1",
    forcePathStyle: true,
    credentials: {
        accessKeyId: process.env.FILEBASE_S3_KEY!,
        secretAccessKey: process.env.FILEBASE_S3_SECRET!,
    },
})

export const IpfsExternalGateway: _IpfsExternalGateway = Object.freeze({

    upload: async (file: File, key: string) => {

        const buffer = Buffer.from(await file.arrayBuffer())

        await s3Client.send(new PutObjectCommand({
            Bucket: process.env.FILEBASE_BUCKET!,
            Key: key,
            Body: buffer,
            ContentType: file.type,
        }))

        const head = await s3Client.send(new HeadObjectCommand({
            Bucket: process.env.FILEBASE_BUCKET!,
            Key: key,
        }))

        const cid = head.Metadata?.cid
        if (!cid) throw new Error("Filebase did not return a CID")

        return `${process.env.FILEBASE_IPFS_GATEWAY}/${cid}`
    },

    createKey: (keyParams: string[], extension: string) => `${keyParams.join("/")}.${extension}`,
})
