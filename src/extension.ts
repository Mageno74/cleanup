import * as vscode from 'vscode';
import { markFaults } from './faultsHandling';
import { openClose } from './checkInstruction';
import { formatNC } from './onlyFormat';
import { renumberNC } from './renumber';
import { openCloseTrans } from './checkTrans';
import { isIBNArc } from './fileTypeTest';
import { checkNC } from './onlyCheck';

export function activate(context: vscode.ExtensionContext) {
    let cleanupDisposable = vscode.commands.registerCommand('nc_nummerieren', () => {
        processDocument(renumberNC);
    });

    let onlyFormatDisposable = vscode.commands.registerCommand('nc_formatieren', () => {
        processDocument(formatNC);
    });

    let onlyCheckDisposable = vscode.commands.registerCommand('nc_kontrollieren', () => {
        processDocument(checkNC);
    });

    context.subscriptions.push(cleanupDisposable);
    context.subscriptions.push(onlyFormatDisposable);
    context.subscriptions.push(onlyCheckDisposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}

function processDocument(process: (doc: vscode.TextDocument, editor: vscode.TextEditor) => void) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }
    const doc = editor.document;
    if (isIBNArc(doc)) {
        vscode.window.showErrorMessage('Fehler >> siehe Menü -> Anzeigen -> Probleme');
        return;
    }
    let faultArray = openClose(doc).concat(openCloseTrans(doc));
    if (markFaults(faultArray, doc)) {
        vscode.window.showErrorMessage('Fehler >> siehe Menü -> Anzeigen -> Probleme');
        return;
    }
    process(doc, editor);
}
