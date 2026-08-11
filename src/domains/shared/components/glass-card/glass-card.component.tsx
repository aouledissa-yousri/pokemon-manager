import { Box, useTheme } from "@mui/material"
import { motion } from "framer-motion"

import { DarkThemeConfig } from "@/src/global/configs/themes/dark.theme.config"
import { LightThemeConfig } from "@/src/global/configs/themes/light.theme.config"
import { GlassCardComponentProps } from "./glass-card.component.props"


export function GlassCardComponent(props: GlassCardComponentProps) {

    const theme = useTheme()
    const isDark = theme.palette.mode === "dark"
    const themeConfig = isDark ? DarkThemeConfig : LightThemeConfig

    return (
        <Box
            component={motion.div}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            onClick={props.onClick}
            sx={[
                {
                    backgroundColor: themeConfig.surfaceColor,
                    backdropFilter: themeConfig.blur,
                    border: `1px solid ${themeConfig.cardBorderColor}`,
                    borderRadius: "16px",
                    transition: "border-color 0.2s, box-shadow 0.2s, transform 0.2s",
                    cursor: props.onClick ? "pointer" : "default",

                    "&:hover": props.hoverLift ? {
                        borderColor: themeConfig.accentColor,
                        boxShadow: themeConfig.accentGlow,
                        transform: "translateY(-4px)",
                    } : undefined,
                },
                ...(Array.isArray(props.sx) ? props.sx : [props.sx]),
            ]}
        >
            {props.children}
        </Box>
    )
}
