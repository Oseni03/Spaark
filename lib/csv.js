import Papa from "papaparse";

export const parseCSV = async (string) => {
	return new Promise((resolve, reject) => {
		Papa.parse(string, {
			header: true,
			skipEmptyLines: true,
			complete: (results) => {
				resolve(results.data);
			},
			error: (error) => {
				reject(error);
			},
		});
	});
};

/**
 * Parser for cases when we receive an array like structure f.e. in the LinkedIn Profile.csv import
 * @param csvEntry array-like entry such as [TAG:https://some.link,TAG:https://someother.link]
 * @returns
 */
export const parseArrayLikeCSVEntry = (csvEntry) =>
	csvEntry.replace(/^\[/, "").replace(/$]/, "").split(",");
