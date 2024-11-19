import type { Toast } from '$lib/types/Shared/Toast';
import { writable } from 'svelte/store';

const MIN_DELAY = 3000;

export const toast = writable<Toast>({ hideToast: true, toastMessage: '', toastType: 'success' });
export function scheduleToast(message: string, toastType: 'success' | 'error', delay: number = MIN_DELAY) {
    
    toast.update((value) => {
        return {
            ...value,
            hideToast: false,
            toastMessage: message,
            toastType: toastType
        };
    });

    setTimeout(() => {
        toast.update((value) => {
            return { ...value, hideToast: true, toastMessage: '' };
        });
    }, Math.max(delay, MIN_DELAY));
}