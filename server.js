const express = require('express')
const WebSocket = require('ws')
const http = require('http')
const fs = require('fs')
const spawn = require('child_process').spawn
const app = express()
const schedule = require('node-schedule');
const config = require('./config.json')

const logs = config.serverDir + '/' + config.logsFile //'/home/perc/Desktop/maninland/logs/latest.log'

let registeredCommands = []

function registerCommand(regex, fn){
    registeredCommands.push({regex: regex, fn: fn})
}

let scheduledJobs = []

function scheduleJob(time, fn) {
    scheduledJobs.push({time, fn})
}

let dataHandlers = []

function registerDataHandler(fn) {
    dataHandlers.push(fn)
}

module.exports = {registerCommand, scheduleJob, registerDataHandler}

if (require.main === module) {

    for(let file of fs.readdirSync(__dirname + '/custom/')) {
        if(file.endsWith('.js')) require('./custom/' + file) // Only import js files
    }

    function sendData(wss, data) {
        if (wss.clients) {
            for (let ws of wss.clients) {
                ws.send(data)
            }
        }
    }
    
    function execCommand(wss, command, printToConsole = true, textToSend = '') {
        if (printToConsole) sendData(wss, ` > ${command}`)
        else if (textToSend !== '') sendData(wss, ` >>> ${textToSend}`)
        if (command === 'start') {
            startServer()
        } else {
            let executedCommand = false
            for(let registered of registeredCommands){
                //console.log(registered.regex)
                if(registered.regex.test(command)) {
                    registered.fn(wss, execCommand, command)
                    executedCommand = true
                    break
                }
            }
            // screen -S MinecraftServer -p 0 -X stuff "stop^M"
            if(!executedCommand) screen = spawn('screen', ['-S', 'MinecraftServer', '-p', '0', '-X', 'stuff', `/${command}^M`])
        }
    
        //screen.stdout.on('data', (data)=>console.stdout.write(data))
        //screen.on('close', (code)=>{console.log(`SCreen exited with code ${code}`)})
    }
    
    app.get('/', function (req, res) {
        res.sendFile(__dirname + '/web/index.html')
    })
    
    app.get('/:file', function (req, res) {
        res.sendFile(__dirname + '/web/' + req.params.file)
    })
    
    server = http.createServer(app)
    
    
    const wss = new WebSocket.Server({ server });
    
    wss.on('connection', (ws, req) => {
        //onsole.log(req)
        ws.on('message', (data) => {
            console.log(data);
            execCommand(wss, data);
        })
    
        lines = fs.readFileSync(logs).toString().split('\n')
    
        for (let line of lines) {
            ws.send(line)
        }
    
    })
    
    function tailLogs() {
        let tail = spawn('tail', ['-f', '-n0', logs])
        // console.log('ready')
    
        tail.stdout.on('data', (data) => {
            let text = data.toString().trim()
            // console.log('-')
    
            sendData(wss, text)
            console.log(text)

            for(let dataHandler of dataHandlers) {
                dataHandler(text, wss, execCommand)
            }
    
        })
    
        tail.stderr.on('data', (data) => {
            console.log(data.toString())
        })
    
        return tail
    }
    
    let tailLogsProcess = tailLogs()
    
    function startServer() {
        tailLogsProcess.kill()
        // screen -d -m -S MinecraftServer java -Xmx2G -Xms1G -jar forge-1.12.2-14.23.5.2847-universal.jar nogui
        screen = spawn('screen', ['-d', '-m', '-S', 'MinecraftServer', 'java', config.server.jvmArguments, '-jar', config.server.file, 'nogui', config.server.serverArguments].flat(), { cwd: '/home/perc/Desktop/maninland' })
        //screen.stdout.on('data', (data)=>console.log(data.toString()))
        //screen.stderr.on('data', (data)=>console.log(data))
        screen.on('close', (code) => { })
        setTimeout(() => {
            tailLogsProcess = tailLogs()
        }, 2000);
    }

    for(let job of scheduledJobs) {
        schedule.scheduleJob(job.time, job.fn.bind(null, wss, execCommand))
    }
    
    server.listen(3000)    
}

