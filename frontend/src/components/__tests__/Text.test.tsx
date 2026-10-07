import '@testing-library/jest-dom/vitest';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Text } from '../Text';

describe('Text Component', () => {
    it('me-render tag <p> sebagai default', () => {
        render(<Text>Teks Biasa</Text>);
        const element = screen.getByText('Teks Biasa');
        
        expect(element).toBeInTheDocument();
        expect(element.tagName.toLowerCase()).toBe('p');
    });

    it('me-render tag yang sesuai dengan properti "as"', () => {
        render(<Text as="h1">Judul Utama</Text>);
        const element = screen.getByText('Judul Utama');
        
        expect(element.tagName.toLowerCase()).toBe('h1');
    });

    it('menerapkan class varian warna dengan benar', () => {
        render(<Text color="danger">Teks Error</Text>);
        const element = screen.getByText('Teks Error');
        
        expect(element.className).toContain('text-red-600');
    });
});