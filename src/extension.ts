import * as vscode from 'vscode';
import { markFaults } from './faultsHandling';
import { openClose } from './checkInstruction';
import { onlyFromat } from './onlyFormat';
import { renumber } from './renumber';

export function activate(context: vscode.ExtensionContext) {
    
    // NC Programm formatieren und nummerieren
    let cleanupDisposable = vscode.commands.registerCommand('nc_nummerieren', () => {

        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return; // No active editor
        }
        const doc: vscode.TextDocument = editor.document;
        
        // konrolle IF/ELSE/ENDIF/LOOP/FOR/WHILE
        const faultArray: Array<any> = openClose(doc);
        
        // falls Fehler gefunden werden --> Fehler anzeigen und Programm abberchen
        if (markFaults(faultArray, doc)) {
            vscode.window.showErrorMessage('Fehler >> siehe Menü -> Anzeigen -> Probleme');
            return;
        }
        renumber(doc, editor);
    });

    // NC Programm formatieren
    let onlyFormatDisposable = vscode.commands.registerCommand('nc_formatieren', () => {
        
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return; // No active editor
        }
        const doc: vscode.TextDocument = editor.document;
        
        // konrolle IF/ELSE/ENDIF/LOOP/FOR/WHILE
        const faultArray: Array<any> = openClose(doc);
        
        // falls Fehler gefunden werden --> Fehler anzeigen und Programm abberchen
        if (markFaults(faultArray, doc)) {
            vscode.window.showErrorMessage('Fehler >> siehe Menü -> Anzeigen -> Probleme');
            return;
        }

        onlyFromat(doc, editor);
    });
    context.subscriptions.push(cleanupDisposable);
    context.subscriptions.push(onlyFormatDisposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }

