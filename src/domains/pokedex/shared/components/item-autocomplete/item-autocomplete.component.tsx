"use client"

import { useEffect } from "react"
import { Autocomplete, TextField, createFilterOptions } from "@mui/material"

import { useItemStore } from "../../../item/store/item.store"
import { NameFormatHelper } from "../../helpers/name-format.helper"
import { ItemAutocompleteComponentProps } from "./item-autocomplete.component.props"


const filterOptions = createFilterOptions<string>({ limit: 50 })


export function ItemAutocompleteComponent(props: ItemAutocompleteComponentProps) {

    const items = useItemStore(state => state.items)
    const isLoading = useItemStore(state => state.isLoading)
    const loadItems = useItemStore(state => state.loadItems)

    useEffect(() => {
        loadItems()
    }, [loadItems])

    return (
        <Autocomplete
            value={props.value}
            onChange={(_event, newValue) => props.onChange(newValue)}
            options={items}
            loading={isLoading}
            filterOptions={filterOptions}
            getOptionLabel={(option) => NameFormatHelper.prettify(option)}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={props.label ?? "Held item"}
                    variant="filled"
                    fullWidth
                />
            )}
        />
    )
}
