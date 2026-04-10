const vscode = require('vscode');

function showPanel(context, explanation) {
	const panel = vscode.window.createWebviewPanel(
		'errbuddy',
		'ErrBuddy — Error Explained',
		vscode.ViewColumn.Beside,
		{}
	);

	panel.webview.html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: Arial, sans-serif;
            padding: 20px;
            line-height: 1.6;
            background-color: #1e1e1e;
            color: #d4d4d4;
        }
        h1 {
            color: #ff6b6b;
            font-size: 20px;
            margin-bottom: 10px;
        }
        .explanation {
            background-color: #2d2d2d;
            padding: 20px;
            border-radius: 10px;
            font-size: 15px;
            white-space: pre-wrap;
        }
        .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #888;
        }
    </style>
</head>
<body>
    <h1>🤖 ErrBuddy Says:</h1>
    <div class="explanation">${explanation}</div>
    <div class="footer">ErrBuddy — Making errors less scary for beginners 💙</div>
</body>
</html>
`;
}

module.exports = { showPanel };