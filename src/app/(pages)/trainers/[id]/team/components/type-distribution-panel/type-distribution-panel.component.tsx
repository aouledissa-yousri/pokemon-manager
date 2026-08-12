import { Typography, useTheme } from "@mui/material"

import { TypeColorsConfig, FALLBACK_TYPE_COLOR } from "@/src/domains/pokedex/type/configs/type-colors.config"
import { GlassCardComponent } from "@/src/domains/shared/components/glass-card/glass-card.component"
import { DonutChartComponent } from "@/src/domains/shared/components/donut-chart/donut-chart.component"
import { DarkThemeConfig } from "@/src/global/configs/themes/dark.theme.config"
import { LightThemeConfig } from "@/src/global/configs/themes/light.theme.config"
import { GlobalConfig } from "@/src/global/configs/global.config"
import { TypeDistributionPanelComponentProps } from "./type-distribution-panel.component.props"


export function TypeDistributionPanelComponent(props: TypeDistributionPanelComponentProps) {

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
                Type Distribution
            </Typography>

            <DonutChartComponent
                segments={props.segments.map(segment => ({
                    label: segment.type,
                    value: segment.count,
                    percentage: segment.percentage,
                    color: TypeColorsConfig[segment.type] ?? FALLBACK_TYPE_COLOR,
                }))}
                centerValue={`${props.segments.length}`}
                centerLabel={props.segments.length === 1 ? "Type" : "Types"}
                emptyMessage="Select Pokemon to see their type spread"
            />
        </GlassCardComponent>
    )
}
