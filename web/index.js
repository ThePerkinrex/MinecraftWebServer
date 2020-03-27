
function replaceAll(text, find, toReplace) {
    return text.split(find).join(toReplace)
}

function addSpan(text) {
    text = replaceAll(text, '[Server thread/INFO] [net.minecraft.server.dedicated.DedicatedServer]', '[Chat]')//text.replace('[Server thread/INFO] [net.minecraft.server.dedicated.DedicatedServer]', '[Chat]')
    let x = document.createElement('span')
    x.innerText = text
    document.querySelector('#terminal').appendChild(x)
    if (/\/WARN]/.test(text)) {
        x.classList.add('warn')
    } else if (/\/ERROR]/.test(text)) {
        x.classList.add('error')
    } else if (/\[Chat\]/.test(text)) {
        x.classList.add('chat')
    }

    x.scrollIntoView()
}

let history = []

let ws = new WebSocket("ws://" + window.location.host)
ws.onopen = () => {
    //ws.send('ALLO')
    input = document.querySelector('#prompt_input')

    let selected = 0
    input.onkeyup = (e) => {
        if (e.keyCode === 13) {
            ws.send(input.value)
            history.push(input.value)
            input.value = ''
            selected = 0
        } else if (e.keyCode === 38) {
            selected++
            if (selected > history.length) selected = history.length
            input.value = history[history.length - selected]

        } else if (e.keyCode === 40) {
            selected--
            if (selected <= 0) {
                selected = 0
                input.value = ''
            } else {
                input.value = history[history.length - selected]
            }


        }
        console.log(e.keyCode)
    }
}

ws.onmessage = (message) => {
    addSpan(message.data)
}
