import fetch from 'isomorphic-fetch';
import { EnumMyErrorType, MyError } from './myError';

// 'json' | 'text' | 'blob' | 'arraybuffer' = 'json'
export type resType = 'json' | 'text';

export const contentTypeJsonHeaders = { 'Content-Type': 'application/json' };
export const contentTypeTextHeaders = { 'Content-Type': 'text/plain' };

const noCacheHeaders = {
	'Cache-Control': 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
	Pragma: 'no-cache',
	Expires: '0'
};

const checkStausAndHandleData = async <T>(res: Response, resType: resType = 'json') => {
	if (res.ok) {
		// res.status >= 200 && res.status < 300
		if (resType === 'json') {
			return res.json() as Promise<T>;
		}
		if (resType === 'text') {
			return res.text() as Promise<string>;
		}
		const myError = new MyError(EnumMyErrorType.notSupportHttpContentType);
		throw myError;
	} else {
		const jj = (await res.json()) as object;
		throw Error(JSON.stringify(jj));
	}
};

const getResult = <T>(res: Response, resType: resType) => checkStausAndHandleData<T>(res, resType);

export const getHttpClient = async <T>(
	url: string,
	options: { [key: string]: object | string } = { headers: {} },
	resType: resType = 'json'
) => {
	const res = await fetch(url, {
		method: 'GET',
		...options
	});
	return await getResult<T>(res, resType);
};

export const getByNoCacheHttpClient = <T>(
	url: string,
	options: { [key: string]: object | string } = { headers: {} },
	resType: resType = 'json'
) =>
	getHttpClient<T>(
		url,
		{
			...options,
			...{
				headers: {
					...noCacheHeaders,
					...(options['headers'] as object)
				}
			}
		},
		resType
	);

export const postByUrlencodedHttpClient = async <T>(
	url: string,
	body: { [key: string]: string },
	options: { [key: string]: object | string } = { headers: {} },
	resType: resType = 'json'
) => {
	const params = new URLSearchParams();
	for (const key in body) {
		params.append(key, body[key]);
	}

	const res = await fetch(url, {
		method: 'POST',
		...options,
		body: params
	});

	return await getResult<T>(res, resType);
};

export const postByFormDataHttpClient = async <T>(
	url: string,
	body: { [key: string]: string },
	options: { [key: string]: object | string } = { headers: {} },
	resType: resType = 'json'
) => {
	// https://muffinman.io/blog/uploading-files-using-fetch-multipart-form-data/
	//formData.append('file', fileInput.files[0]);
	const FormData = (await import('form-data')).default;
	const data = new FormData();
	for (const key in body) {
		const obj = body[key];
		data.append(key, obj);
	}

	const res = await fetch(url, {
		method: 'POST',
		...options,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		body: data as any
	});
	return await getResult<T>(res, resType);
};

export const postHttpClient = async <T>(
	url: string,
	body: object,
	options: { [key: string]: object | string } = { headers: {} },
	resType: resType = 'json'
) => {
	const res = await fetch(url, {
		method: 'POST',
		...options,
		body: JSON.stringify(body)
	});

	return await getResult<T>(res, resType);
};

export const patchHttpClient = async <T>(
	url: string,
	body: object,
	options: { [key: string]: object | string } = { headers: {} },
	resType: resType = 'json'
) => {
	const res = await fetch(url, {
		method: 'PATCH',
		...options,
		body: JSON.stringify(body)
	});

	return await getResult<T>(res, resType);
};

export const putHttpClient = async <T>(
	url: string,
	body: object,
	options: { [key: string]: object | string } = { headers: {} },
	resType: resType = 'json'
) => {
	const res = await fetch(url, {
		method: 'PUT',
		...options,
		body: JSON.stringify(body)
	});
	return await getResult<T>(res, resType);
};

export const delHttpClient = async <T>(
	url: string,
	options: { [key: string]: object | string } = { headers: {} },
	resType: resType = 'json'
) => {
	const res = await fetch(url, {
		method: 'DELETE',
		...options
	});
	return getResult<T>(res, resType);
};
