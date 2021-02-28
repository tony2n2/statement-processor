// Create object outside of handler to reuse
const multipart = require('aws-lambda-multipart-parser');
const csvparse = require('csv-parse/lib/sync');
const htmlparser2 = require('htmlparser2');

// Handler
exports.parseForm = function (formdata) {
	return multipart.parse(formdata, false);
};

exports.parseCSV = function (content) {
	let out = [];
	out = csvparse(content);
	out.shift();
	console.log('## CSV: ', out);
	return out;
};

exports.parseXML = function (content) {
	let out = [];
	const parser = new htmlparser2.Parser({
		onattribute(name, value) {
			if (name === 'reference') {
				out.push([]);
				out[out.length - 1].push(value);
			}
		},
		ontext(text) {
			out[out.length - 1].push(text);
		},
	});
	parser.write(content);
	parser.end();
	console.log('## XML: ', out);
	return out;
};
