"use client"

import { useEffect } from "react"
import { Autocomplete, TextField, createFilterOptions } from "@mui/material"

import { useAbilityStore } from "../../../ability/store/ability.store"
import { NameFormatHelper } from "../../helpers/name-format.helper"
import { AbilityAutocompleteComponentProps } from "./ability-autocomplete.component.props"


const filterOptions = createFilterOptions<string>({ limit: 50 })


export function AbilityAutocompleteComponent(props: AbilityAutocompleteComponentProps) {

    const abilities = useAbilityStore(state => state.abilities)
    const isLoading = useAbilityStore(state => state.isLoading)
    const loadAbilities = useAbilityStore(state => state.loadAbilities)

    useEffect(() => {
        loadAbilities()
    }, [loadAbilities])

    return (
        <Autocomplete
            value={props.value}
            onChange={(_event, newValue) => props.onChange(newValue)}
            options={abilities}
            loading={isLoading}
            filterOptions={filterOptions}
            getOptionLabel={(option) => NameFormatHelper.prettify(option)}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={props.label ?? "Ability"}
                    variant="filled"
                    fullWidth
                />
            )}
        />
    )
}
