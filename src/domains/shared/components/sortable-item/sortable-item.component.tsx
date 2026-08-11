"use client"

import { Box, useTheme } from "@mui/material"
import DragIndicatorRoundedIcon from "@mui/icons-material/DragIndicatorRounded"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

import { DarkThemeConfig } from "@/src/global/configs/themes/dark.theme.config"
import { LightThemeConfig } from "@/src/global/configs/themes/light.theme.config"
import { SortableItemComponentProps } from "./sortable-item.component.props"


export function SortableItemComponent(props: SortableItemComponentProps) {

    const theme = useTheme()
    const themeConfig = theme.palette.mode === "dark" ? DarkThemeConfig : LightThemeConfig

    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: props.id })

    return (
        <Box
            ref={setNodeRef}
            sx={{
                position: "relative",
                transform: CSS.Transform.toString(transform),
                transition,
                opacity: isDragging ? 0.4 : 1,
                zIndex: isDragging ? 2 : "auto",
                "&:hover .sortable-drag-handle": { opacity: 1 },
            }}
        >
            <Box
                className="sortable-drag-handle"
                {...attributes}
                {...listeners}
                sx={{
                    position: "absolute",
                    top: 8,
                    left: 8,
                    zIndex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 26,
                    height: 26,
                    borderRadius: "8px",
                    cursor: "grab",
                    color: themeConfig.accentColor,
                    backgroundColor: themeConfig.surfaceColor,
                    backdropFilter: themeConfig.blur,
                    border: `1px solid ${themeConfig.cardBorderColor}`,
                    opacity: 0,
                    transition: "opacity 0.15s",
                    touchAction: "none",
                    "&:active": { cursor: "grabbing" },
                }}
            >
                <DragIndicatorRoundedIcon sx={{ fontSize: 16 }} />
            </Box>

            {props.children}
        </Box>
    )
}
