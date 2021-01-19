import { TerraformStack } from 'cdktf'
import { Construct } from 'constructs'
import { wwwCNAMERootRecord } from '../../constructs/dns/www-cname-root'
import { googleSiteVerificationRecord } from '../../constructs/google-workspace/google-site-verification'
import { googleMXRecords } from '../../constructs/google-workspace/google-mail-mx-records'
import { DNSProviderType, Domain, RegistrarProviderType } from '../../constructs/domains/domain'
import { NamecheapEnv } from '../../variables/namecheap'
import { CloudflareEnv } from '../../variables/cloudflare'

export class VibeShStack extends TerraformStack {
  constructor(scope: Construct, name: string) {
    super(scope, name)

    new Domain(this, 'root-domain', {
      domain: 'vibe.sh',
      registrar: {
        type: RegistrarProviderType.namecheap,
        config: new NamecheapEnv(this, 'namecheap-env').config
      },
      dnsProvider: {
        type: DNSProviderType.cloudflare,
        config: new CloudflareEnv(this, 'cloudflare-env').config
      },
      records: [
        ...googleMXRecords,
        googleSiteVerificationRecord,
        wwwCNAMERootRecord,
      ]
    })

  }
}