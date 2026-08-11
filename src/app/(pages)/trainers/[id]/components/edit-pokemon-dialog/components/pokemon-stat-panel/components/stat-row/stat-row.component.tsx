import { Box, TextField, Typography, useTheme } from "@mui/material"
import { motion } from "framer-motion"

import { StatLabelsConfig } from "@/src/domains/pokemon-management/pokemon/configs/stat-labels.config"
import { PokemonDefaultsConfig } from "@/src/domains/pokemon-management/pokemon/configs/pokemon-defaults.config"
import { DarkThemeConfig } from "@/src/global/configs/themes/dark.theme.config"
import { LightThemeConfig } from "@/src/global/configs/themes/light.theme.config"
import { GlobalConfig } from "@/src/global/configs/global.config"
import { StatRowComponentProps } from "./stat-row.component.props"


export function StatRowComponent(props: StatRowComponentProps) {

    const theme = useTheme()
    const themeConfig = theme.palette.mode === "dark" ? DarkThemeConfig : LightThemeConfig

    const basePercentage = Math.min(100, (props.baseValue / PokemonDefaultsConfig.MAX_BASE_STAT) * 100)
    const calculatedPercentage = Math.min(100, (props.calculatedValue / PokemonDefaultsConfig.MAX_CALCULATED_STAT) * 100)

    const natureColor = props.natureDirection === "increased"
        ? GlobalConfig.statColors.calculated
        : props.natureDirection === "decreased" ? theme.palette.error.main : null

    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: "56px 36px 1fr 44px 58px 58px",
                gap: 1.25,
                alignItems: "center",
            }}
        >
            <Typography
                sx={{
                    fontSize: 10.5,
                    fontWeight: GlobalConfig.fontWeights.bold,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: natureColor ?? "text.secondary",
                    display: "flex",
                    alignItems: "center",
                    gap: 0.25,
                }}
            >
                {StatLabelsConfig[props.stat].shortLabel}
                {props.natureDirection === "increased" && "▲"}
                {props.natureDirection === "decreased" && "▼"}
            </Typography>

            <Typography sx={{ fontSize: 13, fontWeight: GlobalConfig.fontWeights.bold, textAlign: "right" }}>
                {props.baseValue}
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                <Box sx={{ height: 8, borderRadius: "4px", backgroundColor: `${themeConfig.accentColor}1A`, overflow: "hidden" }}>
                    <Box
                        component={motion.div}
                        animate={{ width: `${basePercentage}%` }}
                        transition={{ type: "spring", stiffness: 120, damping: 20 }}
                        sx={{
                            height: "100%",
                            borderRadius: "4px",
                            backgroundColor: themeConfig.accentColor,
                            boxShadow: `0 0 10px ${themeConfig.accentColor}88`,
                        }}
                    />
                </Box>

                <Box sx={{ height: 4, borderRadius: "2px", backgroundColor: `${GlobalConfig.statColors.calculated}1A`, overflow: "hidden" }}>
                    <Box
                        component={motion.div}
                        animate={{ width: `${calculatedPercentage}%` }}
                        transition={{ type: "spring", stiffness: 120, damping: 20 }}
                        sx={{
                            height: "100%",
                            borderRadius: "2px",
                            backgroundColor: GlobalConfig.statColors.calculated,
                            boxShadow: GlobalConfig.statColors.calculatedGlow,
                        }}
                    />
                </Box>
            </Box>

            <Typography
                sx={{
                    fontSize: 14,
                    fontWeight: GlobalConfig.fontWeights.bold,
                    textAlign: "right",
                    color: GlobalConfig.statColors.calculated,
                }}
            >
                {props.calculatedValue}
            </Typography>

            <TextField
                value={props.iv}
                onChange={(event) => props.onIvChange(Number(event.target.value))}
                type="number"
                size="small"
                variant="filled"
                hiddenLabel
                slotProps={{
                    htmlInput: {
                        min: PokemonDefaultsConfig.MIN_IV,
                        max: PokemonDefaultsConfig.MAX_IV,
                        style: { fontSize: 12, padding: "6px 8px", textAlign: "center" },
                    },
                }}
            />

            <TextField
                value={props.ev}
                onChange={(event) => props.onEvChange(Number(event.target.value))}
                type="number"
                size="small"
                variant="filled"
                hiddenLabel
                slotProps={{
                    htmlInput: {
                        min: PokemonDefaultsConfig.MIN_EV,
                        max: PokemonDefaultsConfig.MAX_EV,
                        step: PokemonDefaultsConfig.EV_STEP,
                        style: { fontSize: 12, padding: "6px 8px", textAlign: "center" },
                    },
                }}
            />
        </Box>
    )
}
