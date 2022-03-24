const getRandomStringContent = (charStr: string, length: number) => {
	let result = '';
	const characters = charStr;
	const charactersLength = characters.length;
	for (let i = 0; i < length; i += 1) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
};

export const getUUIDEmpty = () => {
	return '00000000-0000-0000-0000-000000000000';
};

export const getUUID = () => {
	// return uuidv1();
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		const r = (Math.random() * 16) | 0,
			v = c == 'x' ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
};

export const sleep = async (ms: number) => {
	return new Promise<void>((resolve) => {
		setTimeout(() => {
			resolve();
		}, ms);
	});
};

export const groupBy = <K, V>(list: V[], keyGetter: (input: V) => K): Map<K, V[]> => {
	const map = new Map<K, Array<V>>();
	list.forEach((item) => {
		const key = keyGetter(item);
		const collection = map.get(key);
		if (!collection) {
			map.set(key, [item]);
		} else {
			collection.push(item);
		}
	});
	return map;
};

export const chunk = <T>(arr: T[], size: number) =>
	Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
		arr.slice(i * size, i * size + size)
	);


export const getRandomString = (length: number) => {
	const charStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	return getRandomStringContent(charStr, length);
};

export const getRandomNumber = (length: number) => {
	const charStr = '0123456789';
	return getRandomStringContent(charStr, length);
};

export const retryFunc = async (
	times: number,
	waitingMillisecond: number,
	func: (todoCount: number) => boolean | Promise<boolean>,
	todoCount = 1
) => {
	const residue = times - todoCount;
	if (residue < 0) {
		return;
	}
	const bo = await func(todoCount);
	if (bo) {
		return;
	}
	await sleep(waitingMillisecond);
	await retryFunc(times, waitingMillisecond, func, todoCount + 1);
};
