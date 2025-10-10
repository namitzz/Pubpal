import { describe, it, expect } from 'vitest';
import { generateJoinCode } from '@/lib/supabase';

describe('generateJoinCode', () => {
  it('should generate a code of correct length', () => {
    const code = generateJoinCode(6);
    expect(code).toHaveLength(6);
  });

  it('should generate only uppercase letters and numbers', () => {
    const code = generateJoinCode(10);
    expect(code).toMatch(/^[A-Z0-9]+$/);
  });

  it('should generate different codes on multiple calls', () => {
    const code1 = generateJoinCode();
    const code2 = generateJoinCode();
    // This could theoretically fail, but extremely unlikely with 6 chars
    expect(code1).not.toBe(code2);
  });
});
