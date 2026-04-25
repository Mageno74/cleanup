import * as vscode from 'vscode';
import { displayFaults } from './faultsHandling';

export function fileTypeCheck(lineText: string): boolean {
    const acceptType: Array<string> = ['ARC', 'SPF', 'MPF'];
    const fileType = lineText.split(/\.|\_/).pop()?.toUpperCase() || '';
    return acceptType.includes(fileType);
}

export function isIBNArc(document: vscode.TextDocument): boolean {
    const ibnArcRegex = /^@/;
    let faultArray: Array<[string, number, string]> = [];
    // Überprüft den Dateityp
    if (!fileTypeCheck(document.fileName)) {
        faultArray.push([document.lineAt(0).text, 1, 'Abgebrochen >> Datei ist kein .MPF oder.SPF']);
    }
    // Überprüft, ob die Datei ein IBN Archiv ist
    if (document.lineAt(0).text.match(ibnArcRegex)) {
        faultArray.push([document.lineAt(0).text, 1, 'Abgebrochen >> Datei ist ein IBN Archiv']);
    }
    return displayFaults(faultArray, document);
}
