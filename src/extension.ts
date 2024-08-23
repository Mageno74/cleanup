import * as vscode from 'vscode';
import { markFaults } from './faultsHandling';
import { openClose } from './checkInstruction';
import { formatNc } from './onlyFormat';
import { renumber } from './renumber';
import { openCloseTrans } from './checkTrans';
import { isIBNArc } from './fileTypeTest';
import { checkNc } from './onlyCheck';

export function activate(context: vscode.ExtensionContext) {

    let cleanupDisposable = vscode.commands.registerCommand('nc_nummerieren', () => {
        processDocument(renumber);
    });

    let onlyFormatDisposable = vscode.commands.registerCommand('nc_formatieren', () => {
        processDocument(formatNc);
    });

    let onlyCheckDisposable = vscode.commands.registerCommand('nc_kontrollieren', () => {
        processDocument(checkNc);
    });

    context.subscriptions.push(cleanupDisposable);
    context.subscriptions.push(onlyFormatDisposable);
    context.subscriptions.push(onlyCheckDisposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }


function processDocument(process: (doc: vscode.TextDocument, editor: vscode.TextEditor) => void) {
    const editor = vscode.window.activeTextEditor;
    if (!editor){
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

