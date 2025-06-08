const markdownContent = `# Lazy Reader: How I Built a Smarter, Shorter Way to Read Blogs

## Introduction  

I’ve been meaning to read more blogs. Stuff like [Paul Graham’s essays](https://paulgraham.com/articles.html) — those timeless tech and startup write-ups people always reference. But let’s be honest: unless it’s super short, I usually don’t have the time (or patience) to actually sit down and read them.  

The thought crossed my mind: *“Wouldn’t it be nice if I could just get the core message of these blogs during my short breaks?”* Like while drinking my favorite drinks, or just taking a few minutes to chill between tasks.  

That’s when the idea hit me — **what if I just built something for myself?**  

Even better, it was perfect timing because I had a tech talk coming up next Friday about **event-driven architecture**. This could be a cool, real-world example to tie into my talk.  

So I spared a few hours on my weekend, fired up my laptop, and built [**Lazy Reader**](https://lazy-reader.genrevzapa.com).


### Why Lazy Reader?  

A big limitation I ran into with tools like ChatGPT is that they can’t directly visit blogs and read their content. You have to copy-paste text manually, which isn’t ideal for quick, casual use.  

Plus, existing tools like NotebookLM often produce limited formats — like a two-person podcast — and don’t give you much control over the voice, tone, or style of the summary.  

I wanted something more flexible, where eventually I could create my own **personalized voice to read the summaries**, and fine-tune how the summarized content is **presented to match my preferences**.  

For now, I kept the flow simple: you give it a URL, it scrapes the blog, summarizes it, converts it into audio, and generates a related image.


### How I Did It  

Before jumping into code, the first thing I did was open up [**Excalidraw**](https://excalidraw.com/) and sketch out the app’s architecture. I wanted a clear reference of how everything would connect — especially since this was going to be a quick weekend build and I didn’t want to get lost halfway through.  

Once the architecture was in place, I decided on the tech stack. Since I was crunched for time, I went with tools that could help me move fast:

- [**Next.js**](https://nextjs.org/) for the frontend  
- [**Supabase**](https://supabase.com/) for storing data — no need to spin up my own backend for this  
- **AWS** (via **SST**) to set up the event-driven architecture for the heavy lifting: scraping blog content, summarizing, generating images, and converting text to audio  

The rest was just about **translating the sketch into actual code**.


### How It Works (System Architecture)
**Here’s the architecture diagram I sketched in [Excalidraw](https://excalidraw.com/):**

![Lazy Reader Architecture](/lazy-reader-architecture.png)

Here’s a quick step-by-step of how Lazy Reader processes a blog URL behind the scenes:

1. **User submits a blog URL** from the Lazy Reader web app.  
   → The app sends a *{uid, url}* payload to an **API Gateway** endpoint.

2. **API Gateway** triggers a **Lambda function** (**main**) that:
   - Stores the *id* and *url* in **Supabase**
   - Publishes a *scrape-request* event to **EventBridge**

3. **Scraping Lambda** listens for *scrape-request* events:
   - Uses **Puppeteer** (a headless browser) to scrape the blog content  
   - Stores the raw content in **S3**
   - Publishes a *summary-request* event to **EventBridge**

4. **Summarizer Lambda** listens for *summary-request* events:
   - Generates a summary using an **LLM (Large Language Model)**
   - Publishes a *summary-ready* event

5. **TTS (Text-to-Speech) Lambda** and **Image Generation Lambda** listen for *summary-ready* events:
   - **TTS Lambda** converts the summary into audio and saves it to **S3**
   - **Image Lambda** generates an image based on the summary and saves it to **S3**

6. **Supabase** acts as the app's database and provides real-time updates to the frontend by:
   - Notifying the frontend when the summary, audio, and image are ready  
   - This is done using [Supabase Realtime](https://supabase.com/docs/guides/realtime), which lets the frontend *subscribe to changes* in the database

7. **Frontend subscribes** for changes and displays the final result:  
   → A summarized blog you can read, listen to, and view an AI-generated image for.

---

### Why Event-Driven and Not Traditional Request-Response?

You might wonder — why not just have the frontend call an API, which scrapes, summarizes, and returns the result in one go?  

Well, the issue is that this flow involves multiple time-consuming, failure-prone steps:
- Scraping a blog using **Puppeteer** can take several seconds (or timeout)
- Summarizing via an **LLM** isn’t instant either
- Generating audio and images adds additional delays

If you tried to handle this in a traditional request-response pattern:
- The client would have to wait for the entire pipeline to finish
- You’d risk timeouts or blocked resources
- No clean way to retry individual failed steps without restarting the whole chain

**Event-driven architecture solves this elegantly:**
- Each step in the process (scraping, summarizing, generating assets) publishes an *event* when it finishes.
- Other services listen for those events and pick up the next task.
- It decouples services so they can scale, fail, and retry independently.
- The frontend doesn’t need to poll or wait around — it just *subscribes to real-time updates* via **Supabase Realtime** and reacts when the job status changes.

This pattern made the system way more resilient, scalable, and maintainable — especially for something I built in a few spare hours over a weekend.

---

### Conclusion & How I Wired Everything Together

That wraps up my little weekend experiment with **Lazy Reader**.  
If you’re curious about how I wired everything together, feel free to check out the repository here:

👉 [**GitHub: zapagenrevdale/lazy-reader**](https://github.com/zapagenrevdale/lazy-reader)

Inside, you’ll find the infrastructure definitions, Lambda handlers, and frontend logic.

---

### What’s Next

Right now, Lazy Reader is a functional but minimal MVP. A bunch of improvements are already on my backlog:

- **Infra upgrades:**  
  Add things like **dead-letter queues (DLQ)** for failed events, more granular retries, and monitoring.

- **Voice customization:**  
  Let users choose different voice styles, tones, and even emotions for the audio summary. Planning to integrate **[ElevenLabs](https://elevenlabs.io/)** for high-quality, expressive voices.

- **Personalized summary styles:**  
  Some users might want a *tweet-length TL;DR*, while others prefer a *bullet-point breakdown*. I’d love to give people options.

- **Multiple AI integrations:**  
  Right now it’s hooked up to **OpenAI**, but I’m eyeing:
  - **MidJourney** or **[Ideogram](https://ideogram.ai/)** for image generation  
  - **[Captions Mirage](https://www.captions.ai/mirage)** or **Veo 3** for video generation (once API access opens up)  

---

**Also — I’m still deciding if I should make this a free-for-all where users can plug in their own API keys, or turn it into a proper paid SaaS down the line.**  

Would love to hear thoughts on that too.

Cheers, and happy lazy reading ✌️
`;

export default markdownContent;
