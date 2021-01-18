import { Resource, TerraformProvider } from 'cdktf'
import { Construct } from 'constructs'
import { NamecheapProvider, Ns } from '../../.gen/providers/namecheap';
import { CloudflareProvider, RecordA, Zone } from '../../.gen/providers/cloudflare';

export enum RegistrarProviderType {
  namecheap
}

export enum DNSProviderType {
  cloudflare
}

interface Registrar {
  type: RegistrarProviderType,
  config: any
}
interface DNSProvider {
  type: DNSProviderType,
  config: any
}
interface DomainConfig {
  domain: string,
  registrar: Registrar,
  dnsProvider: DNSProvider,
  records: any[]
}

export class Domain extends Resource {
  private _config: DomainConfig;
  public domain: string;

  protected registrarProvider: NamecheapProvider | TerraformProvider;
  protected dnsProvider: CloudflareProvider | TerraformProvider;

  protected dnsZone: Zone;
  protected nameservers: Ns;
  protected records: any[];

  public get config() {
    return this._config
  }

  constructor(scope: Construct, id: string, config: DomainConfig) {
    super(scope, id);
    this._config = config;

    this.domain = this.config.domain;

    this.registrarProvider = this.resolveRegistrar(this.config.registrar)
    this.dnsProvider = this.resolveDNSProvider(this.config.dnsProvider)

    this.dnsZone = this.resolveDNSZone(this.config.dnsProvider)
    this.nameservers = this.resolveNameservers(this.config.registrar)
    this.records = this.resolveRecords(this.config.dnsProvider, this.config.records)



  }



  protected resolveRegistrar(registrar: Registrar): TerraformProvider {
    const { type, config } = registrar;
    switch (type) {
      case RegistrarProviderType.namecheap:
        return new NamecheapProvider(this, 'namecheap-provider', config)
      default:
        throw Error(`Registrar provider type ${type} not implemented`)
    }
  }

  protected resolveDNSProvider(provider: DNSProvider): TerraformProvider {
    const { type, config } = provider;
    switch (type) {
      case DNSProviderType.cloudflare:
        return new CloudflareProvider(this, 'cloudflare-provider', config)
      default:
        throw Error(`DNS provider ${provider} not implemented`)
    }
  }

  protected resolveDNSZone(provider: DNSProvider) {
    const { type } = provider;
    switch (type) {
      case DNSProviderType.cloudflare:
        return new Zone(this, `dns-zone`, {
          zone: this.domain,
          provider: this.dnsProvider
        })
      default:
        throw Error(`DNS zone generation is not implemented for ${provider}`)
    }
  }

  protected resolveNameservers(provider: Registrar) {
    const { type } = provider;

    switch (type) {
      case RegistrarProviderType.namecheap:
        return new Ns(this, `${this.domain}-dns-zone`, {
          domain: this.domain,
          servers: this.dnsZone.nameServers
        })
      default:
        throw Error(`DNS zone generation is not implemented for ${provider}`)
    }
  }
  protected resolveRecords(provider: DNSProvider, records: any[]) {
    const { type } = provider;
    switch (type) {
      case DNSProviderType.cloudflare:
        return records.map((record, i) => new RecordA(this, `${this.domain}-dns-record-${i}`, {
          zoneId: this.dnsZone.id,
          ...record
        }))
      default:
        throw Error(`DNS zone generation is not implemented for ${provider}`)
    }
  }

}