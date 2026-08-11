interface _NameFormatHelper {
    readonly prettify: (value: string) => string
}

export const NameFormatHelper: _NameFormatHelper = Object.freeze({

    prettify: (value: string) => value
        .split("-")
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" "),
})
