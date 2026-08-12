import { Box, Typography, useTheme } from "@mui/material"
import CheckRoundedIcon from "@mui/icons-material/CheckRounded"
import CloseRoundedIcon from "@mui/icons-material/CloseRounded"

import { TypeColorsConfig, FALLBACK_TYPE_COLOR } from "@/src/domains/pokedex/type/configs/type-colors.config"
import { TypeBadgeComponent } from "@/src/domains/pokedex/shared/components/type-badge/type-badge.component"
import { GlassCardComponent } from "@/src/domains/shared/components/glass-card/glass-card.component"
import { DonutChartComponent } from "@/src/domains/shared/components/donut-chart/donut-chart.component"
import { DarkThemeConfig } from "@/src/global/configs/themes/dark.theme.config"
import { LightThemeConfig } from "@/src/global/configs/themes/light.theme.config"
import { GlobalConfig } from "@/src/global/configs/global.config"
import { TypeCoveragePanelComponentProps } from "./type-coverage-panel.component.props"


export function TypeCoveragePanelComponent(props: TypeCoveragePanelComponentProps) {

    const theme = useTheme()
    const themeConfig = theme.palette.mode === "dark" ? DarkThemeConfig : LightThemeConfig

    const coveredCount = props.checklist.filter(entry => entry.isCovered).length

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
                Type Coverage
            </Typography>

            <DonutChartComponent
                segments={props.moveTypeSegments.map(segment => ({
                    label: segment.type,
                    value: segment.count,
                    percentage: segment.percentage,
                    color: TypeColorsConfig[segment.type] ?? FALLBACK_TYPE_COLOR,
                }))}
                centerValue={`${coveredCount}/${props.checklist.length}`}
                centerLabel="Types Hit"
                emptyMessage="No damaging moves assigned yet"
            />

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                    gap: 1,
                    pt: 1,
                    borderTop: `1px solid ${themeConfig.cardBorderColor}`,
                }}
            >
                {props.checklist.map(entry => (
                    <Box key={entry.type} sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                        {entry.isCovered ?
                            <CheckRoundedIcon sx={{ fontSize: 16, color: GlobalConfig.statColors.calculated }} />
                            :
                            <CloseRoundedIcon sx={{ fontSize: 16, color: theme.palette.error.main }} />
                        }
                        <TypeBadgeComponent type={entry.type} />
                    </Box>
                ))}
            </Box>
        </GlassCardComponent>
    )
}
