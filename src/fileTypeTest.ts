import * as vscode from 'vscode';
import { displayFaults } from './faultsHandling';

// Konstante für akzeptierte Dateitypen
const ACCEPTED_FILE_TYPES = ['ARC', 'SPF', 'MPF'];

export function fileTypeCheck(lineText: string): boolean {
    const fileType = lineText.split(/\.|\_/).pop()?.toUpperCase() || '';
    return ACCEPTED_FILE_TYPES.includes(fileType);
}

export function isIBNArc(document: vscode.TextDocument): boolean {
    const IBN_ARC_REGEX = /^@/;
    const faultArray: Array<[string, number, string]> = [];

    // Hilfsfunktion: Fügt Fehler zur Liste hinzu
    const addFault = (message: string) => {
        faultArray.push([document.lineAt(0).text, 1, message]);
    };

    // Überprüft den Dateityp
    if (!fileTypeCheck(document.fileName)) {
        addFault('Abgebrochen >> Datei ist kein .MPF oder .SPF');
    }

    // Überprüft, ob die Datei ein IBN Archiv ist
    if (IBN_ARC_REGEX.test(document.lineAt(0).text)) {
        addFault('Abgebrochen >> Datei ist ein IBN Archiv');
    }

    return displayFaults(faultArray, document);
}
