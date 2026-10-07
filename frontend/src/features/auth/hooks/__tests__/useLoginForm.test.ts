import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLoginForm } from '../useLoginForm';

const mockMutate = vi.fn();
vi.mock('../useLoginQueries', () => ({
    useLoginMutation: () => ({
        mutate: mockMutate,
        isPending: false,
        isError: false,
        error: null,
    }),
}));

describe('useLoginForm Hook', () => {
    it('menginisialisasi email dan password kosong', () => {
        const { result } = renderHook(() => useLoginForm());
        
        expect(result.current.email).toBe('');
        expect(result.current.password).toBe('');
    });

    it('mengubah state email dan password saat diketik', () => {
        const { result } = renderHook(() => useLoginForm());
        
        act(() => {
            result.current.setEmail('operator@test.com');
            result.current.setPassword('rahasia123');
        });
        
        expect(result.current.email).toBe('operator@test.com');
        expect(result.current.password).toBe('rahasia123');
    });

    it('memanggil fungsi mutate dengan data yang benar saat disubmit', () => {
        const { result } = renderHook(() => useLoginForm());
        
        act(() => {
            result.current.setEmail('yasha@thabig.com');
            result.current.setPassword('passwordku');
        });
        
        const mockEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;
        
        act(() => {
            result.current.handleSubmit(mockEvent);
        });
        
        expect(mockEvent.preventDefault).toHaveBeenCalled();
        expect(mockMutate).toHaveBeenCalledWith({
            email: 'yasha@thabig.com',
            password: 'passwordku',
        });
    });
});