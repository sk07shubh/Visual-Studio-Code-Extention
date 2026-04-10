const fs = require('fs');
const path = require('path');
const https = require('https');

function loadLocalEnv() {
	const envPath = path.join(__dirname, '.env');
	if (!fs.existsSync(envPath)) {
		return;
	}

	const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
	for (const line of lines) {
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith('#')) {
			continue;
		}

		const separatorIndex = trimmed.indexOf('=');
		if (separatorIndex === -1) {
			continue;
		}

		const key = trimmed.slice(0, separatorIndex).trim();
		const value = trimmed.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, '');
		if (!process.env[key]) {
			process.env[key] = value;
		}
	}
}

loadLocalEnv();

async function callClaude(errorText) {
	const apiKey = process.env.GEMINI_API_KEY;

	if (!apiKey) {
		return 'ErrBuddy is missing a Gemini API key. Add GEMINI_API_KEY to your .env file and try again.';
	}

	const body = JSON.stringify({
		contents: [
			{
				parts: [
					{
						text: `You are ErrBuddy, an assistant that explains code errors to beginners.

A beginner got this error in their terminal:
${errorText}

Explain it like this:
1. 🔴 What went wrong (1-2 simple sentences, no jargon)
2. 📍 Exactly where it happened (file and line number if visible)
3. ✅ How to fix it (simple steps)
4. 💡 Why the fix works (1 sentence)

Be warm, simple, and encouraging. No technical jargon.`
					}
				]
			}
		]
	});

	return new Promise((resolve, reject) => {
		const options = {
			hostname: 'generativelanguage.googleapis.com',
			path: `/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}
		};

		const req = https.request(options, res => {
			let data = '';
			res.on('data', chunk => { data += chunk; });
			res.on('end', () => {
				try {
					const parsed = JSON.parse(data);
					resolve(parsed.candidates[0].content.parts[0].text);
				} catch (e) {
					resolve('ErrBuddy could not understand this error. Try again!');
				}
			});
		});

		req.on('error', () => resolve('ErrBuddy could not connect. Check your internet!'));
		req.write(body);
		req.end();
	});
}

module.exports = { callClaude };
