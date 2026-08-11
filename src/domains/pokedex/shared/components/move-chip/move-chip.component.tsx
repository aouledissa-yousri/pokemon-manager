"use client"

import { useEffect } from "react"
import { Box, Typography, useTheme } from "@mui/material"

import { useMoveStore } from "../../../move/store/move.store"
import { NameFormatHelper } from "../../helpers/name-format.helper"
import { TypeBadgeComponent } from "../type-badge/type-badge.component"
import { DamageClassIconComponent } from "../damage-class-icon/damage-class-icon.component"
import { DarkThemeConfig } from "@/src/global/configs/themes/dark.theme.config"
import { LightThemeConfig } from "@/src/global/configs/themes/light.theme.config"
import { MoveChipComponentProps } from "./move-chip.component.props"


export function MoveChipComponent(props: MoveChipComponentProps) {

    const theme = useTheme()
    const themeConfig = theme.palette.mode === "dark" ? DarkThemeConfig : LightThemeConfig

    const moves = useMoveStore(state => state.moves)
    const loadMoves = useMoveStore(state => state.loadMoves)

    useEffect(() => {
        loadMoves()
    }, [loadMoves])

    const move = moves.find(entry => entry.name === props.moveName)

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                pl: 0.75,
                pr: 0.5,
                py: 0.25,
                borderRadius: "6px",
                border: `1px solid ${themeConfig.cardBorderColor}`,
                backgroundColor: themeConfig.surfaceColor,
            }}
        >
            <DamageClassIconComponent damageClass={move?.damageClass ?? null} />

            <Typography noWrap sx={{ fontSize: 10.5, flex: 1, minWidth: 0 }}>
                {NameFormatHelper.prettify(props.moveName)}
            </Typography>

            {move?.type && <TypeBadgeComponent type={move.type} />}
        </Box>
    )
}
