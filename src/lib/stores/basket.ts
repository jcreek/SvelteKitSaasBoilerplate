import { writable } from 'svelte/store';

const loadInitialState = () => {
	// Check if localStorage is available (i.e., we're on the client side)
	if (typeof localStorage !== 'undefined') {
		const storedData = localStorage.getItem('basket');
		return storedData ? JSON.parse(storedData) : getDefaultState();
	} else {
		return getDefaultState();
	}
};

const getDefaultState = () => ({
	items: [],
	subtotal: 0
});

export const basket = writable(loadInitialState());

// Subscribe to changes in the store and update localStorage accordingly
if (typeof localStorage !== 'undefined') {
	basket.subscribe((value) => {
		localStorage.setItem('basket', JSON.stringify(value));
	});
}

export type Basket = {
	items: Item[];
	subtotal: number;
};

export type Item = {
	id: number;
	categoryDescription: string;
	name: string;
	imgAlt: string;
	imgSrc: string;
	price: number;
	priceId: string;
	quantity: number;
};
