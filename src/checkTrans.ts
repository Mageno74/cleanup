import * as vscode from 'vscode';

export function openCloseTrans(cncCode: vscode.TextDocument): Array<[string, number, string]> {
    const instruction: { [key: string]: string } = {
        ATRANS: 'TRANS',
        AROT: 'ROT',
        ASCALE: 'SCALE',
        AMIRROR: 'MIRROR',
    };
    const stackOpenClose: { [key: string]: Array<any> } = {
        ATRANS: [],
        AROT: [],
        ASCALE: [],
        AMIRROR: [],
    };

    for (let i = 0; i < cncCode.lineCount; i++) {
        let line = cncCode
            .lineAt(i)
            .text.replace(/^\s*N\d+/i, '')
            .trim();
        const lineNumber = i + 1;

        // bei MultiArchiv wird nach jedem Programm kontolliert ob es ein Fehler gibt
        // bei einem Fehler wird abgebrochen und die Fehler zurückgegeben
        if (/^%/.test(line)) {
            if (Object.values(stackOpenClose).some((arr) => arr.length !== 0)) {
                break;
            }
        }

        // Überprüft ob die Anweisungen in der richtigen Reihenfolge sind
        line = line.replace(/;.*/, '');
        const firstWord = line.match(/^\w*/)?.[0].toUpperCase() || '';
        if (instruction[firstWord]) {
            stackOpenClose[firstWord].push([firstWord, lineNumber, 'ist noch aktive']);
        } else if (Object.values(instruction).includes(firstWord)) {
            stackOpenClose[`${Object.entries(instruction).find(([_, value]) => value === firstWord)?.[0]}`].length = 0;
        }
    }
    return Object.values(stackOpenClose).flat();
}
