import * as vscode from 'vscode';
import { brackets } from './checkBrackets';
import { fileTypeCheck } from './fileTypeTest';
import { group } from './group';

// Funktion zur Initialisierung der Datenstrukturen
function initializeDataStructures() {
    return {
        stackSequence: [],
        faultArray: [],
        stackGroup: [],
        stackSequenceGroup: [],
        lastIf: [],
        stackOpenClose: {
            IF: [],
            WHILE: [],
            LOOP: [],
            FOR: [],
            GROUP_BEGIN: [],
            REPEAT: [],
        },
    };
}

// Funktion zur Verarbeitung einer einzelnen Zeile
function processLine(line: string, lineNumber: number, data: any, instruction: any): boolean {
    // Anweisungsprüfung
    if (/^%/.test(line)) {
        if (!fileTypeCheck(line)) {
            vscode.window.showErrorMessage('Fehler >> siehe Menü -> Anzeigen -> Probleme');
            data.faultArray.push([line, lineNumber, 'Falsche Dateiendung >> nur xxx_MPF oder xxx_SPF']);
        }
        if (data.faultArray.length > 0 || data.stackSequence.length > 0) {
            return false; // Abbruchbedingung
        }
    }

    // Klammerprüfung
    brackets(line, lineNumber, data);

    // Gruppenprüfung
    const match = group(line, instruction);
    if (match) {
        handleGroupLogic(match, lineNumber, data, instruction);
    }

    return true;
}

// Funktion zur Behandlung der Gruppenlogik
function handleGroupLogic(match: any, lineNumber: number, data: any, instruction: any) {
    const { group: firstWord, groupID, groupName } = match;
    if (instruction[firstWord]) {
        data.stackSequence.push([firstWord, lineNumber]);
        data.stackOpenClose[firstWord].push([firstWord, lineNumber, 'nicht geschlossen']);
    } else if (Object.values(instruction).includes(firstWord)) {
        const key = Object.entries(instruction).find(([key, value]) => value === firstWord)?.[0];
        if (key) {
            data.stackOpenClose[key].pop();
        }
        if (data.stackSequence.length === 0 || instruction[data.stackSequence.pop()?.[0]] !== firstWord) {
            data.faultArray.push([firstWord, lineNumber, 'Reihenfolge falsch']);
        }
    } else if (firstWord === 'ELSE') {
        handleElseLogic(firstWord, lineNumber, data);
    }

    if (firstWord === 'GROUP_BEGIN' && groupID !== undefined) {
        handleGroupBegin(firstWord, groupID, groupName, lineNumber, data);
    }

    if (firstWord === 'GROUP_END' && groupID !== undefined) {
        handleGroupEnd(firstWord, groupID, groupName, lineNumber, data);
    }
}

// Funktion zur Behandlung von ELSE
function handleElseLogic(firstWord: string, lineNumber: number, data: any) {
    if (
        data.stackSequence.length === 0 ||
        data.stackSequence[data.stackSequence.length - 1][0] !== 'IF' ||
        data.lastIf.includes(data.stackSequence[data.stackSequence.length - 1][1])
    ) {
        data.faultArray.push([firstWord, lineNumber, 'Reihenfolge falsch']);
    } else {
        data.lastIf.push(data.stackSequence[data.stackSequence.length - 1][1]);
    }
}

// Funktion zur Behandlung von GROUP_BEGIN
function handleGroupBegin(firstWord: string, groupID: number, groupName: string, lineNumber: number, data: any) {
    if (data.stackSequenceGroup.includes(groupID)) {
        data.faultArray.push([
            firstWord,
            lineNumber,
            `GROUP_BEGIN(${groupID}${groupName}) hat bereits eine offene Gruppe`,
        ]);
    }
    data.stackGroup.push([`GROUP_BEGIN(${groupID}${groupName})`, lineNumber, 'nicht geschlossen']);
    data.stackSequenceGroup.push(groupID);
}

// Funktion zur Behandlung von GROUP_END
function handleGroupEnd(firstWord: string, groupID: number, groupName: string, lineNumber: number, data: any) {
    if (data.stackSequenceGroup.length === 0 || groupID !== data.stackSequenceGroup[data.stackSequenceGroup.length - 1]) {
        data.faultArray.push([firstWord, lineNumber, `GROUP_END(${groupID}${groupName}) in falscher Reihenfolge`]);
    }
    data.stackSequenceGroup.pop();
    data.stackGroup.pop();
}

// Hauptfunktion
export function openClose(cncCode: vscode.TextDocument): Array<[string, number, string]> {
    const data = initializeDataStructures();
    const instruction = {
        IF: 'ENDIF',
        WHILE: 'ENDWHILE',
        LOOP: 'ENDLOOP',
        FOR: 'ENDFOR',
        GROUP_BEGIN: 'GROUP_END',
        REPEAT: 'UNTIL',
    };

    for (let i = 0; i < cncCode.lineCount; i++) {
        const line = cncCode
            .lineAt(i)
            .text.replace(/^\s*N\d+/i, '')
            .trim();
        const lineNumber = i + 1;
        if (!processLine(line, lineNumber, data, instruction)) {
            break;
        }
    }

    data.faultArray.push(...Object.values(data.stackOpenClose).flat());
    data.faultArray.push(...data.stackGroup);
    return data.faultArray;
}
