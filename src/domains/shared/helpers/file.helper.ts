interface _FileHelper {
    readonly getFileExtension: (file: File) => string
}

export const FileHelper: _FileHelper = Object.freeze({

    getFileExtension: (file: File) => {
        const fromName = file.name.includes(".") ? file.name.split(".").pop() : null
        return (fromName || file.type.split("/").pop() || "png").toLowerCase().replace(/[^a-z0-9]/g, "")
    },
})
