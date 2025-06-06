const markdownContent = `# OMNI: An Architecture Overview 

## Introduction

**OMNI** is the central platform we use to power our ecommerce operations. It supports the entire lifecycle of online retail — from handling customer orders to managing warehouse fulfillment, promotions, inventory, and product content.

In this post, we’ll focus specifically on the **architecture behind how we deploy OMNI**, including our CI/CD pipeline and infrastructure setup.

### OMNI Structure: External vs. Internal

OMNI is divided into two main components:

- **OMNI-X (External)**: This is the public-facing API layer used by our ecommerce websites. It handles customer-facing operations such as browsing products, placing orders, and checking order status.

- **OMNI-I (Internal)**: This powers our internal tools and workflows. It supports content and catalog maintenance (ECM), inventory updates, promotions management, and other backend post-order operations handled by our teams.

\`\`\`mermaid
graph TD
    subgraph External
      C[Customers] --> W1[Ecommerce Site #1]
      C --> W2[Ecommerce Site #2]
      C --> W3[Ecommerce Site #3]
      W1 & W2 & W3 --> X[OMNI-X External API Layer]
    end

    subgraph Internal
      U[Internal User] --> I[OMNI-I Internal Tools]
    end

    X --> DB[Shared Database]
    I --> DB
\`\`\`

Both components share core infrastructure but are deployed and maintained independently to support different performance, security, and operational needs.

---

### Monorepo Setup

OMNI is maintained in a **monorepo**, which allows us to centralize all code for both external and internal services, shared libraries, infrastructure scripts, and CI/CD workflows.

This structure enables:
- Easier code sharing across teams
- Simplified dependency management
- Consistent tooling and standards (linting, formatting, etc.)
- Unified deployment workflows

Here’s an overview of our directory structure:


\`\`\`
.github/
└── workflows/
├── ci-dev.yml
├── ci-prod.yml
├── ci-func-dev.yml
├── ci-func-prod.yml
├── backup-db.yml
└── build-pr.yml

apps/
├── external/
├── internal/
└── functions/

infra/
└── stacks/ (SST-based IaC setup)

docker/
└── docker.external

scripts/
└── db-backup-seeder.sh

tooling/
├── eslint/
├── prettier/
├── github/
├── tailwind/
└── typescript/

packages/
├── aws/
├── db/
├── email/
├── payments/
├── schemas/
└── utils/
\`\`\`

- **.github/workflows/** – Contains all CI/CD pipelines:  
  - *ci-dev.yml* and *ci-prod.yml* deploy OMNI-X and OMNI-I to dev and prod environments  
  - *ci-func-dev.yml* and *ci-func-prod.yml* handle deployment of standalone Lambda functions  
  - *backup-db.yml* automates DB backup and migration  
  - *build-pr.yml* runs build, lint, and type checks for every pull request  

- **apps/** – Source code for OMNI services:  
  - *external/* – OMNI-X: public ecommerce APIs  
  - *internal/* – OMNI-I: internal tools and ECM-related APIs  
  - *functions/* – Lambda functions used by internal services (e.g., crons, webhook receivers)  

- **infra/** – Infrastructure as Code setup using [SST (Serverless Stack)](https://sst.dev/):  
  - Defines all infrastructure for OMNI ([Next.js](https://sst.dev/docs/start/aws/nextjs/#serverless), [Service](https://sst.dev/docs/component/aws/service), APIs, Lambdas, VPCs, Eventbridge, etc.)  
  - Used across environments for reproducible deployments and staging isolation  

- **docker/** – Contains Dockerfile.external, the blueprint for building and containerizing our OMNI-X (external) app.

- **scripts/** – Shell utilities like *db-backup-seeder.sh* for local DB setup  

- **tooling/** – Shared dev tooling:  
  - Code standards (*eslint/*, *prettier/*), TypeScript settings, Tailwind config, and GitHub composite actions  

- **packages/** – Shared libraries reused by all apps:  
  - *aws/* – AWS service wrappers  
  - *db/* – Database connection and query helpers  
  - *email/* – Email templates and sending logic  
  - *payments/* – Payment integrations (2C2P, Paymongo, Stripe)
  - *schemas/* – Shared type and validation schemas
  - *utils/* – Common utilities (e.g. currency formatting)

---

### CI/CD: Deployment Workflows

We use GitHub Actions to automate deployments across environments. Both **development** and **production** workflows follow the same structure and strategy:

#### ⚡ Parallel Jobs Across Regions

Each workflow deploys **OMNI-I (internal)** and **OMNI-X (external)** in parallel across our three active regions: **ph**, **sg**, and **my**. This ensures consistency, minimizes downtime, and reduces deployment time.

\`\`\`mermaid
graph TD
    A[Push to main branch] -->|Triggers| B[Production Deployment Workflow]
    B -->|Parallel execution| C[Internal Deploy Job]
    B -->|Parallel execution| D[External Deploy Job]
    
    C -->|Matrix strategy| E[PH Internal Deploy]
    C -->|Matrix strategy| F[SG Internal Deploy]
    C -->|Matrix strategy| G[MY Internal Deploy]
    
    D -->|Matrix strategy| H[PH External Deploy]
    D -->|Matrix strategy| I[SG External Deploy]
    D -->|Matrix strategy| J[MY External Deploy]
    
    E -->|Uses internal secrets| K[SST Deploy Internal Stack]
    F -->|Uses internal secrets| L[SST Deploy Internal Stack]
    G -->|Uses internal secrets| M[SST Deploy Internal Stack]
    
    H -->|Uses external secrets| N[SST Deploy External Stack]
    I -->|Uses external secrets| O[SST Deploy External Stack]
    J -->|Uses external secrets| P[SST Deploy External Stack]
\`\`\`



### Example Workflow: OMNI-X (External) CI/CD Dev Deployment

The following GitHub Actions workflow defines how we build, test, and deploy OMNI-X (our external ecommerce API) to all supported development regions (ph, sg, and my) in parallel. Each job sets up dependencies, performs linting and tests, and then deploys using SST.

\`\`\`yaml
  external-deploy:
    name: Deploy OMNI-X (External)
    runs-on: ubuntu-latest
    strategy:
      matrix:
        region: [ph, sg, my]  # Deploy across all supported regions in parallel
    environment: \${{ matrix.region }}-external-development
    env:
      # Environment variables and secrets required by OMNI-X
      # (e.g. database URL, Firebase keys, payment keys, etc.)
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Setup Tooling and Dependencies
        uses: ./tooling/github/setup

      - name: Run Linter
        run: |
          cd apps/external
          pnpm run lint

      - name: Run Tests
        run: |
          cd apps/external
          pnpm run test

      - name: Deploy to \${{ matrix.region }}-dev via SST
        env:
          NODE_ENV: production
        run: |
          cd infra
          export SST_STACK_NAME="external"
          npx sst deploy external --stage=\${{ matrix.region }}-dev
\`\`\`

---

## Infrastructure

### IaC & Why SST?

Our entire stack is declared as **Infrastructure-as-Code (IaC)** using [SST (Serverless Stack)](https://sst.dev/), built on top of the AWS Cloud Development Kit (CDK). We use **SST v2**, which provides a streamlined developer experience for deploying serverless applications on AWS.

We chose SST because it’s written in **TypeScript**, which aligns perfectly with our full-stack codebase. This means our developers use the same language across application code, infrastructure definitions, and CI/CD — enabling:

- *Type-safe infrastructure*  
- *Easier onboarding and cross-functional development*  
- *Consistent tooling and developer workflows*
- *Built-in live logs for real-time monitoring and debugging*

\`\`\`mermaid
graph LR
    SST[SST Service Definition] -->|Generates| CF[AWS CloudFormation]
    CF -->|Creates| RES[All Resources]
\`\`\`

### Infra: OMNI-X (External)

OMNI-X is a [**Hono**](https://hono.dev/) application that we containerized using Docker ([see SST’s Hono Docker guide](https://sst.dev/docs/start/aws/hono/#6-deploy-your-app-1)) for deployment on AWS.  

We used [SST](https://sst.dev/) to manage the deployment on **ECS with Fargate**, which handles container orchestration, scaling, and infrastructure provisioning. Everything — from the VPC and subnets to the load balancer, task definitions, and ECS service — is defined in **TypeScript**, keeping our infrastructure tightly aligned with our application code.

Here’s a high-level diagram of the OMNI-X infrastructure:

\`\`\`mermaid
graph TD
    A[Build Docker Image - Hono App] --> B[Push Image to ECR]
    B --> C[Create ECS Task Definition]
    C --> D[ECS Service Deployment via SST Service]
    D -->|Fargate Launch| E[Run Container on AWS-managed Infra]

    subgraph Networking
      N1[VPC]
      N1 --> N2[Public Subnets]
      N1 --> N3[Private Subnets]
      N1 --> N4[Security Groups]
      N2 --> N5[Internet Gateway]
      N2 --> NGW[NAT Gateway]
    end

    %% ALB and Target Group
    H[Application Load Balancer] -->|Routes to| G[Target Group]
    G -->|Traffic to| E

    %% Public Access Flow
    subgraph Public Access
      H --> I[HTTPS Listener]
      I --> J[SSL Certificate]
      H --> K[Public ALB DNS]
      K --> L[Route 53 Alias]
      L --> M[Public HTTPS URL]
      M --> N[Users]
    end

    %% Placement
    N2 -->|Place| H
    N3 -->|Place| E

    %% Security Group connections (implicit)
    note[Security Groups attached to both ALB and Fargate Tasks]:::note

    %% Outbound Traffic
    E -->|Outbound via Private Subnet| NGW
    NGW -->|Via Internet Gateway| N5
    N5 -->|Internet| Internet[Internet]

\`\`\`

While this setup may look complex, SST’s high-level [**Service construct**](https://sst.dev/docs/component/aws/service/) abstracts away much of the heavy lifting. It simplifies the provisioning of ECS services, ALB integration, and secure networking — letting us focus on shipping features instead of managing infrastructure.

Here’s the actual SST stack configuration we use to deploy OMNI-X: 
\`\`\`typescript
export function OmniExternal({ stack }: StackContext) {
  const { region, stage } = splitAndValidateStageRegion(stack.stage);
  const { zone, domain } = getDomainConfigs({region, stage})

  const resource: Partial<ServiceProps> =
    stage === "prod"
      ? {
          cpu: "1 vCPU",
          memory: "2 GB",
        }
      : {};

  const service = new Service(stack, "service", {
    ...resource,
    path: "../",
    file: "docker/Dockerfile.external",
    port: 3000,
    customDomain: {
      hostedZone: zone,
      domainName: domain,
    },
    cdk: {
      vpc: internalVpc(stack),
      applicationLoadBalancer: {
        vpcSubnets: { subnets: publicSubnets(stack) },
      },
      fargateService: {
        securityGroups: [internalSg(stack)],
        vpcSubnets: { subnets: privateSubnets(stack) },
        circuitBreaker: {
          enable: true,
          rollback: true,
        },
      },
    },
    environment: {
      // environment variables
    },
    permissions: ["ses"],
  });

  stack.addOutputs({
    "omni-external-url": service.customDomainUrl ?? service.url,
  });

  return service;
}
\`\`\`


### Infra: OMNI-I (Internal)

OMNI-I is a Next.js application deployed using the **OpenNext architecture** — an open-source solution optimized for deploying Next.js apps on AWS. 

Just like OMNI-X, the entire infrastructure is defined with TypeScript using SST, making the developer experience seamless from application code to deployment.

[OpenNext Architecture](https://opennext.js.org/aws/inner_workings/architecture)
![OpenNext Architecture](https://opennext.js.org/architecture.png)

Fortunately, SST provides a high-level [**Next.js construct**](https://sst.dev/docs/start/aws/nextjs/#serverless) that wraps the OpenNext deployment flow. All we needed to do was configure VPC settings, attach the custom domain, and tweak caching policies to match our performance requirements:

\`\`\`typescript
export function OmniInternal({ stack }: StackContext) {
  const { region, stage } = splitAndValidateStageRegion(stack.stage);
  const { zone, domain } = getDomainConfigs({ stage, region });

  const site = new NextjsSite(stack, "nextjs", {
    path: "../apps/internal",
    runtime: "nodejs20.x",
    warm: 1,
    customDomain: {
      hostedZone: zone,
      domainName: domain,
    },
    experimental: { streaming: true },
    timeout: "60 seconds",
    cdk: {
      serverCachePolicy: new cf.CachePolicy(stack, "server-cache-policy", {
        queryStringBehavior: cf.CacheQueryStringBehavior.all(),
        headerBehavior: cf.CacheHeaderBehavior.none(),
        cookieBehavior: cf.CacheCookieBehavior.none(),
        defaultTtl: core.Duration.days(0),
        maxTtl: core.Duration.days(365),
        minTtl: core.Duration.days(0),
      }),
      server: {
        // vpc settings
      },
    },
    environment: {
      // environment variables
    },
    permissions: ["s3", "ses", "secretsmanager"],
  });

  stack.addOutputs({
    "omni-internal-url": site.customDomainUrl ?? site.url,
  });

  return site;
}
\`\`\`


## Thoughts & Takeaways

Setting up this kind of architecture is surprisingly smooth — **as long as you take time to understand what’s happening under the hood**. The services and tools (SST, OpenNext, Fargate) do a lot for you, but knowing how they work makes the whole process not just manageable, but **genuinely enjoyable**.

- **Same language, end-to-end:** TypeScript powers everything—from app logic to infrastructure—so engineers can stay in one mental model across the stack.  
- **Region-parallel CI/CD:** GitHub Actions + SST let us deploy to multiple regions in parallel, shrinking release time and reducing risk.  
- **Managed, not manual:** SST’s high-level constructs (like *Service* and *NextjsSite*) abstract away complex AWS wiring, so we can focus on features instead of boilerplate.  
- **Scalable & cost-efficient:** OMNI-X runs on ECS Fargate, while OMNI-I leverages the OpenNext serverless architecture—giving us scalable performance without the hassle of server management or over-provisioning.
`;

export default markdownContent;
