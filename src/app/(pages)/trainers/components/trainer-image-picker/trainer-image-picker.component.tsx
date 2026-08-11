"use client"

import { useRef } from "react"
import { Avatar, Badge, Box, IconButton, Tooltip, useTheme } from "@mui/material"
import PhotoCameraRoundedIcon from "@mui/icons-material/PhotoCameraRounded"

import { DarkThemeConfig } from "@/src/global/configs/themes/dark.theme.config"
import { LightThemeConfig } from "@/src/global/configs/themes/light.theme.config"
import { GlobalConfig } from "@/src/global/configs/global.config"
import { TrainerImagePickerComponentProps } from "./trainer-image-picker.component.props"


export function TrainerImagePickerComponent(props: TrainerImagePickerComponentProps) {

    const theme = useTheme()
    const themeConfig = theme.palette.mode === "dark" ? DarkThemeConfig : LightThemeConfig

    const inputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) props.onSelect(file)
        event.target.value = ""
    }

    return (
        <Box sx={{ display: "flex", justifyContent: "center", py: 1 }}>

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleFileChange}
            />

            <Badge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                badgeContent={
                    <Tooltip title="Choose image">
                        <IconButton
                            size="small"
                            onClick={() => inputRef.current?.click()}
                            sx={{
                                backgroundColor: themeConfig.accentColor,
                                color: "#FFFFFF",
                                "&:hover": { backgroundColor: themeConfig.accentHoverColor },
                            }}
                        >
                            <PhotoCameraRoundedIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                    </Tooltip>
                }
            >
                <Avatar
                    src={props.previewUrl ?? undefined}
                    onClick={() => inputRef.current?.click()}
                    sx={{
                        width: 96,
                        height: 96,
                        fontSize: 38,
                        fontWeight: GlobalConfig.fontWeights.bold,
                        cursor: "pointer",
                        color: "#FFFFFF",
                        backgroundColor: themeConfig.accentColor,
                        border: `2px solid ${themeConfig.cardBorderColor}`,
                        boxShadow: themeConfig.accentGlow,
                    }}
                >
                    {props.fallbackLetter.toUpperCase()}
                </Avatar>
            </Badge>
        </Box>
    )
}
