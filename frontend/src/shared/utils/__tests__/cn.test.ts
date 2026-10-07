import { describe, it, expect } from 'vitest';
import { cn } from '../cn';

describe('Utility: cn (Tailwind Merge)', () => {
    it('menggabungkan class dasar dengan benar', () => {
        const result = cn('bg-red-500', 'text-white');
        expect(result).toBe('bg-red-500 text-white');
    });

    it('menyelesaikan konflik class Tailwind (twMerge)', () => {
        const result = cn('px-4 py-2', 'px-8');
        expect(result).toBe('py-2 px-8');
    });

    it('mengabaikan nilai falsy (clsx)', () => {
        const isError = false;
        const result = cn('btn', isError && 'bg-red-500', 'text-white');
        expect(result).toBe('btn text-white');
    });
});