"use client"

import { useEffect, useState } from "react"
import { Box, Skeleton, Typography, useTheme } from "@mui/material"
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded"

import { useSpeciesStore } from "@/src/domains/pokedex/species/store/species.store"
import { SpeciesDetailApiResponse } from "@/src/domains/pokedex/species/DTOs/api-responses/species-detail.api-response"
import { NameFormatHelper } from "@/src/domains/pokedex/shared/helpers/name-format.helper"
import { DarkThemeConfig } from "@/src/global/configs/themes/dark.theme.config"
import { LightThemeConfig } from "@/src/global/configs/themes/light.theme.config"
import { GlobalConfig } from "@/src/global/configs/global.config"
import { TeamPokemonTileComponentProps } from "./team-pokemon-tile.component.props"


export function TeamPokemonTileComponent(props: TeamPokemonTileComponentProps) {

    const theme = useTheme()
    const themeConfig = theme.palette.mode === "dark" ? DarkThemeConfig : LightThemeConfig

    const loadSpeciesDetail = useSpeciesStore(state => state.loadSpeciesDetail)
    const [detail, setDetail] = useState<SpeciesDetailApiResponse | null>(null)

    useEffect(() => {
        let isMounted = true

        loadSpeciesDetail(props.pokemon.speciesId).then(speciesDetail => {
            if (isMounted) setDetail(speciesDetail)
        })

        return () => { isMounted = false }
    }, [loadSpeciesDetail, props.pokemon.speciesId])

    const artworkUrl = props.pokemon.isShiny && detail?.shinyArtworkUrl ? detail.shinyArtworkUrl : detail?.artworkUrl

    return (
        <Box
            component="button"
            type="button"
            onClick={props.onToggle}
            disabled={props.isDisabled}
            sx={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 0.5,
                p: 1.25,
                border: `1px solid ${props.isSelected ? themeConfig.accentColor : themeConfig.cardBorderColor}`,
                borderRadius: "12px",
                backgroundColor: props.isSelected ? `${themeConfig.accentColor}1A` : themeConfig.surfaceColor,
                backdropFilter: themeConfig.blur,
                cursor: props.isDisabled ? "not-allowed" : "pointer",
                opacity: props.isDisabled ? 0.4 : 1,
                transition: "border-color 0.2s, box-shadow 0.2s, transform 0.15s",
                fontFamily: "inherit",
                "&:hover": props.isDisabled ? undefined : {
                    borderColor: themeConfig.accentColor,
                    boxShadow: themeConfig.accentGlow,
                    transform: "translateY(-2px)",
                },
            }}
        >
            {props.isSelected &&
                <CheckCircleRoundedIcon
                    sx={{
                        position: "absolute",
                        top: 4,
                        right: 4,
                        fontSize: 18,
                        color: themeConfig.accentColor,
                        backgroundColor: themeConfig.surfaceSolidColor,
                        borderRadius: "50%",
                    }}
                />
            }

            {artworkUrl ?
                <Box component="img" src={artworkUrl} alt={props.pokemon.speciesName} sx={{ width: 56, height: 56, objectFit: "contain" }} />
                :
                <Skeleton variant="circular" width={56} height={56} />
            }

            <Typography noWrap sx={{ fontSize: 12, fontWeight: GlobalConfig.fontWeights.bold, maxWidth: "100%" }}>
                {NameFormatHelper.prettify(props.pokemon.speciesName)}
            </Typography>

            <Typography noWrap sx={{ fontSize: 10, color: "text.secondary", maxWidth: "100%" }}>
                Lv. {props.pokemon.level} · {props.spaceName}
            </Typography>
        </Box>
    )
}
