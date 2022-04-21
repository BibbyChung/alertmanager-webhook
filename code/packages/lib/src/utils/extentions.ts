export {};

declare global {
	// to access the global type String
	interface Array<T> {
		limit(count: number): Array<T>;
		skip(count: number): Array<T>;
	}

	interface String {
		toNumber(defaultValue: number): number;
	}
}

Array.prototype.skip = function (count: number) {
	return this.filter((i: number) => {
		if (i > count - 1) {
			return true;
		}
		return false;
	});
};

Array.prototype.limit = function (count: number) {
	return this.filter((i: number) => {
		if (i <= count - 1) {
			return true;
		}
		return false;
	});
};
String.prototype.toNumber = function (defaultValue: number) {
	try {
		const v = parseFloat(this);
		if (isNaN(v)) return defaultValue;
		return v;
	} catch (ex) {
		return defaultValue;
	}
};
