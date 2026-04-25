import * as vscode from 'vscode';
import { createIndentationSize } from './indent';
import { createDataDictionary, RegexDictionary } from './dataDict';
import { deletedLineNumber, newProgramResetIndent, removeEmptyLines } from './utility';

function getLineNumber(line: string, dataDict: { digits: number }): string {
    const lineNumberRegex = /^\s*N\d+/i;
    let orgNumber = line.match(lineNumberRegex)?.[0] || '';
    if (!orgNumber) {
        orgNumber = `N${'1'.repeat(dataDict.digits)}`;
    } else {
        dataDict.digits = orgNumber.length - 1;
    }
    return orgNumber;
}

export function formatNC(cncCode: vscode.TextDocument, editor: vscode.TextEditor) {
    const config = vscode.workspace.getConfiguration('cleanup');
    const indentSize = config.get<number>('3.indentSize', 1);
    const maxEmptyLines = config.get<number>('4.maxEmptyLines', 1);
    const regex = new RegexDictionary();
    const indentData = createDataDictionary();

    editor.edit((editBuilder) => {
        for (let i = 0; i < cncCode.lineCount; i++) {
            const line = cncCode.lineAt(i);
            const trimmedLine = line.text.trim();

            newProgramResetIndent(trimmedLine, indentData);

            // orginal Nummer speichern und die Anzahl der Nummer speichern
            const orgNumber = getLineNumber(trimmedLine, indentData);

            // Entfernt alle Nummern und Leerzeichen am Anfang und Ende
            const withoutNumberLine = deletedLineNumber(trimmedLine);

            // Entfernt Leerzeilen wenn mehr als 'maxEmptyLines' in Folge kommen
            removeEmptyLines(withoutNumberLine, indentData, maxEmptyLines, editBuilder, line);

            // Zeilen ohne Nummer (Kommentare, Programmstart, leere Zeilen)
            if (regex.noNcCode.test(withoutNumberLine)) {
                indentData.newLine = withoutNumberLine;
            } else {
                // Einrückung berechnen
                createIndentationSize(withoutNumberLine, indentData, indentSize);

                // Fügt die neue Zeilennummer, Leerzeichen und Text zusammen
                indentData.newLine = `${orgNumber}${indentData.whitespace}${withoutNumberLine}`;
            }

            // ersetzt die orginale Zeile mit der nummerierten Zeile
            editBuilder.replace(line.range, indentData.newLine);
        }
    });
    vscode.window.showInformationMessage('formatiert');
}
