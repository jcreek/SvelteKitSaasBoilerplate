import { writable } from 'svelte/store';

export const general = writable({ hideToast: true, toastMessage: '', toastType: 'success' });
