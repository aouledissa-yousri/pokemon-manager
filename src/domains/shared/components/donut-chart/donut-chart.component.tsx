import { Box, Stack, Typography, useTheme } from "@mui/material"

import { DarkThemeConfig } from "@/src/global/configs/themes/dark.theme.config"
import { LightThemeConfig } from "@/src/global/configs/themes/light.theme.config"
import { GlobalConfig } from "@/src/global/configs/global.config"
import { DonutChartComponentProps } from "./donut-chart.component.props"


const SIZE = 120
const CENTER = SIZE / 2
const RADIUS = 45
const STROKE_WIDTH = 14
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
const GAP_LENGTH = 2.5


export function DonutChartComponent(props: DonutChartComponentProps) {

    const theme = useTheme()
    const themeConfig = theme.palette.mode === "dark" ? DarkThemeConfig : LightThemeConfig

    const hasData = props.segments.length > 0

    let cumulativePercentage = 0

    return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>

            <Box sx={{ position: "relative", width: SIZE, height: SIZE }}>
                <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
                    <g transform={`rotate(-90 ${CENTER} ${CENTER})`}>

                        <circle
                            cx={CENTER}
                            cy={CENTER}
                            r={RADIUS}
                            fill="none"
                            stroke={themeConfig.cardBorderColor}
                            strokeWidth={STROKE_WIDTH}
                        />

                        {hasData && props.segments.map(segment => {

                            const segmentLength = (segment.percentage / 100) * CIRCUMFERENCE
                            const arcLength = Math.max(segmentLength - (props.segments.length > 1 ? GAP_LENGTH : 0), 0)
                            const dashOffset = -((cumulativePercentage / 100) * CIRCUMFERENCE)

                            cumulativePercentage += segment.percentage

                            return (
                                <circle
                                    key={segment.label}
                                    cx={CENTER}
                                    cy={CENTER}
                                    r={RADIUS}
                                    fill="none"
                                    stroke={segment.color}
                                    strokeWidth={STROKE_WIDTH}
                                    strokeDasharray={`${arcLength} ${CIRCUMFERENCE - arcLength}`}
                                    strokeDashoffset={dashOffset}
                                    strokeLinecap="butt"
                                />
                            )
                        })}
                    </g>
                </svg>

                <Box
                    sx={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        px: 1.5,
                    }}
                >
                    {props.centerValue &&
                        <Typography sx={{ fontSize: 20, fontWeight: GlobalConfig.fontWeights.bold, lineHeight: 1.1 }}>
                            {props.centerValue}
                        </Typography>
                    }

                    {props.centerLabel &&
                        <Typography
                            sx={{
                                fontSize: 9,
                                fontWeight: GlobalConfig.fontWeights.bold,
                                letterSpacing: "0.08em",
                                textTransform: "uppercase",
                                color: "text.secondary",
                            }}
                        >
                            {props.centerLabel}
                        </Typography>
                    }
                </Box>
            </Box>

            {hasData ?
                <Stack spacing={0.75} sx={{ width: "100%" }}>
                    {props.segments.map(segment => (
                        <Box key={segment.label} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Box sx={{ width: 8, height: 8, borderRadius: "50%", flexShrink: 0, backgroundColor: segment.color }} />

                            <Typography noWrap sx={{ fontSize: 12, flex: 1, minWidth: 0, textTransform: "capitalize" }}>
                                {segment.label}
                            </Typography>

                            <Typography sx={{ fontSize: 12, fontWeight: GlobalConfig.fontWeights.bold, color: "text.secondary" }}>
                                {Math.round(segment.percentage)}%
                            </Typography>
                        </Box>
                    ))}
                </Stack>
                :
                <Typography sx={{ fontSize: 12, color: "text.secondary", textAlign: "center" }}>
                    {props.emptyMessage ?? "No data yet"}
                </Typography>
            }
        </Box>
    )
}
