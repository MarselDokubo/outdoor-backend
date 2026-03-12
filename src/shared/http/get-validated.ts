export function getValidatedBody<T>(locals: Express.Locals): T {
	return locals.validated?.body as T;
}

export function getValidatedParams<T>(locals: Express.Locals): T {
	return locals.validated?.params as T;
}

export function getValidatedQuery<T>(locals: Express.Locals): T {
	return locals.validated?.query as T;
}
