const markdownContent = `# B2B SaaS: How I Automated Preview Deployments and On-Prem Delivery

## Introduction  

Recently, I was catching up with a friend working on their **startup**. They were facing a challenge that I **think a lot of early-stage SaaS companies run into** — no proper **CI/CD pipeline** and no way to spin up **PR preview deployments** for testing new features before merging them in.

That conversation got me thinking. At **AetherLenz** (a startup I co-founded), I’ve also been meaning to set up a clean **PR preview deployment workflow**. And while I was at it, I thought — why not build a small **proof-of-concept (POC)** that not only handles **preview deployments** but also covers **on-premise delivery** in a **lightweight**, **startup-friendly** way that’s **quick to ship** and **easy to maintain**?

## The Workflow

### Preview Deployment Workflow

Here's how the **PR preview deployment workflow** works:

When someone opens a **Pull Request (PR)** on GitHub, a **GitHub Actions Runner** triggers two main operations:

1. It connects to a **private self-hosted runner** inside our AWS environment to **create a copy of the dev database**. This ensures that any schema migrations or data changes for the PR won’t affect the shared dev environment.

2. It uses **SST** (via the GitHub Actions Runner) to **provision preview resources** for the **api**, **docs**, and **app** services in AWS.  

These services are routed through a **preview URL router** that handles traffic to the correct preview apps.  
> I based this routing setup on the [SST Router](https://sst.dev/docs/configure-a-router/) — a clean way to manage URLs for different preview environments.

Once the PR is **merged or closed**:
- A GitHub Actions workflow runs to **delete the preview database copy** (via the private runner).
- It then **deprovisions the cloud resources** through SST.

This way, every PR gets an isolated environment — fully provisioned cloud resources with a dedicated database — and everything is automatically cleaned up after.

You can see the full flow in this diagram:

![PR Preview Deployment Flow](/preview-deploy-cicd.png)


## On-Premise Delivery Workflow

Aside from cloud deployments, we also needed a simple and reliable way to deliver our services for **on-premise clients**. I designed a straightforward **Docker Compose-based workflow** to handle this.

Here’s how it works:

When a new version is **merged to **main**, a **production deployment workflow** is triggered. This workflow:

1. **Builds and pushes container images to GHCR**.
2. **Clients pull the latest images securely using their own Personal Access Token \(PAT\)**.
3. **Clients run a Docker Compose configuration** that spins up all necessary services.

Inside the **Docker Bridge Network**, an **Nginx Reverse Proxy** receives all external traffic and routes requests to the appropriate services:
- **api**
- **app**
- **docs**

All services can communicate over the bridge network by container name, making the setup clean and isolated.

You can see the full flow in this diagram:

\`\`\`mermaid
graph TD
  A[Merge to main] --> B[Trigger Production Deployment]
  B --> C[Build and Push Container Images to GHCR]
  C --> D[Clients Pull Latest Images via PAT]
  D --> E[Run Docker Compose with Services]

  subgraph "Docker BridgeNetwork"
    N[Nginx Reverse Proxy]
    API[API Service]
    APP[App Service]
    DOCS[Docs Service]

    N --> API
    N --> APP
    N --> DOCS
  end

  E --> N
\`\`\`


## Future Improvements & Summary

Since this is just a **proof-of-concept (POC)**, you can imagine there’s a lot more we could build on top of this. A couple of ideas I have in mind:

1. **Manual Trigger for Preview Deployments**  
   Right now, preview deployments happen automatically. It would be great to allow a **manual trigger option** where the user can choose between:
   - **Deploying to distributed cloud services** (like ECS, Lambda, S3, etc.)
   - Or **deploying Docker containers to EC2 instances or self-hosted servers** to fully mimic how the apps will behave in a client’s on-premise setup

2. **Add a Scalable Nginx + Docker Setup**  
   While Nginx is currently acting as a simple reverse proxy, we could enhance this by configuring **load balancing across multiple service containers** and introducing **horizontal scaling options** within the Docker Compose setup.

There are definitely other areas we could improve, like refining image versioning, adding monitoring, or introducing more advanced deployment automation — but for now, this feels like a **decent, practical workflow for an early-stage startup**.

It’s lightweight, quick to ship, and covers both **cloud preview deployments** and **on-premise delivery** without overcomplicating the process.

---

If you’re working on something similar or have clever ways to improve this workflow, I’d love to compare notes. Feel free to reach out!
`;

export default markdownContent;
