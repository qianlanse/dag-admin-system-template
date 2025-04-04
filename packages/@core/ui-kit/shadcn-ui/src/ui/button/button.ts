import { cva } from 'class-variance-authority'

export const buttonVariants = cva(
    'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
    {
        defaultVariants: {
            size: 'default',
            variant: 'default'
        },
        variants: {
            size: {
                default: 'h-9 px-4 py-2',
                icon: 'h-8 w-8 rounded-sm px-1 text-lg',
                lg: 'h-10 rounded-md px-8',
                sm: 'h-8 rounded-md px-3 text-xs',
                xs: 'h-8 w-8 rounded-sm px-1 text-xs'
            },
            variant: {
                default: 'bg-primary text-primary-foreground hover:bg-primary/90',
                destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
                ghost: 'hover:bg-accent hover:text-accent-foreground',
                heavy: 'hover:bg-heavy hover:text-heavy-foreground',
                icon: 'hover:bg-accent hover:text-accent-foreground text-foreground/80',
                link: 'text-primary underline-offset-4 hover:underline',
                outline:
                    'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
                secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }
        }
    }
)
