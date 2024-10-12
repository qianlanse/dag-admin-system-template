import plugin from 'tailwindcss/plugin.js'

/**
 * 自定义tailwindcss动画
 * @returns tailwindcss plugin
 */
export function enterAnimationPlugin() {
    return plugin(({ addUtilities }) => {
        const maxChild = 5
        const utilities: Record<string, any> = {}
        for (let index = 0; index <= maxChild; index++) {
            const baseDelay = 0.1
            const delay = `${baseDelay * index}s`

            utilities[`.enter-x:nth-child(${index})`] = {
                animation: `enter-x-animation 0.3s ease-in-out ${delay} forwards`,
                opacity: '0',
                transform: 'translateX(50px)'
            }

            utilities[`.enter-y:nth-child(${index})`] = {
                animation: `enter-y-animation 0.3s ease-in-out ${delay} forwards`,
                opacity: '0',
                transform: `translateY(50px)`
            }

            utilities[`.-enter-x:nth-child(${index})`] = {
                animation: `enter-x-animation 0.3s ease-in-out ${delay} forwards`,
                opacity: '0',
                transform: `translateX(-50px)`
            }

            utilities[`.-enter-y:nth-child(${index})`] = {
                animation: `enter-y-animation 0.3s ease-in-out ${delay} forwards`,
                opacity: '0',
                transform: `translateY(-50px)`
            }
        }

        addUtilities(utilities)
        addUtilities({
            '@keyframes enter-x-animation': {
                to: {
                    opacity: '1',
                    transform: 'translateX(0)'
                }
            },
            '@keyframes enter-y-animation': {
                to: {
                    opacity: '1',
                    transform: 'translateY(0)'
                }
            }
        })
    })
}
