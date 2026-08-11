export interface ConfirmDialogComponentProps {
    readonly open: boolean
    readonly title: string
    readonly message: string
    readonly confirmText?: string
    readonly cancelText?: string
    readonly isDestructive?: boolean
    readonly onConfirm: () => void
    readonly onClose: () => void
}
