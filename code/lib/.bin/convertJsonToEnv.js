const { readFileSync, writeFileSync } = require('fs');

const getJsonObj = async (jsonFilePath) => {
	const jsonString = await readFileSync(jsonFilePath, 'utf8');
	const configObject = JSON.parse(jsonString);

	if (configObject) {
		return configObject;
	}

	throw new Error(
		'Please provide a path to a json file to parse\n\nExample: deno json_to_dotenv.ts path/to/file.json'
	);
};

const parseKeyValuePairs = (json, prefix) => {
	const keyValuePairs = Object.keys(json).reduce((pairs, key) => {
		const value = json[key];

		const displayKey = (prefix ? `${prefix}_${key}` : key).toUpperCase();

		if (
			value === null ||
			typeof value === 'string' ||
			typeof value === 'number' ||
			typeof value === 'boolean'
		) {
			pairs.push([displayKey, `${value}`]);
		} else if (Array.isArray(value)) {
			pairs.push([displayKey, value.join(',')]);
		} else if (typeof value === 'object') {
			pairs = pairs.concat(parseKeyValuePairs(value, displayKey));
		}

		return pairs;
	}, []);

	return keyValuePairs;
};

const convertJsonToEnv = async (configObj) => {
	const keyValuePairs = parseKeyValuePairs(configObj);
	return keyValuePairs.map((kayValuePair) => `${kayValuePair[0]}=${kayValuePair[1]}`).join('\n');
};

const main = async () => {
	// prepare data
	const args = process.argv.slice(2);
	const jsonFilePath = args[0];
	const envFilePath = args[1];

	// convert jsonObject to envString
	const jsonObj = await getJsonObj(jsonFilePath); //?
	const envStr = await convertJsonToEnv(jsonObj); //?

	// write string into the file
	writeFileSync(envFilePath, envStr + '\n');
};

main();
