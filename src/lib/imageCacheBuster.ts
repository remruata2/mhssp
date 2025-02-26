export function cacheBusterUrl(url: string): string {
	const timestamp = new Date().getTime();
	const separator = url.includes("?") ? "&" : "?";
	return `${url}${separator}t=${timestamp}`;
}
