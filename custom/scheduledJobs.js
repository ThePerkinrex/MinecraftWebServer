const server = require('../server')
const scheduleJob = server.scheduleJob

scheduleJob({ hour: 23, minute: 44 }, (wss, execCommand) => {
    execCommand(wss, 'tellraw @a {"text":"[AVISO] Cierre automatico [AVISO]","bold":true,"color":"gold"}', false,
        '[AVISO] Cierre automatico [AVISO]')
    execCommand(wss, 'stop15 poweroff')
})
