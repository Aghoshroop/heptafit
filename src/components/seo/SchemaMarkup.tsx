import React from "react";

interface SchemaMarkupProps {
  schema: Record<string, any>;
}

/**
 * A reusable component to inject JSON-LD structured data into the <head> of a page.
 * Crucial for SEO, AEO (Answer Engine Optimization), and GEO (Generative Engine Optimization).
 */
export function SchemaMarkup({ schema }: SchemaMarkupProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
