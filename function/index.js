// Create object outside of handler to reuse
const { parseForm, parseCSV, parseXML } = require('./parser');

// Handler
exports.handler = async function (event, context) {
	console.log('## ENVIRONMENT VARIABLES: ' + serialize(process.env));
	console.log('## CONTEXT: ' + serialize(context));
	console.log('## EVENT: ' + serialize(event));
	try {
		let parsedEvent = parseForm(event);
		console.log('## PARSED EVENT: ' + serialize(parsedEvent));
		let out = [];
		if (parsedEvent.file.contentType === 'text/csv') {
			out = parseCSV(parsedEvent.file.content);
		} else if (parsedEvent.file.contentType === 'text/xml') {
			out = parseXML(parsedEvent.file.content);
		} else {
			return formatError({ statusCode: 415, code: 415, message: 'Unsupported Media Type' });
		}

		const invalid = validateRecords(out);

		if (Object.keys(invalid).length === 0) {
			return formatResponse(serialize({ content: out }));
		} else {
			return formatResponse(serialize({ content: out, invalid }), 422);
		}
	} catch (error) {
		return formatError(error);
	}
};

const validateRecords = function (records) {
	// use bare js object as hashmap to detect duplicate reference
	let map = Object.create(null),
		invalid = Object.create(null);

	records.forEach((rec) => {
		// skip invalid record
		if (rec[0] in invalid) {
			return;
		}

		// check if reference is unique
		if (rec[0] in map) {
			invalid[rec[0]] = 'duplicate reference';
			return;
		}
		map[rec[0]] = rec;

		// check record balance
		// record format: [Reference, Account Number, Description, Start Balance, Mutation, End Balance]
		let startBalance = parseFloat(rec[3]),
			mutation = parseFloat(rec[4]),
			endBalance = parseFloat(rec[5]);
		if (isNaN(startBalance) || isNaN(mutation) || isNaN(endBalance)) {
			invalid[rec[0]] = 'invalid balance';
			return;
		}
		if (Math.round(startBalance * 100) + Math.round(mutation * 100) !== Math.round(endBalance * 100)) {
			invalid[rec[0]] = 'invalid balance';
		}
	});
	return invalid;
};

var formatResponse = function (body, statusCode = 200) {
	return {
		statusCode,
		headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
		isBase64Encoded: false,
		body,
	};
};

var formatError = function (error) {
	return {
		statusCode: error.statusCode || 500,
		headers: { 'Content-Type': 'text/plain', 'x-amzn-ErrorType': error.code, 'Access-Control-Allow-Origin': '*' },
		isBase64Encoded: false,
		body: error.code + ': ' + (error.message || ' something went wrong'),
	};
};

var serialize = function (object) {
	return JSON.stringify(object, null, 2);
};
