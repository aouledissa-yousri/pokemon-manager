import { Box, Skeleton, Stack, Typography, useTheme } from "@mui/material"

import { TypeEffectivenessHelper } from "@/src/domains/pokedex/type/helpers/type-effectiveness.helper"
import { DEFENSE_BUCKET_ORDER, DefenseBucketStyleConfig } from "@/src/domains/pokedex/type/configs/defense-bucket-style.config"
import { TypeBadgeComponent } from "@/src/domains/pokedex/shared/components/type-badge/type-badge.component"
import { DarkThemeConfig } from "@/src/global/configs/themes/dark.theme.config"
import { LightThemeConfig } from "@/src/global/configs/themes/light.theme.config"
import { GlobalConfig } from "@/src/global/configs/global.config"
import { TypeDefensesPanelComponentProps } from "./type-defenses-panel.component.props"


export function TypeDefensesPanelComponent(props: TypeDefensesPanelComponentProps) {

    const theme = useTheme()
    const themeConfig = theme.palette.mode === "dark" ? DarkThemeConfig : LightThemeConfig

    const buckets = props.types ? TypeEffectivenessHelper.getDefenseBuckets(props.types) : null

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1.25,
                borderRadius: "16px",
                border: `1px solid ${themeConfig.cardBorderColor}`,
                p: 2.5,
            }}
        >
            <Typography
                sx={{
                    fontSize: 11,
                    fontWeight: GlobalConfig.fontWeights.bold,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "text.secondary",
                }}
            >
                Defenses
            </Typography>

            {!buckets &&
                Array.from({ length: 6 }, (_, index) => <Skeleton key={index} variant="rounded" height={24} />)
            }

            {buckets &&
                DEFENSE_BUCKET_ORDER.map(bucket => {

                    const style = DefenseBucketStyleConfig[bucket]
                    const types = buckets[bucket]

                    return (
                        <Box
                            key={bucket}
                            sx={{
                                display: "grid",
                                gridTemplateColumns: "112px 1fr",
                                alignItems: "center",
                                gap: 1,
                            }}
                        >
                            <Typography sx={{ fontSize: 12, fontWeight: GlobalConfig.fontWeights.semiBold, color: style.color }}>
                                {style.label}
                            </Typography>

                            {types.length > 0 ?
                                <Stack direction="row" spacing={0.6} sx={{ flexWrap: "wrap", gap: 0.6 }}>
                                    {types.map(type => <TypeBadgeComponent key={type} type={type} />)}
                                </Stack>
                                :
                                <Typography sx={{ fontSize: 12, color: "text.secondary", opacity: 0.5 }}>
                                    —
                                </Typography>
                            }
                        </Box>
                    )
                })
            }
        </Box>
    )
}
