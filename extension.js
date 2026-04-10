const vscode = require('vscode');
const { callClaude } = require('./ai');
const { showPanel } = require('./panel');

let terminalOutput = '';

function activate(context) {
	vscode.window.showInformationMessage('ErrBuddy is running! 🚀');

	// Watch terminal output
	context.subscriptions.push(
		vscode.window.onDidWriteTerminalData(event => {
			terminalOutput += event.data;
		})
	);

	// Register command
	let command = vscode.commands.registerCommand('errbuddy.explain', async () => {
		if (terminalOutput.trim() === '') {
			vscode.window.showInformationMessage('No error detected yet! Run some broken code first.');
			return;
		}
		vscode.window.showInformationMessage('ErrBuddy is thinking... 🤔');
		const explanation = await callClaude(terminalOutput);
		showPanel(context, explanation);
		terminalOutput = ''; // reset
	});

	context.subscriptions.push(command);
}

function deactivate() {}

module.exports = { activate, deactivate };