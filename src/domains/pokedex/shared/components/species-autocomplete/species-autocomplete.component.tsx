"use client"

import { useEffect } from "react"
import { Autocomplete, TextField, createFilterOptions } from "@mui/material"

import { useSpeciesStore } from "../../../species/store/species.store"
import { SpeciesSummaryApiResponse } from "../../../species/DTOs/api-responses/species-summary.api-response"
import { NameFormatHelper } from "../../helpers/name-format.helper"
import { SpeciesAutocompleteComponentProps } from "./species-autocomplete.component.props"


const filterOptions = createFilterOptions<SpeciesSummaryApiResponse>({ limit: 50 })


export function SpeciesAutocompleteComponent(props: SpeciesAutocompleteComponentProps) {

    const speciesList = useSpeciesStore(state => state.speciesList)
    const isLoadingList = useSpeciesStore(state => state.isLoadingList)
    const loadSpeciesList = useSpeciesStore(state => state.loadSpeciesList)

    useEffect(() => {
        loadSpeciesList()
    }, [loadSpeciesList])

    return (
        <Autocomplete
            value={props.value}
            onChange={(_event, newValue) => props.onChange(newValue)}
            options={speciesList}
            loading={isLoadingList}
            filterOptions={filterOptions}
            getOptionLabel={(option) => NameFormatHelper.prettify(option.name)}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={props.label ?? "Pokemon species"}
                    variant="filled"
                    autoFocus={props.autoFocus}
                    fullWidth
                />
            )}
        />
    )
}
