"use client"

import { useEffect } from "react"
import { Autocomplete, Box, TextField, Typography, createFilterOptions } from "@mui/material"

import { useMoveStore } from "../../../move/store/move.store"
import { MoveApiResponse } from "../../../move/DTOs/api-responses/move.api-response"
import { NameFormatHelper } from "../../helpers/name-format.helper"
import { TypeBadgeComponent } from "../type-badge/type-badge.component"
import { DamageClassIconComponent } from "../damage-class-icon/damage-class-icon.component"
import { MoveAutocompleteComponentProps } from "./move-autocomplete.component.props"


const filterOptions = createFilterOptions<MoveApiResponse>({ limit: 50, stringify: (option) => option.name })


export function MoveAutocompleteComponent(props: MoveAutocompleteComponentProps) {

    const moves = useMoveStore(state => state.moves)
    const isLoading = useMoveStore(state => state.isLoading)
    const loadMoves = useMoveStore(state => state.loadMoves)

    useEffect(() => {
        loadMoves()
    }, [loadMoves])

    const selectedMove = props.value
        ? moves.find(move => move.name === props.value) ?? { name: props.value, type: null, damageClass: null }
        : null

    return (
        <Autocomplete
            value={selectedMove}
            onChange={(_event, newValue) => props.onChange(newValue?.name ?? null)}
            options={moves}
            loading={isLoading}
            filterOptions={filterOptions}
            getOptionLabel={(option) => NameFormatHelper.prettify(option.name)}
            isOptionEqualToValue={(option, value) => option.name === value.name}
            renderOption={({ key, ...optionProps }, option) => (
                <Box component="li" key={key} {...optionProps} sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                    <Typography sx={{ fontSize: 14, flex: 1, minWidth: 0 }} noWrap>
                        {NameFormatHelper.prettify(option.name)}
                    </Typography>

                    <DamageClassIconComponent damageClass={option.damageClass} />

                    {option.type && <TypeBadgeComponent type={option.type} />}
                </Box>
            )}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={props.label ?? "Move"}
                    variant="filled"
                    fullWidth
                />
            )}
        />
    )
}
