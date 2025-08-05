/**
 * Generates a unique 12-digit alphanumeric order ID
 * Format: AAAABBBBCCCC (12 characters total)
 * Uses uppercase letters and numbers for better barcode compatibility
 */
export function generateOrderId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  
  // Generate 8 random characters
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  // Add 4 characters from timestamp for uniqueness
  const timestamp = Date.now().toString(36).toUpperCase();
  const timestampPart = timestamp.slice(-4).padStart(4, '0');
  
  // Ensure timestamp part only contains valid characters
  const validTimestampPart = timestampPart
    .split('')
    .map(char => chars.includes(char) ? char : chars[Math.floor(Math.random() * chars.length)])
    .join('');
  
  return result + validTimestampPart;
}

/**
 * Validates if a string is a valid 12-digit alphanumeric order ID
 */
export function isValidOrderId(orderId: string): boolean {
  const pattern = /^[A-Z0-9]{12}$/;
  return pattern.test(orderId);
}