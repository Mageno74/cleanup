import * as vscode from 'vscode';
import { indentation } from './indent';

export function formatNc(cncCode: vscode.TextDocument, editor: vscode.TextEditor) {

    // Setting Zeilen
    const config = vscode.workspace.getConfiguration('cleanup');
    const indentSize = config.get<number>('3.indentSize', 1);
    const maxEmptyLines = config.get<number>('4.maxEmptyLines', 1);

    let countEmpty: number = 0;
    let newText: string = '';
    let countIndent: number = 0;
    let digits: number = 4;

    // Zeilen neu nummerieren und formatieren
    editor.edit(editBuilder => {
        for (let i = 0; i < cncCode.lineCount; i++) {
            let line: vscode.TextLine = cncCode.lineAt(i);
            const timedLine = line.text.trim();

            // Setzt die Zeilennummer auf die Startnummer, wenn ein neues Programm anfängt (MultiArchiv)
            // Setzt die Einrückung auf Null
            if (/^%/.test(line.text)) {
                countIndent = 0;
            }
            // orginal Nummer speichern und die Anzahl der Nummer speichern
            let orgNumber: string | RegExpMatchArray | null = line.text.match(/^\s*N\d+/i);
            if (!orgNumber) {
                orgNumber = `N${'1'.repeat(digits)}`;
            } else {
                digits = orgNumber[0].length - 1;
            }

            // Entfernt alle Nummern und Leerzeichen am Anfang und Ende
            let withoutNumberLine: string = line.text.replace(/^\s*N\d+/i, '').trim();

            // Entfernt Leerzeilen wenn mehr als 'maxEmptyLines' in Folge kommt
            if (withoutNumberLine === '') {
                countEmpty++;
                if (countEmpty > maxEmptyLines) {
                    editBuilder.delete(line.rangeIncludingLineBreak);
                    continue;
                }
            }

            // Zeilen ohne Nummer -> Kommnetare ohne Nummer, Programm Anfang und leere Zeilen
            if (/^(;|%|$)/i.test(timedLine) || withoutNumberLine === '') {
                newText = withoutNumberLine;
            } else {
                // legt die Einrückung fest
                const [whitespace, count] = indentation(withoutNumberLine, countIndent, indentSize);
                countIndent = count;

                // Fügt die neue Zeilennummer, Leerzeichen und Text zusammen
                newText = `${orgNumber}${whitespace}${withoutNumberLine}`;
            }

            // ersetzt die orginale Zeile mit der nummerierten Zeile
            editBuilder.replace(line.range, newText);
            if (withoutNumberLine !== '') {
                countEmpty = 0; // setzt den Zähler für die leeren Zeilen zurück
            }
        }
    });
    vscode.window.showInformationMessage('formatiert');
}

