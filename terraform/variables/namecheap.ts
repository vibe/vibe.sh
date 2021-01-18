import { TerraformVariable, Resource } from 'cdktf'
import { Construct } from 'constructs'







export class NamecheapEnv extends Resource {
  public config: {
    username: string,
    apiUser: string,
    token: string,
    ip: string,
    useSandbox: boolean
  }
  public value: any

  constructor(scope: Construct, id: string) {
    super(scope, id)

    const {
      NAMECHEAP_USERNAME,
      NAMECHEAP_API_USER,
      NAMECHEAP_API_TOKEN,
      NAMECHEAP_IP
     } = process.env


    const username = new TerraformVariable(this, 'namecheap-username', {
      type: 'string',
      default: NAMECHEAP_USERNAME,
      description: 'Username required for namecheap provider'
    });


    const apiUser = new TerraformVariable(this, 'namecheap-api-user', {
      type: 'string',
      default: NAMECHEAP_API_USER,
      description: 'Username required for namecheap provider'
    });



    const apiToken = new TerraformVariable(this, 'namecheap-api-token', {
      type: 'string',
      default: NAMECHEAP_API_TOKEN,
      description: 'API Token required for namecheap provider'
    });



    const ip = new TerraformVariable(this, 'namecheap-ip', {
      type: 'string',
      default: NAMECHEAP_IP,
      description: 'IP required for namecheap provider'
    });


    this.config = {
      username: username.value,
      apiUser: apiUser.value,
      token: apiToken.value,
      ip: ip.value,
      useSandbox: true,
    }



  }
 }