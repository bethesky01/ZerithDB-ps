"use client";

import { TiptapCodeFeatureExample } from "@/lib/TiptapCodeFeatureExample";

export default function TipTapPage() {
  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto">
      <div className="mb-8 space-y-3">
        <h1 className="text-3xl font-bold">TipTap Code-Block Example</h1>
        <p className="text-gray-600">
          This demo shows how to toggle a code block and update the editor content programmatically.
        </p>
      </div>

      <TiptapCodeFeatureExample />
    </main>
  );
}
