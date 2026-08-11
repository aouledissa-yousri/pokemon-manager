import { Box, FormControlLabel, Skeleton, Stack, Switch, Typography, useTheme } from "@mui/material"
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded"
import { motion, AnimatePresence } from "framer-motion"

import { NameFormatHelper } from "@/src/domains/pokedex/shared/helpers/name-format.helper"
import { TypeBadgeComponent } from "@/src/domains/pokedex/shared/components/type-badge/type-badge.component"
import { DarkThemeConfig } from "@/src/global/configs/themes/dark.theme.config"
import { LightThemeConfig } from "@/src/global/configs/themes/light.theme.config"
import { GlobalConfig } from "@/src/global/configs/global.config"
import { PokemonArtworkComponentProps } from "./pokemon-artwork.component.props"


const SHINY_COLOR = "#FFD54F"


export function PokemonArtworkComponent(props: PokemonArtworkComponentProps) {

    const theme = useTheme()
    const themeConfig = theme.palette.mode === "dark" ? DarkThemeConfig : LightThemeConfig

    const displayedUrl = props.isShiny && props.shinyArtworkUrl ? props.shinyArtworkUrl : props.artworkUrl

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1.5,
                borderRadius: "16px",
                border: `1px solid ${themeConfig.cardBorderColor}`,
                background: `radial-gradient(ellipse 70% 80% at 50% 100%, ${themeConfig.accentColor}1E, transparent)`,
                py: 3,
                px: 2,
            }}
        >
            {displayedUrl ?
                <AnimatePresence mode="wait">
                    <Box
                        key={displayedUrl}
                        component={motion.img}
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.92 }}
                        transition={{ duration: 0.25 }}
                        src={displayedUrl}
                        alt={props.speciesName}
                        sx={{
                            height: 190,
                            width: 190,
                            objectFit: "contain",
                            filter: `drop-shadow(0 16px 28px ${themeConfig.accentColor}55)`,
                        }}
                    />
                </AnimatePresence>
                :
                <Skeleton variant="circular" width={170} height={170} />
            }

            <Typography sx={{ fontSize: 22, fontWeight: GlobalConfig.fontWeights.bold, lineHeight: 1 }}>
                {NameFormatHelper.prettify(props.speciesName)}
            </Typography>

            <Stack direction="row" spacing={0.75}>
                {props.types.map(type => <TypeBadgeComponent key={type} type={type} size="medium" />)}
            </Stack>

            <FormControlLabel
                control={
                    <Switch
                        checked={props.isShiny}
                        disabled={!props.shinyArtworkUrl}
                        onChange={(event) => props.onToggleShiny(event.target.checked)}
                        sx={{
                            "& .MuiSwitch-switchBase.Mui-checked": { color: SHINY_COLOR },
                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: SHINY_COLOR },
                        }}
                    />
                }
                label={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <AutoAwesomeRoundedIcon sx={{ fontSize: 16, color: props.isShiny ? SHINY_COLOR : "text.secondary" }} />
                        <Typography
                            sx={{
                                fontSize: 11,
                                fontWeight: GlobalConfig.fontWeights.bold,
                                letterSpacing: "0.12em",
                                textTransform: "uppercase",
                                color: props.isShiny ? SHINY_COLOR : "text.secondary",
                            }}
                        >
                            Shiny
                        </Typography>
                    </Box>
                }
            />
        </Box>
    )
}
