import * as vscode from 'vscode';
import { displayFaults } from './faultsHandling';
import { checkOpenClose } from './checkOpenClose';
import { formatNC } from './onlyFormat';
import { renumberNC } from './renumber';
import { isIBNArc } from './fileTypeTest';
import { checkNC } from './onlyCheck';

export function activate(context: vscode.ExtensionContext) {
    const commands = [
        { name: 'nc_nummerieren', handler: renumberNC },
        { name: 'nc_formatieren', handler: formatNC },
        { name: 'nc_kontrollieren', handler: checkNC },
    ];

    commands.forEach((command) => {
        let disposable = vscode.commands.registerCommand(command.name, () => {
            processDocument(command.handler);
        });
        context.subscriptions.push(disposable);
    });
}
export function deactivate() {}

function processDocument(process: (doc: vscode.TextDocument, editor: vscode.TextEditor) => void) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active editor found.');
        return;
    }

    const doc = editor.document;
    try {
        if (isIBNArc(doc)) {
            showError('Fehler >> siehe Menü -> Anzeigen -> Probleme');
            return;
        }
        
        if (displayFaults(checkOpenClose(doc), doc)) {
            showError('Fehler >> siehe Menü -> Anzeigen -> Probleme');
            return;
        }

        process(doc, editor);
    } catch (error: any) {
        showError(`An error occurred: ${error.message}`);
    }
}

function showError(message: string) {
    vscode.window.showErrorMessage(message);
}
