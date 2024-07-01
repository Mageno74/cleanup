import * as vscode from 'vscode';
import { markFaults } from './faultsHandling';
import { openClose } from './checkInstruction';
import { onlyFromat } from './onlyFormat';
import { renumber } from './renumber';

export function activate(context: vscode.ExtensionContext) {

// CNC Programm formatieren und nummerieren
    let cleanupDisposable = vscode.commands.registerCommand('cleanup', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return; // No active editor
        }
        const doc: vscode.TextDocument = editor.document;

        // konrolle IF/ELSE/ENDIF/LOOP/FOR/WHILE
        const faultDic: { [key: string]: Array<number> } = openClose(doc);

        // falls Fehler gefunden werden --> Fehler anzeigen und Programm abberchen
        if (markFaults(faultDic, doc)) {
            vscode.window.showErrorMessage("Fehler >> siehe Menü -> Anzeigen -> V106");
            return;
        }
        renumber(doc, editor);
    });    
    context.subscriptions.push(cleanupDisposable);

    

// CNC Programm formatieren
    let onlyFormatDisposable = vscode.commands.registerCommand('onlyFormat', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return; // No active editor
        }
        const doc: vscode.TextDocument = editor.document;

        // konrolle IF/ELSE/ENDIF/LOOP/FOR/WHILE
        const faultDic: { [key: string]: Array<number> } = openClose(doc);

        // falls Fehler gefunden werden --> Fehler anzeigen und Programm abberchen
        if (markFaults(faultDic, doc)) {
            vscode.window.showErrorMessage("Fehler >> siehe Menü -> Anzeigen -> V106");
            return;
        }

        onlyFromat(doc, editor);
    });    
    context.subscriptions.push(onlyFormatDisposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }


