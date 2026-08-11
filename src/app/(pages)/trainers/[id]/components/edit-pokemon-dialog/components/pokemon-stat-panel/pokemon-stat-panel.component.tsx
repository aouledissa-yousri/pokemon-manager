import { Box, Chip, Skeleton, Typography, useTheme } from "@mui/material"

import { StatCalculatorHelper } from "@/src/domains/pokemon-management/pokemon/helpers/stat-calculator.helper"
import { StatEnum } from "@/src/domains/pokemon-management/pokemon/enums/stat.enum"
import { STAT_ORDER } from "@/src/domains/pokemon-management/pokemon/configs/stat-labels.config"
import { NatureModifiersConfig } from "@/src/domains/pokedex/nature/configs/nature-modifiers.config"
import { DarkThemeConfig } from "@/src/global/configs/themes/dark.theme.config"
import { LightThemeConfig } from "@/src/global/configs/themes/light.theme.config"
import { GlobalConfig } from "@/src/global/configs/global.config"
import { StatRowComponent } from "./components/stat-row/stat-row.component"
import { PokemonStatPanelComponentProps } from "./pokemon-stat-panel.component.props"


export function PokemonStatPanelComponent(props: PokemonStatPanelComponentProps) {

    const theme = useTheme()
    const themeConfig = theme.palette.mode === "dark" ? DarkThemeConfig : LightThemeConfig

    const natureModifier = NatureModifiersConfig[props.nature]

    const calculatedStats = props.baseStats
        ? StatCalculatorHelper.calculateAllStats(props.baseStats, props.ivs, props.evs, props.level, props.nature)
        : null

    const baseStatTotal = props.baseStats ? StatCalculatorHelper.getBaseStatTotal(props.baseStats) : null

    const evTotal = STAT_ORDER.reduce((sum, stat) => sum + props.evs[stat], 0)

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
                borderRadius: "16px",
                border: `1px solid ${themeConfig.cardBorderColor}`,
                p: 2.5,
            }}
        >
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1, flexWrap: "wrap" }}>

                <Typography
                    sx={{
                        fontSize: 11,
                        fontWeight: GlobalConfig.fontWeights.bold,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: "text.secondary",
                    }}
                >
                    Stats — Lv. {props.level}
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: themeConfig.accentColor }} />
                        <Typography sx={{ fontSize: 10, color: "text.secondary" }}>Base</Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: GlobalConfig.statColors.calculated }} />
                        <Typography sx={{ fontSize: 10, color: "text.secondary" }}>Actual</Typography>
                    </Box>

                    <Chip
                        label={`EVs ${evTotal}`}
                        size="small"
                        sx={{
                            fontSize: 10,
                            fontWeight: GlobalConfig.fontWeights.bold,
                            color: themeConfig.accentColor,
                            backgroundColor: `${themeConfig.accentColor}1A`,
                        }}
                    />
                </Box>
            </Box>

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "56px 36px 1fr 44px 58px 58px",
                    gap: 1.25,
                    pb: 0.5,
                }}
            >
                {["", "Base", "", "Actual", "IV", "EV"].map((columnLabel, index) => (
                    <Typography
                        key={index}
                        sx={{
                            fontSize: 9,
                            fontWeight: GlobalConfig.fontWeights.bold,
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            color: "text.secondary",
                            opacity: 0.7,
                            textAlign: index === 1 || index === 3 ? "right" : "center",
                        }}
                    >
                        {columnLabel}
                    </Typography>
                ))}
            </Box>

            {!props.baseStats &&
                STAT_ORDER.map(stat => <Skeleton key={stat} variant="rounded" height={30} />)
            }

            {props.baseStats && calculatedStats &&
                STAT_ORDER.map(stat => (
                    <StatRowComponent
                        key={stat}
                        stat={stat}
                        baseValue={props.baseStats![stat]}
                        calculatedValue={calculatedStats[stat]}
                        natureDirection={
                            natureModifier.increased === stat ? "increased"
                                : natureModifier.decreased === stat ? "decreased" : null
                        }
                        iv={props.ivs[stat]}
                        ev={props.evs[stat]}
                        onIvChange={(value) => props.onIvChange(stat as StatEnum, value)}
                        onEvChange={(value) => props.onEvChange(stat as StatEnum, value)}
                    />
                ))
            }

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "56px 36px 1fr 44px 58px 58px",
                    gap: 1.25,
                    alignItems: "center",
                    borderTop: `1px solid ${themeConfig.cardBorderColor}`,
                    pt: 1.5,
                    mt: 0.5,
                }}
            >
                <Typography
                    sx={{
                        fontSize: 10.5,
                        fontWeight: GlobalConfig.fontWeights.bold,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                    }}
                >
                    Total
                </Typography>

                <Typography sx={{ fontSize: 14, fontWeight: GlobalConfig.fontWeights.bold, textAlign: "right" }}>
                    {baseStatTotal ?? "—"}
                </Typography>

                <Box />

                <Typography
                    sx={{
                        fontSize: 15,
                        fontWeight: GlobalConfig.fontWeights.bold,
                        textAlign: "right",
                        color: GlobalConfig.statColors.calculated,
                        textShadow: GlobalConfig.statColors.calculatedGlow,
                    }}
                >
                    {calculatedStats?.total ?? "—"}
                </Typography>

                <Box />
                <Box />
            </Box>
        </Box>
    )
}
