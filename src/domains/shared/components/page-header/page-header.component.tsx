import { Box, Typography, useTheme } from "@mui/material"
import { motion } from "framer-motion"

import { DarkThemeConfig } from "@/src/global/configs/themes/dark.theme.config"
import { LightThemeConfig } from "@/src/global/configs/themes/light.theme.config"
import { GlobalConfig } from "@/src/global/configs/global.config"
import { PageHeaderComponentProps } from "./page-header.component.props"


export function PageHeaderComponent(props: PageHeaderComponentProps) {

    const theme = useTheme()
    const themeConfig = theme.palette.mode === "dark" ? DarkThemeConfig : LightThemeConfig

    const headerBody = (
        <Box sx={{ maxWidth: 1200, mx: "auto" }}>

            {props.backAction &&
                <Box sx={{ mb: 1.5 }}>
                    {props.backAction}
                </Box>
            }

            <Box sx={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
                <Box>
                    <Typography
                        sx={{
                            fontSize: 11,
                            fontWeight: GlobalConfig.fontWeights.bold,
                            letterSpacing: "0.18em",
                            textTransform: "uppercase",
                            color: themeConfig.accentColor,
                            mb: 0.5,
                        }}
                    >
                        {props.label}
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: 34,
                            fontWeight: GlobalConfig.fontWeights.bold,
                            lineHeight: 1.15,
                        }}
                    >
                        {props.title}
                    </Typography>

                    {props.subtitle &&
                        <Typography sx={{ mt: 0.75, fontSize: 14, color: "text.secondary" }}>
                            {props.subtitle}
                        </Typography>
                    }
                </Box>

                {props.action}
            </Box>
        </Box>
    )

    return (
        <>
            <Box
                component={motion.div}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                sx={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 10,
                    p: "10px",
                    backgroundColor: themeConfig.surfaceColor,
                    backdropFilter: themeConfig.blur,
                    borderBottom: `1px solid ${themeConfig.cardBorderColor}`,
                }}
            >
                {headerBody}
            </Box>

            {/* Invisible spacer — reserves the fixed header's true (responsive) height in normal flow */}
            <Box aria-hidden inert sx={{ visibility: "hidden", p: "10px", mb: 5 }}>
                {headerBody}
            </Box>
        </>
    )
}
