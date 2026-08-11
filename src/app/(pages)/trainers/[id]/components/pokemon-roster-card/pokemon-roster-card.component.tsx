"use client"

import { useEffect, useState } from "react"
import { Box, Chip, IconButton, Skeleton, Stack, Tooltip, Typography, useTheme } from "@mui/material"
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded"
import TuneRoundedIcon from "@mui/icons-material/TuneRounded"
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded"
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded"
import BackpackRoundedIcon from "@mui/icons-material/BackpackRounded"

import { useSpeciesStore } from "@/src/domains/pokedex/species/store/species.store"
import { SpeciesDetailApiResponse } from "@/src/domains/pokedex/species/DTOs/api-responses/species-detail.api-response"
import { NameFormatHelper } from "@/src/domains/pokedex/shared/helpers/name-format.helper"
import { TypeBadgeComponent } from "@/src/domains/pokedex/shared/components/type-badge/type-badge.component"
import { MoveChipComponent } from "@/src/domains/pokedex/shared/components/move-chip/move-chip.component"
import { StatCalculatorHelper } from "@/src/domains/pokemon-management/pokemon/helpers/stat-calculator.helper"
import { GlassCardComponent } from "@/src/domains/shared/components/glass-card/glass-card.component"
import { DarkThemeConfig } from "@/src/global/configs/themes/dark.theme.config"
import { LightThemeConfig } from "@/src/global/configs/themes/light.theme.config"
import { GlobalConfig } from "@/src/global/configs/global.config"
import { PokemonRosterCardComponentProps } from "./pokemon-roster-card.component.props"


const SHINY_COLOR = "#FFD54F"


export function PokemonRosterCardComponent(props: PokemonRosterCardComponentProps) {

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

    const artworkUrl = detail
        ? (props.pokemon.isShiny && detail.shinyArtworkUrl ? detail.shinyArtworkUrl : detail.artworkUrl)
        : null

    const canBeShiny = !detail || !!detail.shinyArtworkUrl

    const baseStatTotal = detail ? StatCalculatorHelper.getBaseStatTotal(detail.baseStats) : null
    const calculatedTotal = detail
        ? StatCalculatorHelper.calculateAllStats(detail.baseStats, props.pokemon.ivs, props.pokemon.evs, props.pokemon.level, props.pokemon.nature).total
        : null

    const activeMoves = props.pokemon.moves.filter((move): move is string => !!move)

    return (
        <GlassCardComponent hoverLift sx={{ overflow: "hidden", display: "flex", flexDirection: "column" }}>

            <Box
                sx={{
                    position: "relative",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    pt: 3,
                    pb: 1.5,
                    background: `radial-gradient(ellipse 70% 90% at 50% 110%, ${themeConfig.accentColor}22, transparent)`,
                }}
            >
                {artworkUrl ?
                    <Box
                        component="img"
                        src={artworkUrl}
                        alt={props.pokemon.speciesName}
                        sx={{
                            height: 120,
                            width: 120,
                            objectFit: "contain",
                            filter: `drop-shadow(0 12px 20px ${themeConfig.accentColor}44)`,
                        }}
                    />
                    :
                    <Skeleton variant="circular" width={110} height={110} />
                }

                <Chip
                    label={`Lv. ${props.pokemon.level}`}
                    size="small"
                    sx={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        fontSize: 11,
                        fontWeight: GlobalConfig.fontWeights.bold,
                        color: themeConfig.accentColor,
                        backgroundColor: `${themeConfig.accentColor}1A`,
                        border: `1px solid ${themeConfig.cardBorderColor}`,
                    }}
                />

                {props.pokemon.isShiny &&
                    <AutoAwesomeRoundedIcon
                        sx={{ position: "absolute", top: 14, left: 14, fontSize: 18, color: SHINY_COLOR }}
                    />
                }
            </Box>

            <Box sx={{ px: 2.5, pb: 2, pt: 0.5, display: "flex", flexDirection: "column", gap: 1 }}>

                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
                    <Typography noWrap sx={{ fontSize: 17, fontWeight: GlobalConfig.fontWeights.bold }}>
                        {NameFormatHelper.prettify(props.pokemon.speciesName)}
                    </Typography>

                    <Tooltip title={canBeShiny ? (props.pokemon.isShiny ? "Make regular" : "Make shiny") : "No shiny artwork"}>
                        <span>
                            <IconButton
                                size="small"
                                disabled={!canBeShiny}
                                onClick={props.onToggleShiny}
                                sx={{
                                    color: props.pokemon.isShiny ? SHINY_COLOR : "text.secondary",
                                    "&:hover": { color: SHINY_COLOR },
                                }}
                            >
                                <AutoAwesomeRoundedIcon fontSize="small" />
                            </IconButton>
                        </span>
                    </Tooltip>
                </Box>

                <Stack direction="row" spacing={0.75}>
                    {(detail?.types ?? []).map(type => <TypeBadgeComponent key={type} type={type} />)}
                </Stack>

                <Typography noWrap sx={{ fontSize: 12, color: "text.secondary" }}>
                    {NameFormatHelper.prettify(props.pokemon.nature)}
                    {props.pokemon.ability && ` · ${NameFormatHelper.prettify(props.pokemon.ability)}`}
                </Typography>

                {props.pokemon.heldItem &&
                    <Typography
                        noWrap
                        sx={{ fontSize: 11, color: "text.secondary", display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                        <BackpackRoundedIcon sx={{ fontSize: 13 }} />
                        {NameFormatHelper.prettify(props.pokemon.heldItem)}
                    </Typography>
                }

                {activeMoves.length > 0 &&
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, mt: 0.25 }}>
                        {activeMoves.map(move => <MoveChipComponent key={move} moveName={move} />)}
                    </Box>
                }

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mt: 0.5,
                        pt: 0.75,
                        borderTop: `1px solid ${themeConfig.cardBorderColor}`,
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: 10,
                            fontWeight: GlobalConfig.fontWeights.bold,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            color: "text.secondary",
                        }}
                    >
                        BST {baseStatTotal ?? "—"}
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: 12,
                            fontWeight: GlobalConfig.fontWeights.bold,
                            color: GlobalConfig.statColors.calculated,
                        }}
                    >
                        {calculatedTotal ?? "—"}
                    </Typography>
                </Box>

                <Stack direction="row" spacing={0.5} sx={{ justifyContent: "flex-end", mt: 0.5 }}>
                    <Tooltip title="Edit build & stats">
                        <IconButton
                            size="small"
                            onClick={props.onEdit}
                            sx={{ color: "text.secondary", "&:hover": { color: themeConfig.accentColor } }}
                        >
                            <TuneRoundedIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Copy to another trainer">
                        <IconButton
                            size="small"
                            onClick={props.onCopy}
                            sx={{ color: "text.secondary", "&:hover": { color: themeConfig.accentColor } }}
                        >
                            <ContentCopyRoundedIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Release">
                        <IconButton
                            size="small"
                            onClick={props.onRemove}
                            sx={{ color: "text.secondary", "&:hover": { color: theme.palette.error.main } }}
                        >
                            <DeleteRoundedIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Stack>
            </Box>
        </GlassCardComponent>
    )
}
