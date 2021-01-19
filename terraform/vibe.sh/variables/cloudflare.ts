import { TerraformVariable, Resource } from 'cdktf'
import { Construct } from 'constructs'

export class CloudflareEnv extends Resource {
  public config: {
    email: string,
    apiKey: string,
  }
  public value: any

  constructor(scope: Construct, id: string) {
    super(scope, id)

    const {
      CLOUDFLARE_EMAIL,
      CLOUDFLARE_API_KEY
     } = process.env


    const email = new TerraformVariable(this, 'cloudflare-email', {
      type: 'string',
      default: CLOUDFLARE_EMAIL,
      description: 'Email required for cloudflare provider'
    });


    const apiKey = new TerraformVariable(this, 'cloudflare-api-key', {
      type: 'string',
      default: CLOUDFLARE_API_KEY,
      description: 'API Key required for cloudflare provider'
    });


    this.config = {
      email: email.stringValue,
      apiKey: apiKey.stringValue,
    }
  }
 }
