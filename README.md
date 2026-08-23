# FlashForge

> Paste study notes and get a deck of flippable question-and-answer flashcards.

**[Live demo](https://su-flashcards.vercel.app)**

Turning a page of lecture notes into flashcards is the slow part of studying. FlashForge takes a raw notes paste, truncates it to 8,000 characters, and sends it to Llama 3.3 on Groq with instructions to return a JSON array of question/answer pairs — between 5 and 15 cards depending on how much content there is. The cards render as a responsive grid, each one a CSS 3D card that flips from question to answer on click.

## Features

- Generates 5–15 flashcards from pasted notes, scaled to the length of the input
- Click-to-flip cards with a 3D rotate transition, question on the front and answer on the back
- Live character counter against the 8,000-character cap
- "Copy as JSON" export of the whole deck for use in other tools
- Salvages malformed model output by extracting the JSON array from the response before failing
- Responsive grid: one, two, or three columns by viewport width

## Stack

- Next.js 16 (App Router) with React 19 and TypeScript
- Tailwind CSS v4
- Groq API — `llama-3.3-70b-versatile`

## Running locally

```bash
npm install
npm run dev
```

Requires `GROQ_API_KEY` in `.env.local` (see `.env.example`).

---

Part of a series of 91 small web apps. [Browse them all](https://su-slopmachine.vercel.app).
