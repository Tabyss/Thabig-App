import { describe, it, expect, beforeEach } from 'vitest';
import { useToastStore } from '../toast.store';

describe('Toast Store (Zustand)', () => {
    beforeEach(() => {
        useToastStore.setState({ toasts: [] });
    });

    it('memiliki state awal array kosong', () => {
        expect(useToastStore.getState().toasts).toHaveLength(0);
    });

    it('berhasil menambahkan toast baru dengan id acak', () => {
        useToastStore.getState().addToast({
            type: 'success',
            message: 'Berhasil Disimpan'
        });
        
        const toasts = useToastStore.getState().toasts;
        expect(toasts).toHaveLength(1);
        expect(toasts[0].message).toBe('Berhasil Disimpan');
        expect(toasts[0].type).toBe('success');
        expect(toasts[0]).toHaveProperty('id');
    });

    it('berhasil menghapus toast berdasarkan id', () => {
        const store = useToastStore.getState();
        
        store.addToast({ type: 'info', message: 'Test 1' });
        store.addToast({ type: 'error', message: 'Test 2' });
        
        let currentToasts = useToastStore.getState().toasts;
        expect(currentToasts).toHaveLength(2);
        
        const firstToastId = currentToasts[0].id;
        useToastStore.getState().removeToast(firstToastId);
        
        currentToasts = useToastStore.getState().toasts;
        expect(currentToasts).toHaveLength(1);
        expect(currentToasts[0].message).toBe('Test 2');
    });
});