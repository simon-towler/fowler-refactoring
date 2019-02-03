var invoice = 
{
	"customer": "BigCo", "performances": [
		{
			"playID": "hamlet",
			"audience": 55
		},
		{
			"playID": "as-like",
			"audience": 35
		},
		{
			"playID": "othello",
			"audience": 40
		}
	]
}
;

var plays = {
	"hamlet": {"name":"Hamlet", "type": "tragedy"},
	"as-like": {"name": "As You Like It", "type": "comedy"},
	"othello": {"name": "Othello", "type": "tragedy"}
};

console.log(statement(invoice, plays));

function amountFor(perf, play) {

	let thisAmount = 0;

	switch (play.type) {

	case "tragedy":
		thisAmount = 40000;
		if (perf.audience > 30) {
			thisAmount += 1000 * (perf.audience - 30);
		}
		break;

	case "comedy": thisAmount = 30000;
		if (perf.audience > 20) {
			thisAmount += 10000 + 500 * (perf.audience - 20);
		}
		thisAmount += 300 * perf.audience;
		break;

	default:
		throw new Error(`unknown type: ${play.type}`);
		}

		return thisAmount;
}

function statement (invoice, plays) {
	//console.log(invoice);
	//console.log(plays);
	let totalAmount = 0;
	let volumeCredits = 0;
	let result = `Statement for ${invoice.customer}\n`;
	const format = new Intl.NumberFormat("en-US", {style: "currency", currency: "USD", minimumFractionDigits: 2}).format;

	for (let perf of invoice.performances) {
		const play = plays[perf.playID];
		let thisAmount = amountFor(perf, play);

		//add volume credits
		volumeCredits += Math.max(perf.audience - 30, 0);
		//add extra credit for every ten comedy attendees
		if ("comedy" === play.type) volumeCredits += Math.floor(perf.audience / 5);

		//print line for this order
		result += ` ${play.name}: ${format(thisAmount/100)} (${perf.audience} seats)\n`;
		totalAmount += thisAmount;
	}

	result += `Amount owed is ${format(totalAmount/100)}\n`;
	result += `You earned ${volumeCredits} credits!\n`;
	return result;

}

test('Test in js file', () => {
	expect(statement(invoice, plays)).toBe('Statement for BigCo\n Hamlet: $650.00 (55 seats)\n As You Like It: $580.00 (35 seats)\n Othello: $500.00 (40 seats)\nAmount owed is $1,730.00\nYou earned 47 credits!\n')
})
