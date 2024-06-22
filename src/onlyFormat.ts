import * as vscode from 'vscode';
import { indentation } from './indent';

export function onlyFromat(cncCode: vscode.TextDocument, editor:vscode.TextEditor) {
 
    // Setting Zeilen
    const config = vscode.workspace.getConfiguration('cleanup');
    const indentSice = config.get<number>('indentSice',1);
    const maxEmptyLines = config.get<number>('maxEmptyLines',1);

    let countEmpty: number = 0;
    let newText: string = "";
    let countIndent: number = 0;

    // Zeilen neu nummerieren und formatieren
    editor.edit(editBuilder => {
        for (let i = 0; i < cncCode.lineCount; i++) {
            let line: vscode.TextLine = cncCode.lineAt(i);

            // Setzt die Zeilennummer auf die Startnummer, wenn ein neues Programm anfängt (MultiArchiv)
            // Setzt die Einrückung auf Null
            if (/^%_N_/.test(line.text)){
                countIndent = 0;
            }
            // orginal Nummer speichern
            let orgNumber: any = line.text.match(/^\s*N\d+/i);
            if (!orgNumber){
                orgNumber = 'N1111';
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
                newText = `${orgNumber}${whitespace}${withoutNumberLine}`;
            }

            // ersetzt die orginale Zeile mit der nummerierten Zeile
            editBuilder.replace(line.range, newText);
            if (withoutNumberLine !== "") {
                countEmpty = 0; // setzt den Zähler für die leeren Zeilen zurück
            }
        }
    });
    vscode.window.showInformationMessage("formatiert");
}
