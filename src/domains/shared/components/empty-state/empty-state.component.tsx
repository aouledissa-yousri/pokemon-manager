import { Box, Typography, useTheme } from "@mui/material"

import { DarkThemeConfig } from "@/src/global/configs/themes/dark.theme.config"
import { LightThemeConfig } from "@/src/global/configs/themes/light.theme.config"
import { GlobalConfig } from "@/src/global/configs/global.config"
import { GlassCardComponent } from "../glass-card/glass-card.component"
import { EmptyStateComponentProps } from "./empty-state.component.props"


export function EmptyStateComponent(props: EmptyStateComponentProps) {

    const theme = useTheme()
    const themeConfig = theme.palette.mode === "dark" ? DarkThemeConfig : LightThemeConfig

    return (
        <GlassCardComponent
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: 1.5,
                py: 10,
                px: 4,
            }}
        >
            {props.icon &&
                <Box sx={{ color: themeConfig.accentColor, opacity: 0.85, "& svg": { fontSize: 56 } }}>
                    {props.icon}
                </Box>
            }

            <Typography sx={{ fontSize: 20, fontWeight: GlobalConfig.fontWeights.bold }}>
                {props.title}
            </Typography>

            {props.subtitle &&
                <Typography sx={{ fontSize: 14, color: "text.secondary", maxWidth: 420 }}>
                    {props.subtitle}
                </Typography>
            }

            {props.action &&
                <Box sx={{ mt: 2 }}>
                    {props.action}
                </Box>
            }
        </GlassCardComponent>
    )
}
