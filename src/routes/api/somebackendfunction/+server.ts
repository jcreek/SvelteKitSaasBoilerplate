import { json } from '@sveltejs/kit';

export const GET = async () => {
	return json(await getSomeData());
};

async function getSomeData() {
	// Do your async fetching here
}
