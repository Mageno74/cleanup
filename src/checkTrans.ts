import * as vscode from 'vscode';

export function openCloseTrans(cncCode: vscode.TextDocument): Array<[string, number, string]> {
    const faultArray: Array<[string, number, string]> = [];
    const instruction: { [key: string]: string } = {
        ATRANS: 'TRANS',
        AROT: 'ROT',
        ASCALE: 'SCALE',
        AMIRROR: 'MIRROR',
    };
    let stackOpenClose: { [key: string]: Array<any> } = {
        ATRANS: [],
        AROT: [],
        ASCALE: [],
        AMIRROR: [],
    };

    for (let i = 0; i < cncCode.lineCount; i++) {
        let line: any = cncCode
            .lineAt(i)
            .text.replace(/^\s*N\d+/i, '')
            .trim();
        const lineNumber: number = i + 1;

        // bei MultiArchiv wird nach jedem Programm kontolliert ob es ein Fehler gibt
        // bei einem Fehler wird abgebrochen und die Fehler zurückgegeben
        if (/^%/.test(line)) {
            if (faultArray.length !== 0) {
                break;
            }
        }

        // Überprüft ob die Anweisungen in der richtigen Reihenfolge sind
        line = line.replace(/;.*/, '');
        const firstWord: string = line.match(/^\w*/)[0].toUpperCase();
        if (instruction[firstWord]) {
            stackOpenClose[firstWord].push([firstWord, lineNumber, 'ist noch aktive']);
        } else if (Object.values(instruction).includes(firstWord)) {
            stackOpenClose[
                `${Object.entries(instruction).find(([key, value]) => value === firstWord)?.[0]}`
            ].length = 0;
        }
    }
    for (let key in stackOpenClose) {
        faultArray.push(...stackOpenClose[key]);
    }
    return faultArray;
}
