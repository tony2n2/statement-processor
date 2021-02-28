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
		}
		return formatResponse(serialize(out));
	} catch (error) {
		return formatError(error);
	}
};

var formatResponse = function (body) {
	var response = {
		statusCode: 200,
		headers: {
			'Content-Type': 'application/json',
		},
		isBase64Encoded: false,
		multiValueHeaders: {
			'X-Custom-Header': ['My value', 'My other value'],
		},
		body: body,
	};
	return response;
};

var formatError = function (error) {
	var response = {
		statusCode: error.statusCode,
		headers: {
			'Content-Type': 'text/plain',
			'x-amzn-ErrorType': error.code,
		},
		isBase64Encoded: false,
		body: error.code + ': ' + error.message,
	};
	return response;
};

var serialize = function (object) {
	return JSON.stringify(object, null, 2);
};
