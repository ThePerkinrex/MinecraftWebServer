const server = require('../server')
const spawn = require('child_process').spawn

const registerCommand = server.registerCommand


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

function stopPoweroff(wss, execCommand) {
    execCommand(wss, 'kick @a Apagando el server')
    execCommand(wss, 'stop')
    setTimeout(() => {
        spawn('poweroff')
    }, 1000 * 30)
}

registerCommand(/^stop15(?: poweroff)?/, stop15)

registerCommand(/^cancel15/, cancel)

registerCommand(/^stop poweroff$/, stopPoweroff)