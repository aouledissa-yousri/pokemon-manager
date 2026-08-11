import { Box, Typography, useTheme } from "@mui/material"
import { motion } from "framer-motion"

import { DarkThemeConfig } from "@/src/global/configs/themes/dark.theme.config"
import { LightThemeConfig } from "@/src/global/configs/themes/light.theme.config"
import { GlobalConfig } from "@/src/global/configs/global.config"
import { PageHeaderComponentProps } from "./page-header.component.props"


export function PageHeaderComponent(props: PageHeaderComponentProps) {

    const theme = useTheme()
    const themeConfig = theme.palette.mode === "dark" ? DarkThemeConfig : LightThemeConfig

    return (
        <Box
            component={motion.div}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            sx={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 2,
                mb: 5,
            }}
        >
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
    )
}
