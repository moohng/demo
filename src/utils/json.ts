/**
 * JSON utilities
 */

/**
 * Cleans a JSON string returned by an AI model.
 * Removes markdown code blocks (```json ... ```) and whitespace.
 */
export function cleanJSON(text: string): string {
  let cleaned = text.trim();
  
  // Remove markdown code blocks if present
  if (cleaned.startsWith('```')) {
    // Remove opening ```json or ```
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '');
    // Remove closing ```
    cleaned = cleaned.replace(/\s*```$/, '');
  }
  
  return cleaned;
}
