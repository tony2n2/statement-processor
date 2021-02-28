const { parseForm, parseCSV, parseXML } = require('../function/parser');

test('parse formdata', () => {
	const data = {
		headers: { 'content-type': 'multipart/form-data; boundary=----WebKitFormBoundarya69eOY3Wfn1g8nfX' },
		body:
			'------WebKitFormBoundarya69eOY3Wfn1g8nfX\r\nContent-Disposition: form-data; name="file"; filename="records.csv"\r\nContent-Type: text/csv\r\n\r\nReference,Account Number,Description,Start Balance,Mutation,End Balance\n129994,NL74ABNA0248990274,Flowers from Richard de Vries,19.32,-17.98,1.34\n\r\n------WebKitFormBoundarya69eOY3Wfn1g8nfX--\r\n',
	};
	const expected = {
		file: {
			content:
				'Reference,Account Number,Description,Start Balance,Mutation,End Balance\n129994,NL74ABNA0248990274,Flowers from Richard de Vries,19.32,-17.98,1.34\n',
			contentType: 'text/csv',
			filename: 'records.csv',
			type: 'file',
		},
	};
	expect(parseForm(data)).toEqual(expected);
});

test('parse csv', () => {
	const data =
		'Reference,Account Number,Description,Start Balance,Mutation,End Balance\n129994,NL74ABNA0248990274,Flowers from Richard de Vries,19.32,-17.98,1.34\n';
	const expected = [['129994', 'NL74ABNA0248990274', 'Flowers from Richard de Vries', '19.32', '-17.98', '1.34']];
	expect(parseCSV(data)).toEqual(expected);
});

test('parse xml', () => {
	const data =
		'<?xml version="1.0" ?><records><record reference="123588"><accountNumber>NL46ABNA0625805417</accountNumber><description>Flowers for Jan de Vries</description><startBalance>3980</startBalance><mutation>+1000</mutation><endBalance>4981</endBalance></record></records>x';
	const expected = [['123588', 'NL46ABNA0625805417', 'Flowers for Jan de Vries', '3980', '+1000', '4981', 'x']];
	expect(parseXML(data)).toEqual(expected);
});
