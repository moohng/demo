/**
 * Crypto utilities for secure API key storage
 * Uses Web Crypto API for encryption/decryption
 */

// Generate a device fingerprint for encryption key derivation
export function generateDeviceFingerprint(): string {
  const navigator = window.navigator;
  const screen = window.screen;
  
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.colorDepth,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    !!window.sessionStorage,
    !!window.localStorage,
  ].join('|');
  
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  return Math.abs(hash).toString(36);
}

// Derive a crypto key from the device fingerprint
async function deriveKey(fingerprint: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    encoder.encode(fingerprint),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );
  
  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encoder.encode('devgo-ai-salt'),
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

// Encrypt API key
export async function encryptAPIKey(apiKey: string): Promise<string> {
  try {
    const fingerprint = generateDeviceFingerprint();
    const key = await deriveKey(fingerprint);
    const encoder = new TextEncoder();
    const data = encoder.encode(apiKey);
    
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      data
    );
    
    // Combine IV and encrypted data
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encrypted), iv.length);
    
    // Convert to base64
    return btoa(String.fromCharCode(...combined));
  } catch (error) {
    console.error('Encryption failed:', error);
    throw new Error('Failed to encrypt API key');
  }
}

// Decrypt API key
export async function decryptAPIKey(encryptedKey: string): Promise<string> {
  try {
    const fingerprint = generateDeviceFingerprint();
    const key = await deriveKey(fingerprint);
    
    // Decode from base64
    const combined = Uint8Array.from(atob(encryptedKey), c => c.charCodeAt(0));
    
    // Extract IV and encrypted data
    const iv = combined.slice(0, 12);
    const data = combined.slice(12);
    
    const decrypted = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      data
    );
    
    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  } catch (error) {
    console.error('Decryption failed:', error);
    throw new Error('Failed to decrypt API key');
  }
}

// Validate if a string is a valid encrypted key
export function isEncryptedKey(value: string): boolean {
  try {
    // Check if it's valid base64
    atob(value);
    return value.length > 20; // Encrypted keys should be reasonably long
  } catch {
    return false;
  }
}
