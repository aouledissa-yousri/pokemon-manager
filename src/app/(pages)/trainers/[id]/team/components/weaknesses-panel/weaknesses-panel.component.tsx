import { Box, Chip, Typography, useTheme } from "@mui/material"

import { TypeBadgeComponent } from "@/src/domains/pokedex/shared/components/type-badge/type-badge.component"
import { GlassCardComponent } from "@/src/domains/shared/components/glass-card/glass-card.component"
import { DarkThemeConfig } from "@/src/global/configs/themes/dark.theme.config"
import { LightThemeConfig } from "@/src/global/configs/themes/light.theme.config"
import { GlobalConfig } from "@/src/global/configs/global.config"
import { WeaknessesPanelComponentProps } from "./weaknesses-panel.component.props"


export function WeaknessesPanelComponent(props: WeaknessesPanelComponentProps) {

    const theme = useTheme()
    const themeConfig = theme.palette.mode === "dark" ? DarkThemeConfig : LightThemeConfig

    return (
        <GlassCardComponent sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2.5 }}>

            <Typography
                sx={{
                    fontSize: 11,
                    fontWeight: GlobalConfig.fontWeights.bold,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: themeConfig.accentColor,
                }}
            >
                Weaknesses
            </Typography>

            {props.weaknesses.length === 0 ?
                <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                    No shared weaknesses — select Pokemon to see this update.
                </Typography>
                :
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {props.weaknesses.map(weakness => (
                        <Box
                            key={weakness.type}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                                p: 0.5,
                                pr: 1,
                                borderRadius: "8px",
                                border: `1px solid ${themeConfig.cardBorderColor}`,
                            }}
                        >
                            <TypeBadgeComponent type={weakness.type} size="medium" />

                            <Chip
                                label={`×${weakness.affectedCount}`}
                                size="small"
                                sx={{
                                    height: 18,
                                    fontSize: 10,
                                    fontWeight: GlobalConfig.fontWeights.bold,
                                    color: theme.palette.error.main,
                                    backgroundColor: `${theme.palette.error.main}1A`,
                                }}
                            />
                        </Box>
                    ))}
                </Box>
            }
        </GlassCardComponent>
    )
}
