import * as vscode from 'vscode';
import { indentation } from './indent';

export function renumber(cncCode: vscode.TextDocument, editor:vscode.TextEditor) {

    // Setting Zeilen
    const config = vscode.workspace.getConfiguration('cleanup');
    const start = config.get<number>('start', 1);
    const inc = config.get<number>('inc', 1);
    const indentSice = config.get<number>('indentSice',1);
    const maxEmptyLines = config.get<number>('maxEmptyLines',1);

    const doc: vscode.TextDocument = editor.document;
    let lineNumber: number = start;
    let countEmpty: number = 0;
    let newText: string = "";
    let countIndent: number = 0;

    // Zeilen neu nummerieren und formatieren
    editor.edit(editBuilder => {
        for (let i = 0; i < doc.lineCount; i++) {
            let line: vscode.TextLine = doc.lineAt(i);

            // Setzt die Zeilennummer auf die Startnummer, wenn ein neues Programm anfängt (MultiArchiv)
            // Setzt die Einrückung auf Null
            if (/^%_N_/.test(line.text)){
                lineNumber = start;
                countIndent = 0;
            }

            // Entfernt alle Nummern und Leerzeichen am Anfang und Ende
            let withoutNumberLine: string = line.text.replace(/^\s*N\d+/i, "").trim();

            // Entfernt Leerzeilen wenn mehr als eine in Folge kommt
            if (withoutNumberLine === "") {
                countEmpty++;
                if (countEmpty > maxEmptyLines) {
                    editBuilder.delete(line.rangeIncludingLineBreak);
                    continue;
                }
            }

            // Zeilen ohne Nummer
            if (/^\s*(;|%|$)/.test(withoutNumberLine)) {
                newText = withoutNumberLine;
            } else {
                // legt die Einrückung fest
                const [whitespace, count] = indentation(withoutNumberLine, countIndent, indentSice);
                countIndent = count;

                // Fügt die neue Zeilennummer, Leerzeichen und Text zusammen
                newText = `N${lineNumber}${whitespace}${withoutNumberLine}`;
                lineNumber += inc;
            }

            // ersetzt die orginale Zeile mit der nummerierten Zeile
            editBuilder.replace(line.range, newText);
            if (withoutNumberLine !== "") {
                countEmpty = 0; // setzt den Zähler für die leeren Zeilen zurück
            }
        }
    });
    vscode.window.showInformationMessage("nummeriert und formatiert");
}

