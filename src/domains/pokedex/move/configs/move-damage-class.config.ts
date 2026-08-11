export interface MoveDamageClassStyle {
    readonly label: string
    readonly color: string
}

export const MoveDamageClassConfig: Readonly<Record<string, MoveDamageClassStyle>> = Object.freeze({
    physical: { label: "Physical", color: "#EF6845" },
    special: { label: "Special", color: "#5A8DEE" },
    status: { label: "Status", color: "#9AA0A6" },
})
