import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn utility function', () => {
  it('combines class names correctly', () => {
    const result = cn('text-red-500', 'bg-blue-500');
    expect(result).toContain('text-red-500');
    expect(result).toContain('bg-blue-500');
  });

  it('handles conditional classes correctly', () => {
    const result = cn('base', false && 'hidden', true && 'visible');
    expect(result).toBe('base visible');
  });

  it('merges tailwind conflicts appropriately', () => {
    // twMerge should resolve 'p-2 p-4' to 'p-4'
    const result = cn('p-2', 'p-4');
    expect(result).toBe('p-4');
  });
});
