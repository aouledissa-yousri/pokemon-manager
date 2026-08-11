import { Tooltip } from "@mui/material"
import SportsMmaRoundedIcon from "@mui/icons-material/SportsMmaRounded"
import FlareRoundedIcon from "@mui/icons-material/FlareRounded"
import TrackChangesRoundedIcon from "@mui/icons-material/TrackChangesRounded"

import { MoveDamageClassConfig } from "../../../move/configs/move-damage-class.config"
import { DamageClassIconComponentProps } from "./damage-class-icon.component.props"


export function DamageClassIconComponent(props: DamageClassIconComponentProps) {

    if (!props.damageClass) return null

    const style = MoveDamageClassConfig[props.damageClass]
    if (!style) return null

    const iconSx = { fontSize: 16, color: style.color }

    return (
        <Tooltip title={style.label}>
            {props.damageClass === "physical" ? <SportsMmaRoundedIcon sx={iconSx} />
                : props.damageClass === "special" ? <FlareRoundedIcon sx={iconSx} />
                    : <TrackChangesRoundedIcon sx={iconSx} />}
        </Tooltip>
    )
}
