"use client"

import { useMemo, useState } from "react"
import { createTheme, CssBaseline, IconButton, ThemeProvider as MuiThemeProvider } from "@mui/material"
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded"
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded"

import { GlobalConfig } from "@/src/global/configs/global.config"
import { DarkThemeConfig } from "@/src/global/configs/themes/dark.theme.config"
import { LightThemeConfig } from "@/src/global/configs/themes/light.theme.config"


export type ThemeMode = "dark" | "light"

interface ThemeProviderProps {
    readonly initialMode: ThemeMode
    readonly children: React.ReactNode
}


export function ThemeProvider({ initialMode, children }: ThemeProviderProps) {

    const [mode, setMode] = useState<ThemeMode>(initialMode)

    const theme = useMemo(() => {

        const themeConfig = mode === "dark" ? DarkThemeConfig : LightThemeConfig

        return createTheme({
            palette: {
                mode,
                primary: { main: themeConfig.accentColor },
                success: { main: GlobalConfig.statColors.calculated },
                background: {
                    default: themeConfig.backgroundColor,
                    paper: themeConfig.surfaceSolidColor,
                },
                text: {
                    primary: themeConfig.textColor,
                    secondary: themeConfig.secondaryTextColor,
                },
            },
            typography: {
                fontFamily: GlobalConfig.fontFamily,
            },
            shape: { borderRadius: 12 },
            components: {
                MuiCssBaseline: {
                    styleOverrides: {
                        body: {
                            background: themeConfig.backgroundGradient,
                            backgroundAttachment: "fixed",
                            minHeight: "100vh",
                        },
                        "*::-webkit-scrollbar": { width: "6px", height: "6px" },
                        "*::-webkit-scrollbar-thumb": {
                            backgroundColor: themeConfig.cardBorderColor,
                            borderRadius: "8px",
                        },
                    },
                },
                MuiPaper: {
                    styleOverrides: {
                        root: { backgroundImage: "none" },
                    },
                },
                MuiDialog: {
                    styleOverrides: {
                        paper: {
                            backgroundImage: "none",
                            backgroundColor: mode === "dark" ? "rgba(9, 14, 28, 0.85)" : "rgba(255, 255, 255, 0.9)",
                            backdropFilter: themeConfig.blur,
                            border: `1px solid ${themeConfig.cardBorderColor}`,
                            borderRadius: "16px",
                        },
                    },
                },
                MuiButton: {
                    styleOverrides: {
                        root: {
                            textTransform: "none",
                            borderRadius: "10px",
                            fontWeight: GlobalConfig.fontWeights.semiBold,
                        },
                    },
                },
                MuiTooltip: {
                    styleOverrides: {
                        tooltip: {
                            backdropFilter: themeConfig.blur,
                            fontWeight: GlobalConfig.fontWeights.medium,
                        },
                    },
                },
            },
        })
    }, [mode])

    const changeMode = () => {
        const nextMode: ThemeMode = mode === "dark" ? "light" : "dark"
        setMode(nextMode)
        document.cookie = `mode=${nextMode}; path=/; max-age=31536000`
    }

    const themeConfig = mode === "dark" ? DarkThemeConfig : LightThemeConfig

    return (
        <MuiThemeProvider theme={theme}>
            <CssBaseline />

            {children}

            <IconButton
                onClick={changeMode}
                aria-label="Toggle theme"
                sx={{
                    position: "fixed",
                    bottom: 24,
                    right: 24,
                    zIndex: 9999,
                    color: themeConfig.accentColor,
                    backgroundColor: themeConfig.surfaceColor,
                    backdropFilter: themeConfig.blur,
                    border: `1px solid ${themeConfig.cardBorderColor}`,
                    transition: "box-shadow 0.2s, border-color 0.2s",

                    "&:hover": {
                        backgroundColor: themeConfig.surfaceColor,
                        boxShadow: themeConfig.accentGlow,
                        borderColor: themeConfig.accentColor,
                    },
                }}
            >
                {mode === "dark" ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />}
            </IconButton>
        </MuiThemeProvider>
    )
}
