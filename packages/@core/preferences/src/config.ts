import type { Preferences } from './types'

export const defaultPreferences: Preferences = {
    app: {
        authPageLayout: 'panel-left'
    },
    theme: {
        builtinType: 'default',
        colorDestructive: 'hsl(348 100% 61%)',
        colorPrimary: 'hsl(212 100% 45%)',
        colorSuccess: 'hsl(144 57% 58%)',
        colorWarning: 'hsl(42 84% 61%)',
        mode: 'light',
        radius: '0.5',
        semiDarkHeader: false,
        semiDarkSidebar: true
    }
}
