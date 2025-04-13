import * as vscode from 'vscode';
import { brackets } from './checkBrackets';
import { fileTypeCheck } from './fileTypeTest';

export function openClose(cncCode: vscode.TextDocument): Array<[string, number, string]> {
    const stackSequence: Array<[string, number]> = [];
    const faultArray: Array<[string, number, string]> = [];
    const instruction: { [key: string]: string } = {
        IF: 'ENDIF',
        WHILE: 'ENDWHILE',
        LOOP: 'ENDLOOP',
        FOR: 'ENDFOR',
    };
    const lastIf: Array<number> = [];
    const stackOpenClose: { [key: string]: Array<[string, number, string]> } = {
        IF: [],
        WHILE: [],
        LOOP: [],
        FOR: [],
    };

    for (let i = 0; i < cncCode.lineCount; i++) {
        let line = cncCode
            .lineAt(i)
            .text.replace(/^\s*N\d+/i, '')
            .trim();
        const lineNumber = i + 1;

        // kontrolle ob Klammern paarweise vorkommen und in der richtigen Reihenfolge
        if (!brackets(line)) {
            faultArray.push(['Klammer', lineNumber, 'nicht paarweise']);
        }

        // bei MultiArchiv wird nach jedem Programm kontolliert ob es ein Fehler gibt
        // bei einem Fehler wird abgebrochen und die Fehler zurückgegeben
        if (/^%/.test(line)) {
            if (!fileTypeCheck(line)) {
                vscode.window.showErrorMessage('Fehler >> siehe Menü -> Anzeigen -> Probleme');
                faultArray.push([line, lineNumber, 'Falsche Dateiendung >> nur xxx_MPF oder xxx_SPF']);
            }
            if (faultArray.length > 0 || stackSequence.length > 0) {
                break;
            }
        }

        // Überprüft ob die Anweisungen in der richtigen Reihenfolge sind
        line = line.replace(/;.*/, '');
        if (/^.*\b(GOTO(F|B)?)\b/i.test(line)) {
            continue;
        }
        const firstWord = line.match(/^\w*/)?.[0].toUpperCase() || '';
        if (instruction[firstWord]) {
            stackSequence.push([firstWord, lineNumber]);
            stackOpenClose[firstWord].push([firstWord, lineNumber, 'nicht geschlossen']);
        } else if (Object.values(instruction).includes(firstWord)) {
            const key = Object.entries(instruction).find(([key, value]) => value === firstWord)?.[0];
            if (key) {
                stackOpenClose[key].pop();
            }
            if (stackSequence.length === 0 || instruction[stackSequence.pop()?.[0] as string] !== firstWord) {
                faultArray.push([firstWord, lineNumber, 'Reihenfolge falsch']);
            }
        } else if (firstWord === 'ELSE') {
            if (
                stackSequence.length === 0 ||
                stackSequence[stackSequence.length - 1][0] !== 'IF' ||
                lastIf.includes(stackSequence[stackSequence.length - 1][1])
            ) {
                faultArray.push([firstWord, lineNumber, 'Reihenfolge falsch']);
            } else {
                lastIf.push(stackSequence[stackSequence.length - 1][1]);
            }
        }
    }
    faultArray.push(...Object.values(stackOpenClose).flat());
    return faultArray;
}
