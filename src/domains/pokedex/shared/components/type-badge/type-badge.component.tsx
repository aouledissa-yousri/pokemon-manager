import { Chip } from "@mui/material"

import { GlobalConfig } from "@/src/global/configs/global.config"
import { FALLBACK_TYPE_COLOR, TypeColorsConfig } from "../../../type/configs/type-colors.config"
import { TypeBadgeComponentProps } from "./type-badge.component.props"


export function TypeBadgeComponent(props: TypeBadgeComponentProps) {

    const color = TypeColorsConfig[props.type] ?? FALLBACK_TYPE_COLOR
    const isSmall = (props.size ?? "small") === "small"

    return (
        <Chip
            label={props.type}
            size="small"
            sx={{
                backgroundColor: color,
                color: "#FFFFFF",
                fontWeight: GlobalConfig.fontWeights.bold,
                fontSize: isSmall ? 10 : 12,
                height: isSmall ? 20 : 26,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                borderRadius: "6px",
                boxShadow: `0 0 12px ${color}55`,
            }}
        />
    )
}
