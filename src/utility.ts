import * as vscode from 'vscode';

export function deletedLineNumber(line: string): string {
    const lineNumberRegex = /^\s*N\d+/i;
    return line.replace(lineNumberRegex, '').trim();
}

export function newProgramResetIndent(line: string, dataDict: { indentLevel: number; curentLineNumber: number }, startNumber: number = 1): void {
    const newProgRegex = /^%/;
    if (newProgRegex.test(line)) {
        dataDict.indentLevel = 0;
        dataDict.curentLineNumber = startNumber;
    }
}

export function removeEmptyLines(
    line: string,
    dataDict: { countEmptyLine: number },
    maxEmptyLines: number,
    editBuilder: vscode.TextEditorEdit,
    lineRange: vscode.TextLine,
) {
    if (line === '') {
        dataDict.countEmptyLine++;
        if (dataDict.countEmptyLine > maxEmptyLines) {
            editBuilder.delete(lineRange.rangeIncludingLineBreak);
            return;
        }
    } else {
        dataDict.countEmptyLine = 0;
    }
}


