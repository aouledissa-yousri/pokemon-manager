import { Box, Typography, useTheme } from "@mui/material"
import SportsMmaRoundedIcon from "@mui/icons-material/SportsMmaRounded"
import FlareRoundedIcon from "@mui/icons-material/FlareRounded"
import TrackChangesRoundedIcon from "@mui/icons-material/TrackChangesRounded"

import { MoveDamageClassConfig } from "@/src/domains/pokedex/move/configs/move-damage-class.config"
import { GlassCardComponent } from "@/src/domains/shared/components/glass-card/glass-card.component"
import { DarkThemeConfig } from "@/src/global/configs/themes/dark.theme.config"
import { LightThemeConfig } from "@/src/global/configs/themes/light.theme.config"
import { GlobalConfig } from "@/src/global/configs/global.config"
import { MoveDistributionPanelComponentProps } from "./move-distribution-panel.component.props"


export function MoveDistributionPanelComponent(props: MoveDistributionPanelComponentProps) {

    const theme = useTheme()
    const themeConfig = theme.palette.mode === "dark" ? DarkThemeConfig : LightThemeConfig

    const total = props.distribution.physical + props.distribution.special + props.distribution.status

    const rows = [
        { key: "physical", icon: <SportsMmaRoundedIcon />, count: props.distribution.physical },
        { key: "special", icon: <FlareRoundedIcon />, count: props.distribution.special },
        { key: "status", icon: <TrackChangesRoundedIcon />, count: props.distribution.status },
    ] as const

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
                Move Distribution
            </Typography>

            {total === 0 ?
                <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                    No moves assigned yet — select Pokemon to see this update.
                </Typography>
                :
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                    {rows.map(row => {

                        const style = MoveDamageClassConfig[row.key]
                        const percentage = total > 0 ? (row.count / total) * 100 : 0

                        return (
                            <Box key={row.key} sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <Box sx={{ display: "flex", color: style.color, "& svg": { fontSize: 18 } }}>
                                        {row.icon}
                                    </Box>

                                    <Typography sx={{ fontSize: 13, flex: 1 }}>
                                        {style.label}
                                    </Typography>

                                    <Typography sx={{ fontSize: 14, fontWeight: GlobalConfig.fontWeights.bold }}>
                                        {row.count}
                                    </Typography>
                                </Box>

                                <Box sx={{ height: 6, borderRadius: "3px", backgroundColor: `${style.color}1A`, overflow: "hidden" }}>
                                    <Box sx={{ height: "100%", width: `${percentage}%`, borderRadius: "3px", backgroundColor: style.color }} />
                                </Box>
                            </Box>
                        )
                    })}
                </Box>
            }
        </GlassCardComponent>
    )
}
