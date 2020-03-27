# Minecraft webserver

This project aims to create a web terminal for the server, and be able to implement custom commands and scheduled actions, such as a 15 minute timer for shutdown. It can attach to any server working on a screen created with the screen command, so it doesn't replace the server itself.

### Usage

To make it work, you need the `screen` and `tail` commands installed on the system. They usually come installed with linux.

then just start it with `yarn start`

### Customizing the web console

Create a js file in the `custom` folder to register new commands
An example would be
```js
const registerCommand = require('../server').registerCommand
registerCommand(/^test/, (wss, execCommand, command) => {
    execCommand(wss, 'say test')
})

// Schedule this for 23:44
scheduleJob({ hour: 23, minute: 44 }, (wss, execCommand) => {
    // execCommand(wss, command, sendToConsole?, alternativeMessage?)
    execCommand(wss, 'tellraw @a {"text":"[WARN] Automatic shutdown [WARN]","bold":true,"color":"gold"}', false,
        '[WARN] Automatic shutdown [WARN]')
    execCommand(wss, 'stop')
})

registerDataHandler((text, wss, execCommand) => {
    // new server log data handler
})
```
