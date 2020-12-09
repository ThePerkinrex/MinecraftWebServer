const fs = require('fs')
const readline = require('readline')
const path = require('path')

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const defaultConfig = {
    "logsFile": "logs/latest.log",
    "serverDir": "",
    "server": {
        "file": "",
        "jvmArguments": ["-Xmx2G", "-Xms1G"],
        "serverArguments": []
    }
}

if (!fs.existsSync('config.json')) {
    absolutePath()
}else {
    done()
}

function absolutePath() {
    rl.question('What is the absolute path of the server directory: ', (answer) => {
        if (fs.existsSync(answer)) {
            defaultConfig.serverDir = answer
            serverFile()
        } else {
            console.log('That is not a valid path')
            absolutePath()
        }
    })
}

function serverFile() {
    rl.question('What is the filename of the server file: ', (answer) => {
        if (fs.existsSync(path.join(defaultConfig.serverDir, answer))) {
            defaultConfig.server.file = answer
            saveConfig()
        } else {
            console.log('That is not a valid filename')
            serverFile()
        }
    })
}

function saveConfig() {
    fs.writeFileSync('config.json', JSON.stringify(defaultConfig))
    done()
}

function done() {
    console.log('Config correct, to change advanced settings go to the config.json file')
    process.exit(0)
}