import { App } from 'cdktf'
import { VibeShStack } from './stacks/vibe.sh'

const app = new App()

new VibeShStack(app, 'vibe.sh')

app.synth()