import { SxProps, Theme } from "@mui/material"


export interface GlassCardComponentProps {
    readonly children: React.ReactNode
    readonly sx?: SxProps<Theme>
    readonly onClick?: () => void
    readonly hoverLift?: boolean
}
