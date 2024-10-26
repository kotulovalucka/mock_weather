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
