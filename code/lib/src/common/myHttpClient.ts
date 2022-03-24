import fetch from 'isomorphic-fetch';
import { from, Observable, throwError } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { EnumMyErrorType } from '..';
import { MyError } from './myError';

// 'json' | 'text' | 'blob' | 'arraybuffer' = 'json'
export type resType = 'json' | 'text';

export const contentTypeJsonHeaders = { 'Content-Type': 'application/json' };
export const contentTypeTextHeaders = { 'Content-Type': 'text/plain' };

const noCacheHeaders = {
	'Cache-Control': 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
	Pragma: 'no-cache',
	Expires: '0'
};

const checkStausAndHandleData = <T>(res: Response, resType: resType = 'json') => {
	if (res.ok) {
		// res.status >= 200 && res.status < 300
		if (resType === 'json') {
			return from<Promise<T>>(res.json());
		}
		if (resType === 'text') {
			return from<Promise<string>>(res.text());
		}
		const myError = new MyError(EnumMyErrorType.notSupportHttpContentType);
		return throwError(() => myError);
	} else {
		return from(res.json()).pipe(
			switchMap((info) => {
				// const myError = MyError.wrap(Error(info));
				return throwError(() => info);
			})
		);
	}
};

const getResult =
	<T>(resType: resType) =>
	(source: Observable<Response>) =>
		source.pipe(
			switchMap((res: Response) => checkStausAndHandleData<T>(res, resType)),
			map((data) => data)
		);

export const getHttpClient = <T>(
	url: string,
	options: { [key: string]: object | string } = { headers: {} },
	resType: resType = 'json'
) =>
	from(
		fetch(url, {
			method: 'GET',
			...options
		})
	).pipe(getResult<T>(resType));

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

export const postByUrlencodedHttpClient = <T>(
	url: string,
	body: { [key: string]: string },
	options: { [key: string]: object | string } = { headers: {} },
	resType: resType = 'json'
) => {
	const params = new URLSearchParams();
	for (const key in body) {
		params.append(key, body[key]);
	}
	return from(
		fetch(url, {
			method: 'POST',
			...options,
			body: params
		})
	).pipe(getResult<T>(resType));
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

	return from(
		fetch(url, {
			method: 'POST',
			...options,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			body: data as any
		})
	).pipe(getResult<T>(resType));
};

export const postHttpClient = <T>(
	url: string,
	body: object,
	options: { [key: string]: object | string } = { headers: {} },
	resType: resType = 'json'
) =>
	from(
		fetch(url, {
			method: 'POST',
			...options,
			body: JSON.stringify(body)
		})
	).pipe(getResult<T>(resType));

export const patchHttpClient = <T>(
	url: string,
	body: object,
	options: { [key: string]: object | string } = { headers: {} },
	resType: resType = 'json'
) =>
	from(
		fetch(url, {
			method: 'PATCH',
			...options,
			body: JSON.stringify(body)
		})
	).pipe(getResult<T>(resType));

export const putHttpClient = <T>(
	url: string,
	body: object,
	options: { [key: string]: object | string } = { headers: {} },
	resType: resType = 'json'
) =>
	from(
		fetch(url, {
			method: 'PUT',
			...options,
			body: JSON.stringify(body)
		})
	).pipe(getResult<T>(resType));

export const delHttpClient = <T>(
	url: string,
	options: { [key: string]: object | string } = { headers: {} },
	resType: resType = 'json'
) =>
	from(
		fetch(url, {
			method: 'DELETE',
			...options
		})
	).pipe(getResult<T>(resType));
