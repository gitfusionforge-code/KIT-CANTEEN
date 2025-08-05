/**
 * Generates a unique 12-digit numeric order ID
 * Format: 123456789012 (12 digits total)
 * Uses only numbers for better compatibility and easier identification
 */
export function generateOrderId(): string {
  // Generate 8 random digits
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += Math.floor(Math.random() * 10).toString();
  }
  
  // Add 4 digits from timestamp for uniqueness
  const timestamp = Date.now();
  const timestampPart = (timestamp % 10000).toString().padStart(4, '0');
  
  return result + timestampPart;
}

/**
 * Validates if a string is a valid 12-digit numeric order ID
 */
export function isValidOrderId(orderId: string): boolean {
  const pattern = /^[0-9]{12}$/;
  return pattern.test(orderId);
}

/**
 * Formats order ID with highlighted last 4 digits for display
 * Returns object with formatted parts for UI highlighting
 */
export function formatOrderIdDisplay(orderId: string): { 
  prefix: string; 
  suffix: string; 
  full: string 
} {
  if (!orderId || orderId.length !== 12) {
    return { prefix: orderId || '', suffix: '', full: orderId || '' };
  }
  
  return {
    prefix: orderId.slice(0, 8),
    suffix: orderId.slice(8, 12),
    full: orderId
  };
}