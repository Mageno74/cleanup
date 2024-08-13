import * as vscode from 'vscode';
import { markFaults } from './faultsHandling';

export function fileTypeCheck(lineText: any): boolean {
    const acceptType: Array<string> = ['ARC', 'SPF', 'MPF'];
    const fileType: any = lineText.split(/\.|\_/).pop().toUpperCase();
    return acceptType.includes(fileType);
}

export function isIBNArc(document: vscode.TextDocument): boolean {
    let faultArray: Array<any> = [];
    if (!fileTypeCheck(document.fileName)) {
        faultArray.push([document.lineAt(0).text, 1, 'Abgebrochen >> Datei ist kein .MPF oder.SPF']);
    }
    if (document.lineAt(0).text.match(/^@/)) {
        faultArray.push([document.lineAt(0).text, 1, 'Abgebrochen >> Datei ist ein IBN Archiv']);
    }
    return markFaults(faultArray, document);
}
