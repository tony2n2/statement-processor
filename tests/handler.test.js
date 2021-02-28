const { handler } = require('../function/index');

test('lambda handler validate a valid csv formdata', () => {
	const data = {
		headers: { 'content-type': 'multipart/form-data; boundary=----WebKitFormBoundarya69eOY3Wfn1g8nfX' },
		body:
			'------WebKitFormBoundarya69eOY3Wfn1g8nfX\r\nContent-Disposition: form-data; name="file"; filename="records.csv"\r\nContent-Type: text/csv\r\n\r\nReference,Account Number,Description,Start Balance,Mutation,End Balance\n129994,NL74ABNA0248990274,Flowers from Richard de Vries,19.32,-17.98,1.34\n\r\n------WebKitFormBoundarya69eOY3Wfn1g8nfX--\r\n',
	};
	let expected = {
		body: serialize({
			content: [['129994', 'NL74ABNA0248990274', 'Flowers from Richard de Vries', '19.32', '-17.98', '1.34']],
		}),
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Content-Type': 'application/json',
		},
		isBase64Encoded: false,
		statusCode: 200,
	};
	return handler(data).then((data) => {
		expect(data).toEqual(expected);
	});
});

test('lambda handler validate a invalid csv formdata', () => {
	const data = {
		headers: { 'content-type': 'multipart/form-data; boundary=----WebKitFormBoundarygeszXIwGmulEJzck' },
		body:
			'------WebKitFormBoundarygeszXIwGmulEJzck\r\nContent-Disposition: form-data; name="file"; filename="records.csv"\r\nContent-Type: text/csv\r\n\r\nReference,Account Number,Description,Start Balance,Mutation,End Balance\n109321,NL90ABNA0585647886,Flowers from Peter King,89.07,+20.27,109.34\n112806,NL93ABNA0585619023,Candy for Erik Bakker,84.48,+34.49,118.97\n112806,NL90ABNA0585647886,Tickets from Peter de Vries,15.29,+29.22,44.51\n\r\n------WebKitFormBoundarygeszXIwGmulEJzck--\r\n',
	};
	let expected = {
		body: serialize({
			content: [
				['109321', 'NL90ABNA0585647886', 'Flowers from Peter King', '89.07', '+20.27', '109.34'],
				['112806', 'NL93ABNA0585619023', 'Candy for Erik Bakker', '84.48', '+34.49', '118.97'],
				['112806', 'NL90ABNA0585647886', 'Tickets from Peter de Vries', '15.29', '+29.22', '44.51'],
			],
			invalid: { 112806: 'duplicate reference' },
		}),
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Content-Type': 'application/json',
		},
		isBase64Encoded: false,
		statusCode: 422,
	};
	return handler(data).then((data) => {
		expect(data).toEqual(expected);
	});
});

test('lambda handler validate a invalid xml formdata', () => {
	const data = {
		headers: { 'content-type': 'multipart/form-data; boundary=----WebKitFormBoundaryBFfNUBbjUkAEqHaj' },
		body:
			'------WebKitFormBoundaryBFfNUBbjUkAEqHaj\r\nContent-Disposition: form-data; name="file"; filename="records.xml"\r\nContent-Type: text/xml\r\n\r\n<?xml version="1.0" ?><records><record reference="152519"><accountNumber>NL43AEGO0773393871</accountNumber><description>Tickets for Willem Dekker</description><startBalance>5429</startBalance><mutation>-939</mutation><endBalance>6368</endBalance></record><record reference="170541"><accountNumber>NL74ABNA0248990274</accountNumber><description>Candy for Jan Dekker</description><startBalance>90.59</startBalance><mutation>+20.99</mutation><endBalance>111.58</endBalance></record></records>\r\n------WebKitFormBoundaryBFfNUBbjUkAEqHaj--\r\n\r\n',
	};
	let expected = {
		body: serialize({
			content: [
				['152519', 'NL43AEGO0773393871', 'Tickets for Willem Dekker', '5429', '-939', '6368'],
				['170541', 'NL74ABNA0248990274', 'Candy for Jan Dekker', '90.59', '+20.99', '111.58'],
			],
			invalid: { 152519: 'invalid balance' },
		}),
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Content-Type': 'application/json',
		},
		isBase64Encoded: false,
		statusCode: 422,
	};
	return handler(data).then((data) => {
		expect(data).toEqual(expected);
	});
});

var serialize = function (object) {
	return JSON.stringify(object, null, 2);
};
