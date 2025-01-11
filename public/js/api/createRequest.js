/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
	const xhr = new XMLHttpRequest();

	xhr.responseType = "json";

	const { url, data = {}, method = "GET", callback } = options;

	let finalUrl = url;
	let body = null;

	if (method === "GET") {
		const queryParams = new URLSearchParams(data).toString();
		if (queryParams) {
			finalUrl += `?${queryParams}`;
		}
	} else {
		body = new FormData();
		for (const key in data) {
			body.append(key, data[key]);
		}
	}

	xhr.addEventListener("load", () => {
		callback(null, xhr.response);
	});

	xhr.open(method, finalUrl);
	xhr.send(body);
};
