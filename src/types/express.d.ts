import type { Logger } from "pino";

type ValidatedRequestData = {
	body?: unknown;
	params?: unknown;
	query?: unknown;
};

declare global {
	namespace Express {
		interface Locals {
			requestId?: string;
			logger?: Logger;
			validated?: ValidatedRequestData;
		}
	}
}

export { };
