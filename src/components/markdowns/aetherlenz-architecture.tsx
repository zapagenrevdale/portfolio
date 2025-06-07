const markdownContent = `# A Glimpse into AetherLenz's Architecture

## Introduction

Imagine visiting a breathtaking tourist attraction, getting your photo taken by a professional photographer — and then not having to wait in line, scramble for cash, or worry about missing the chance to grab that memory forever.

That’s the vision behind **AetherLenz** — a platform that lets tourists access and purchase their photos after visiting a destination. Powered by AI-based image recognition, the system automatically identifies and matches your photos without manual tagging or the need to buy on the spot. Whether you’re short on time or just want to decide later, AetherLenz makes it easy to retrieve your memories when it’s most convenient.

While my partner leads the business and product direction, I’ve been responsible for everything on the technical side — from frontend and backend development to CI/CD, infrastructure, and system architecture.

In this post, I’ll walk through how I designed and built a **robust, scalable, and cost-efficient** platform — and how a single engineer can power a production-grade startup from the ground up.

---
### The Three Faces & The Backbone of AetherLenz

AetherLenz is composed of three distinct web applications — each serving a different role in the ecosystem, but all working together to deliver a seamless experience for both tourists and professionals in the field.

### **Customer Site**

This is the main interface for tourists. Users can register, upload a reference selfie to help the AI model identify them, and later view and purchase photos where they’ve been automatically recognized.

Behind the scenes, AI-driven face recognition matches the user’s face against a large batch of uploaded photos from photographers — removing the need to sift through countless images or manually tag faces. It’s simple, private, and efficient.

### **Photographer Site**

This portal is designed for photographers working at tourist attractions. Once logged in, photographers can upload batches of photos they've taken throughout the day. These uploads are automatically associated with a specific folder or session based on what the Organizer has set up.

The system is built to handle large uploads reliably, and the backend ensures that every photo is processed and indexed for later AI analysis and matching.

### **Organizer Site**

Organizers are the people managing the operations at each attraction — often overseeing a team of photographers. From their dashboard, they can create "folders" or "sessions" for specific dates, times, or events. These folders act as containers that photographers upload to, helping maintain a clean structure for downstream processing.

This separation of roles allows AetherLenz to remain both scalable and operationally efficient — with each user group having a focused, purpose-built interface tailored to their needs.

### The Backbone: Ethereal

All three AetherLenz frontends — Customer, Photographer, and Organizer — are powered by a single backend service called **Ethereal**.

Ethereal serves as the main API layer. It handles user authentication, photo searches, session creation, and other request-response operations across the platform.

But here’s the important part: **Ethereal doesn’t handle any AI or media processing directly.**

Instead, AetherLenz is built on an **event-driven architecture**. When key actions occur — such as a customer uploading a selfie or a photographer submitting photos — Ethereal sends events to **AWS EventBridge**. From there, events are routed to specific **SQS queues**, which trigger background services that handle:

- Running face recognition and AI-based photo matching  
- Extracting metadata and validating image content  
- Preparing media for delivery (e.g., resizing, watermarking, generating secure access links)

By offloading all compute-heavy operations to this asynchronous pipeline, we keep Ethereal lightweight, responsive, and easy to maintain — while ensuring the platform can scale to process thousands of photos efficiently in the background.


\`\`\`mermaid
graph TD
    subgraph Vercel
        A[Customer Site]
        C[Photographer Site]
        D[Organizer Site]
    end

    subgraph AWS
        B[Ethereal API]
        E[SQS Queue]
        F[Async Lambda Tasks]
        G[S3]
        H[AI]
    end

    I[Supabase]

    A --> B
    C --> B
    D --> B

    B --> E
    E --> F
    F --> G
    F --> H
    F --> I


    B --> G
    B --> I
    
\`\`\`

## Wrapping Up

That’s as much as I can share (for now) about AetherLenz’s architecture — partly for security, and partly for **competitive reasons**, as some of the implementation details are core to how the system delivers its value.

If you're curious about how the technical foundation is structured — including our **monorepo setup**, **CI/CD setup**, and **infrastructure-as-code using SST** — you can check out a related post:  
👉 [OMNI: An Architecture Overview](/blogs/omni-architecture)

While both projects share similar foundations, there’s one key difference:  
For **AetherLenz**, we use [SST + AWS Lambda + Hono](https://sst.dev/docs/start/aws/hono/#serverless) to run **Ethereal** in a **fully serverless, scale-to-zero** setup — which is incredibly cost-efficient, especially compared to the long-running, container-based architecture used in Omni.

Thanks for reading, and stay tuned for more updates as we continue to build and scale!
`;

export default markdownContent;
