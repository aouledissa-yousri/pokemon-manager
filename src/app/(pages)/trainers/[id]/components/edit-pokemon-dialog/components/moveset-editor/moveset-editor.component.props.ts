export interface MovesetEditorComponentProps {
    readonly moves: readonly (string | null)[]
    readonly onChangeSlot: (slotIndex: number, move: string | null) => void
}
