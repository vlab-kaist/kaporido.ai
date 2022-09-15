import App from '@hancomeducation/bedrock'
import {spawn} from 'child_process'

declare const config: { version: string, commitHash: string, commitCount: number, buildDate: string };

App({
    config, port: 5500, name: 'kaporido', cb: async ({ws}) => {
        ws('/game/:type', (ws, {params: {type}}) => {
            const process = spawn('python3', ['./neopjuki/src/mcts.py', '--trials=1', '--workers=12', '--debug', '--depth=1', '--io=True', ...(type === 'p2e' ? ['--p2e=True'] : [])], {})
            ws.onmessage = (e) => {
                process.stdin.write(e.data.toString() + '\n')
            }
            let buffer = '', timeout;
            process.stdout.on('data', (data) => {
                buffer += data
                for (const line of data.toString().split('\n')) {
                    if (line[0] !== '0' && line[0] !== '1' && line[0] !== '2' && line[0] !== '3') continue;
                    ws.send(line)

                    if (timeout) clearTimeout(timeout)
                    timeout = setTimeout(() => {
                        console.log(buffer)
                        buffer = ''
                    }, 200)
                }
            })
            process.stderr.on('data', (data) => {
                console.log(data.toString())
            })
            process.on('close', (code) => {
                console.log(code)
                ws.close()
            })
            ws.close = () => {
                process.kill()
            }
        })
    }
}).then()

