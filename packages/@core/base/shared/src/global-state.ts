interface ComponentsState {
    [key: string]: any
}

interface MessageState {
    copyPreferencesSuccess?: (title: string, content?: string) => void
}

class GlobalShareState {
    #components: ComponentsState = {}
    #message: MessageState = {}

    public defineMessage({ copyPreferencesSuccess }: MessageState) {
        this.#message = {
            copyPreferencesSuccess
        }
    }

    public getComponents(): ComponentsState {
        return this.#components
    }

    public getMessage(): MessageState {
        return this.#message
    }

    public setComponents(value: ComponentsState) {
        this.#components = value
    }
}

export const globalShareState = new GlobalShareState()
