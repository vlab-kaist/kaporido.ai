import App from '@hancomeducation/bedrock'

declare const config: { version: string, commitHash: string, commitCount: number, buildDate: string };

App({
    config, port: 2000, name: 'kaporido', cb: async ({r}) => {

    }
}).then()

