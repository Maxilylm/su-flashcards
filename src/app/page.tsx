"use client";

import { useState } from "react";

interface Flashcard {
  question: string;
  answer: string;
}

function FlashcardItem({ card }: { card: Flashcard }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      onClick={() => setFlipped(!flipped)}
      className="cursor-pointer h-48"
      style={{ perspective: "1000px" }}
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 ${
          flipped ? "[transform:rotateY(180deg)]" : ""
        }`}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front - Question */}
        <div
          className="absolute inset-0 rounded-xl bg-zinc-800 border border-zinc-700 p-5 flex flex-col justify-center items-center text-center"
          style={{ backfaceVisibility: "hidden" }}
        >
          <span className="text-xs uppercase tracking-wider text-zinc-500 mb-2">
            Question
          </span>
          <p className="text-zinc-100 text-sm leading-relaxed">
            {card.question}
          </p>
        </div>
        {/* Back - Answer */}
        <div
          className="absolute inset-0 rounded-xl bg-zinc-700 border border-zinc-600 p-5 flex flex-col justify-center items-center text-center [transform:rotateY(180deg)]"
          style={{ backfaceVisibility: "hidden" }}
        >
          <span className="text-xs uppercase tracking-wider text-zinc-400 mb-2">
            Answer
          </span>
          <p className="text-zinc-100 text-sm leading-relaxed">{card.answer}</p>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [notes, setNotes] = useState("");
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate() {
    if (!notes.trim()) return;
    setLoading(true);
    setError("");
    setFlashcards([]);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      setFlashcards(data.flashcards);
    } catch {
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  }

  function handleCopyJSON() {
    navigator.clipboard.writeText(JSON.stringify(flashcards, null, 2));
  }

  return (
    <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-2">
        AI Flashcard Generator
      </h1>
      <p className="text-zinc-400 text-center mb-8">
        Paste your study notes and generate flashcards instantly
      </p>

      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Paste your study notes here..."
        rows={8}
        className="w-full rounded-xl bg-zinc-900 border border-zinc-700 p-4 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 resize-y text-sm"
      />

      <div className="flex items-center gap-3 mt-4">
        <button
          onClick={handleGenerate}
          disabled={loading || !notes.trim()}
          className="px-6 py-2.5 rounded-lg bg-zinc-100 text-zinc-900 font-medium text-sm hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Generating..." : "Generate Flashcards"}
        </button>
        <span className="text-xs text-zinc-500">
          {notes.length > 0 && `${Math.min(notes.length, 8000)} / 8000 chars`}
        </span>
      </div>

      {error && (
        <div className="mt-4 p-3 rounded-lg bg-red-900/30 border border-red-800 text-red-300 text-sm">
          {error}
        </div>
      )}

      {flashcards.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">
              {flashcards.length} Flashcards
            </h2>
            <button
              onClick={handleCopyJSON}
              className="px-4 py-1.5 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 text-sm hover:bg-zinc-700 transition-colors"
            >
              Copy as JSON
            </button>
          </div>
          <p className="text-xs text-zinc-500 mb-4">
            Click a card to flip it
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {flashcards.map((card, i) => (
              <FlashcardItem key={i} card={card} />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
