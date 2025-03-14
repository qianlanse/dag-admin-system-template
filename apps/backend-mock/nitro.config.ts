// https://nitro.unjs.io/config
process.env.COMPATIBILITY_DATE = new Date().toISOString()
export default defineNitroConfig({
    srcDir: 'server'
})
