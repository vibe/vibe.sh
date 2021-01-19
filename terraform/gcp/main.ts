import { App } from 'cdktf'
import { GCPStack } from './stacks/gcp-vibe.sh'

const app = new App()

new GCPStack(app, 'gcp')

app.synth()