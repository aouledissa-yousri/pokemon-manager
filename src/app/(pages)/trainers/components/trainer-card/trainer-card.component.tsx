import { Avatar, Box, IconButton, Stack, Tooltip, Typography, useTheme } from "@mui/material"
import EditRoundedIcon from "@mui/icons-material/EditRounded"
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded"

import { DarkThemeConfig } from "@/src/global/configs/themes/dark.theme.config"
import { LightThemeConfig } from "@/src/global/configs/themes/light.theme.config"
import { GlobalConfig } from "@/src/global/configs/global.config"
import { GlassCardComponent } from "@/src/domains/shared/components/glass-card/glass-card.component"
import { TrainerCardComponentProps } from "./trainer-card.component.props"


export function TrainerCardComponent(props: TrainerCardComponentProps) {

    const theme = useTheme()
    const themeConfig = theme.palette.mode === "dark" ? DarkThemeConfig : LightThemeConfig

    return (
        <GlassCardComponent hoverLift onClick={props.onOpen} sx={{ p: 3, display: "flex", alignItems: "center", gap: 2.5 }}>

            <Avatar
                src={props.trainer.image ?? undefined}
                alt={props.trainer.name}
                sx={{
                    width: 64,
                    height: 64,
                    fontSize: 26,
                    fontWeight: GlobalConfig.fontWeights.bold,
                    color: "#FFFFFF",
                    backgroundColor: themeConfig.accentColor,
                    border: `2px solid ${themeConfig.cardBorderColor}`,
                    boxShadow: themeConfig.accentGlow,
                }}
            >
                {props.trainer.name.charAt(0).toUpperCase()}
            </Avatar>

            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                    noWrap
                    sx={{ fontSize: 18, fontWeight: GlobalConfig.fontWeights.bold }}
                >
                    {props.trainer.name}
                </Typography>

                <Typography
                    sx={{
                        fontSize: 10.5,
                        fontWeight: GlobalConfig.fontWeights.bold,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: themeConfig.accentColor,
                        mt: 0.5,
                    }}
                >
                    {props.trainer.pokemonCount} Pokemon
                </Typography>
            </Box>

            <Stack direction="row" spacing={0.5}>
                <Tooltip title="Edit trainer">
                    <IconButton
                        size="small"
                        onClick={(event) => { event.stopPropagation(); props.onEdit() }}
                        sx={{ color: "text.secondary", "&:hover": { color: themeConfig.accentColor } }}
                    >
                        <EditRoundedIcon fontSize="small" />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Remove trainer">
                    <IconButton
                        size="small"
                        onClick={(event) => { event.stopPropagation(); props.onRemove() }}
                        sx={{ color: "text.secondary", "&:hover": { color: theme.palette.error.main } }}
                    >
                        <DeleteRoundedIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Stack>
        </GlassCardComponent>
    )
}
