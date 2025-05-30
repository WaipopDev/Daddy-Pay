export interface Alert {
        show      ?: boolean,
        title     ?: string | null,
        message   : string | null,
        redirectTo?: string | null,
        callbackPath?: string | null
}