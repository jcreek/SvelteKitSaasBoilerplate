type RateLimitStore = {
	[key: string]: { count: number; lastRequest: number };
};

const rateLimitStore: RateLimitStore = {};
const RATE_LIMIT_WINDOW = 60 * 5000; // 5 minutes
const MAX_REQUESTS = 5;

export function isRateLimited(ip: string): boolean {
	const currentTime = Date.now();
	const requestInfo = rateLimitStore[ip];

	if (!requestInfo) {
		rateLimitStore[ip] = { count: 1, lastRequest: currentTime };
		return false;
	}

	if (currentTime - requestInfo.lastRequest > RATE_LIMIT_WINDOW) {
		rateLimitStore[ip] = { count: 1, lastRequest: currentTime };
		return false;
	}

	if (requestInfo.count >= MAX_REQUESTS) {
		return true;
	}

	rateLimitStore[ip].count += 1;
	rateLimitStore[ip].lastRequest = currentTime;
	return false;
}
