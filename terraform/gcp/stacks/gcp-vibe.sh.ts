import { TerraformStack } from 'cdktf'
import { Construct } from 'constructs'
import { GoogleProvider, ServiceAccount, Project, DataGoogleOrganization, ProjectService, ProjectIamMember } from '../.gen/providers/google';
import {  GsuiteProvider, User } from '../.gen/providers/gsuite'
import * as path from 'path'
import * as fs from 'fs'

export class GCPStack extends TerraformStack {
  constructor(scope: Construct, name: string) {
    super(scope, name)

    const credentialsPath = path.join(process.cwd(), 'google.json')
    const credentials = fs.existsSync(credentialsPath) ? fs.readFileSync(credentialsPath).toString() : '{}'

    new GoogleProvider(this, 'Google', {});
    new GsuiteProvider(this, 'vibe.sh-gsuite', {
      credentials,
      impersonatedUserEmail: 'root@vibe.sh',
      oauthScopes: [
        "https://www.googleapis.com/auth/admin.directory.group",
        "https://www.googleapis.com/auth/apps.groups.settings",
        "https://www.googleapis.com/auth/admin.directory.user",
        "https://www.googleapis.com/auth/admin.directory.userschema",
      ]
    })

    new User(this, 'root-user', {
      primaryEmail: 'root@vibe.sh',
      name: {
        given_name: 'Franco',
        family_name: 'Christian',
      },
      aliases: [
        "google@vibe.sh",
        "cloudflare@vibe.sh"
      ]
    })

    new User(this, 'devops-user', {
      primaryEmail: 'devops@vibe.sh',
      name: {
        given_name: 'dev',
        family_name: 'ops',
      }
    })

    const organization = new DataGoogleOrganization(this, 'vibe.sh-org', {
      domain: 'vibe.sh'
    })

    const project = new Project(this, 'vibe.sh', {
      name: 'vibesh-www',
      orgId: organization.orgId,
      projectId: 'vibesh',
    })

    new ProjectService(this, 'vibe.sh-enable-admin-sdk-api', {
      project: project.projectId,
      service: 'admin.googleapis.com'
    })

    new ServiceAccount(this, 'vibe.sh-service-account', {
      accountId: 'vibesh-service-account',
      displayName: "vibe.sh service account",
      project: project.projectId,
    })



    new ProjectIamMember(this, 'devops@vibe.sh', {
      project: project.projectId,
      member: "user:devops@vibe.sh",
      role: 'roles/iam.serviceAccountTokenCreator'
    })


  }
}