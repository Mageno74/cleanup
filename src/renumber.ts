import * as vscode from 'vscode';
import { createIndentationSize } from './indent';
import { createDataDictionary, RegexDictionary } from './dataDict';
import { deletedLineNumber, removeEmptyLines, newProgramResetIndent } from './utility';

export function renumberNC(cncCode: vscode.TextDocument, editor: vscode.TextEditor): void {
    const config = vscode.workspace.getConfiguration('cleanup');
    const startNumber = config.get<number>('1.start', 1);
    const increment = config.get<number>('2.inc', 1);
    const identSize = config.get<number>('3.indentSize', 1);
    const maxEmptyLines = config.get<number>('4.maxEmptyLines', 1);
    const regex = new RegexDictionary();
    const renumberData = createDataDictionary();

    renumberData.curentLineNumber = startNumber;

    editor.edit((editBuilder) => {
        for (let i = 0; i < cncCode.lineCount; i++) {
            const line = cncCode.lineAt(i);
            const trimmedLine = line.text.trim();

            // Zurücksetzen der Zeilennummer und Einrückung bei neuem Programm
            newProgramResetIndent(trimmedLine, renumberData, startNumber);

            // Zeilennummer entfernen und bereinigte Zeile erhalten
            const withoutNumberLine = deletedLineNumber(trimmedLine);

            // Entfernen von überflüssigen Leerzeilen
            removeEmptyLines(withoutNumberLine, renumberData, maxEmptyLines, editBuilder, line);

            // Zeilen ohne Nummer (Kommentare, Programmstart, leere Zeilen)
            if (regex.noNcCode.test(withoutNumberLine)) {
                renumberData.newLine = withoutNumberLine;
            } else {
                // Einrückung berechnen
                createIndentationSize(withoutNumberLine, renumberData, identSize);

                // Neue Zeilennummer, Einrückung und Text zusammenfügen
                renumberData.newLine = `N${renumberData.curentLineNumber}${renumberData.whitespace}${withoutNumberLine}`;
                renumberData.curentLineNumber += increment;
            }

            // Originalzeile ersetzen
            editBuilder.replace(line.range, renumberData.newLine);
        }
    });

    vscode.window.showInformationMessage('Nummeriert und formatiert');
}
