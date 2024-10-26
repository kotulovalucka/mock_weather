/**
 * Checks if an object has defined all values ( null and undefined )
 * @param obj
 * @returns
 */
export function checkDefinedValues<T extends object>(obj: T): boolean {
	for (const key in obj) {
		const value = obj[key];

		if (value === null || value === undefined) {
			return false;
		}

		if (typeof value === 'object' && !Array.isArray(value)) {
			if (!checkDefinedValues(value)) {
				return false;
			}
		}
	}

	return true;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
	return value !== null &&
		typeof value === 'object' &&
		!Array.isArray(value);
}

/**
 * Recursively compares two objects to ensure they have exactly the same keys at all levels
 * @param obj1
 * @param obj2
 * @returns boolean
 */
export function haveSameKeys<T extends object, U extends object>(obj1: T, obj2: U): boolean {
	const keys1 = new Set(Object.keys(obj1));
	const keys2 = new Set(Object.keys(obj2));

	if (keys1.size !== keys2.size) {
		return false;
	}

	for (const key of keys1) {
		if (!keys2.has(key)) {
			return false;
		}

		const val1 = obj1[key as keyof T];
		const val2 = obj2[key as keyof U];

		if (isPlainObject(val1) && isPlainObject(val2)) {
			if (!haveSameKeys(val1, val2)) {
				return false;
			}
		}
	}

	return true;
}
