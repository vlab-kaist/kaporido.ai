import App from '@hancomeducation/bedrock'
import {spawn} from 'child_process'

declare const config: { version: string, commitHash: string, commitCount: number, buildDate: string };

App({
    config, port: 5500, name: 'kaporido', cb: async ({ws}) => {
        ws('/game', (ws, req) => {
            const process = spawn('python3', ['./neopjuki/src/mcts.py', '--trials=1', '--workers=4', '--depth=1', '--io=True', '--p2e=True'], {})
            ws.onmessage = (e) => {
                process.stdin.write(e.data.toString() + '\n')
            }
            process.stdout.on('data', (data) => {
                data = data.toString().split('\n')
                for(const line of data) {
                    console.log(line)
                    if (line[0] !== '0' && line[0] !== '1' && line[0] !== '2' && line[0] !== '3') continue;
                    ws.send(line)
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

