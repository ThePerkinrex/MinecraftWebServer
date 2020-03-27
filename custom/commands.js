const server = require('../server')

const registerCommand = server.registerCommand
const scheduleJob = server.scheduleJob
const registerDataHandler = server.registerDataHandler


let cancel15 = false

function stop15(wss, execCommand, command) {
    let poweroff = /poweroff/.test(command)
    if (!cancel15) execCommand(wss, 'tellraw @a {"text":"[AVISO] El server cierra en 15 minutos [AVISO]","bold":true,"color":"gold"}', false,
        '[AVISO] El server cierra en 15 minutos [AVISO]')
    if (!cancel15) setTimeout(() => {
        if (!cancel15) execCommand(wss, 'tellraw @a {"text":"[AVISO] El server cierra en 10 minutos [AVISO]","bold":true,"color":"gold"}', false,
            '[AVISO] El server cierra en 10 minutos [AVISO]')
        if (!cancel15) setTimeout(() => {
            if (!cancel15) execCommand(wss, 'tellraw @a {"text":"[AVISO] El server cierra en 5 minutos [AVISO]","bold":true,"color":"gold"}', false,
                '[AVISO] El server cierra en 5 minutos [AVISO]')
            if (!cancel15) setTimeout(() => {
                if (!cancel15) execCommand(wss, 'tellraw @a {"text":"[AVISO] El server cierra en 2 minutos [AVISO]","bold":true,"color":"gold"}', false,
                    '[AVISO] El server cierra en 2 minutos [AVISO]')
                if (!cancel15) setTimeout(() => {
                    if (!cancel15) execCommand(wss, 'tellraw @a {"text":"[AVISO] El server cierra en 1 minuto [AVISO]","bold":true,"color":"gold"}', false,
                        '[AVISO] El server cierra en 1 minuto [AVISO]')
                    if (!cancel15) setTimeout(() => {
                        if (!cancel15) execCommand(wss, 'say [AVISO] parando el server')
                        if (!cancel15) execCommand(wss, 'stop')
                        if (poweroff && !cancel15) {
                            setTimeout(() => {
                                if (!cancel15) spawn('poweroff')
                                else cancel15 = false
                            }, 1000 * 30)
                        } else if (cancel15) cancel15 = false
                    }, 1000 * 60 * 1)
                    else cancel15 = false
                }, 1000 * 60 * 1)
                else cancel15 = false
            }, 1000 * 60 * 3)
            else cancel15 = false
        }, 1000 * 60 * 5)
        else cancel15 = false
    }, 1000 * 60 * 5)
    else cancel15 = false

}

function cancel(wss, execCommand) {
    execCommand(wss, 'tellraw @a {"text":"[AVISO] Apagado cancelado [AVISO]","bold":true,"color":"gold"}', false,
        '[AVISO] Apagado cancelado [AVISO]')
    cancel15 = true
}

registerCommand(/^stop15(?: poweroff)?/, stop15)

registerCommand(/^cancel15/, cancel)


scheduleJob({ hour: 23, minute: 44 }, (wss, execCommand) => {
    execCommand(wss, 'tellraw @a {"text":"[AVISO] Cierre automatico [AVISO]","bold":true,"color":"gold"}', false,
        '[AVISO] Cierre automatico [AVISO]')
    execCommand(wss, 'stop15 poweroff')
})

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