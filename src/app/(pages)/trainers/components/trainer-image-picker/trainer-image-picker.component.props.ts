export interface TrainerImagePickerComponentProps {
    readonly previewUrl: string | null
    readonly fallbackLetter: string
    readonly onSelect: (file: File) => void
}
