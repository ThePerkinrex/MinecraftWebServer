const server = require('../server')
const registerDataHandler = server.registerDataHandler

registerDataHandler((text, wss, execCommand) => { // Openblocks only handler
    let match = text.match(/\/ob_inventory restore ([A-Za-z0-9_]+)/)
    // console.log("-", match)
    if (match !== null) {
        if (match.length > 1) {
            setTimeout(() => {
                execCommand(wss, `title ${match[1]} title ["",{"text":"tremenda "},{"text":"F","bold":true,"italic":true,"color":"gold"}]`, false)
                execCommand(wss, `tellraw ${match[1]} ["",{"text":"Has muerto","color":"dark_aqua"},{"text":" ","bold":true,"color":"dark_aqua"},{"score":{"name":"${match[1]}","objective":"deaths"},"bold":true,"color":"dark_aqua"},{"text":" veces. Tremenda F","color":"dark_aqua"}]`, false)
            }, 2000)
        }
    }
})