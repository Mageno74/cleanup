import * as vscode from 'vscode';
import { brackets } from './checkBrackets';

export function openClose(cncCode: vscode.TextDocument): any {
    const stackSeqence: Array<any> = [];
    const faultArray: Array<any> = [];
    const instruction: { [key: string]: string } = {
        'IF': 'ENDIF',
        'WHILE': 'ENDWHILE',
        'LOOP': 'ENDLOOP',
        'FOR': 'ENDFOR',
    };
    const lastIf: Array<number> = [];
    let stackOpenClose: { [key: string]: Array<any> } = {
        'IF': [],
        'WHILE': [],
        'LOOP': [],
        'FOR': [],
    };

    zeilenLoop:
    for (let i = 0; i < cncCode.lineCount; i++) {
        let line: any = cncCode.lineAt(i).text.replace(/^\s*N\d+/i, '').trim();
        const lineNumber: number = i + 1;

        // kontrolle ob Klammern paarweise vorkommen und in der richtigen Reihenfolge
        if (!brackets(line)) {
            faultArray.push(['Klammer', lineNumber, 'nicht paarweise']);
        }

        // bei MultiArchiv wird nach jedem Programm kontolliert ob es ein Fehler gibt
        // bei einem Fehler wird abgebrochen und die Fehler zurückgegeben
        if (/^%/.test(line)) {
            // iteriert durch das Dictionary und kontolliert ob alle Array leer sind
            if (faultArray.length > 0 || stackSeqence.length > 0) {
                break;
            }
        }

        // Überprüft ob die Anweisungen in der richtigen Reihenfolge sind
        line = line.replace(/;.*/, '');
        if (/^.*\b(GOTO(F|B)?)\b/i.test(line)) {
            continue;
        }
        const firstWord: string = line.match(/^\w*/)[0].toUpperCase();
        if (instruction[firstWord]) {
            stackSeqence.push([firstWord, lineNumber]);
            stackOpenClose[firstWord].push([firstWord, lineNumber, 'nicht geschlossen']);
        } else if (Object.values(instruction).includes(firstWord)) {
            stackOpenClose[`${Object.entries(instruction).find(([key, value]) => value === firstWord)?.[0]}`].pop();
            if (stackSeqence.length === 0 || instruction[stackSeqence.pop()[0] as string] !== firstWord) {
                faultArray.push([firstWord, lineNumber, 'Reihenfolge falsch']);
            }
        } else if (firstWord === 'ELSE') {
            if (stackSeqence.length === 0 || stackSeqence[stackSeqence.length - 1][0] !== 'IF' ||
                lastIf.includes(stackSeqence[stackSeqence.length - 1][1])) {
                faultArray.push([firstWord, lineNumber, 'Reihenfolge falsch']);
            } else {
                lastIf.push(stackSeqence[stackSeqence.length - 1][1]);
            }
        }
    }
    for (let key in stackOpenClose) {
        for (let i = 0; i < stackOpenClose[`${key}`].length; i++) {
            faultArray.push(stackOpenClose[`${key}`][i]);
        }
    }
    return faultArray;
}
