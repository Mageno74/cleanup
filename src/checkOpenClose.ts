import * as vscode from 'vscode';
import { checkBrackets } from './checkBrackets';
import { fileTypeCheck } from './fileTypeTest';
import { checkIsInstruction } from './checkInstruction';
import { createStackDictionary, createInstructionDictionary, RegexDictionary } from './dataDict';


function processLine(line: string, lineNumber: number, stack: any): boolean {
    const regex: RegexDictionary = new RegexDictionary();
    const instruction: { [key: string]: string } = createInstructionDictionary();

    if (regex.newProgram.test(line)) {
        if (!fileTypeCheck(line)) {
            vscode.window.showErrorMessage('Fehler >> siehe Menü -> Anzeigen -> Probleme');
            stack.fault.push([line, lineNumber, 'Falsche Dateiendung >> nur xxx_MPF oder xxx_SPF']);
        }
        if (stack.fault.length > 0 || stack.sequence.length > 0) {
            return false;
        }
    }

    checkBrackets(line, lineNumber, stack);

    // Gruppenprüfung
    const match = checkIsInstruction(line, instruction);
    if (match) {
        handleGroupLogic(match, lineNumber, stack, instruction);
    }

    return true;
}

// Funktion zur Behandlung der Gruppenlogik
function handleGroupLogic(match: any, lineNumber: number, stack: any, instruction: { [key: string]: string }) {
    const { group: firstWord, groupID, groupName } = match;
    if (instruction[firstWord]) {
        stack.sequence.push([firstWord, lineNumber]);
        stack.openClose[firstWord].push([firstWord, lineNumber, 'nicht geschlossen']);
    } else if (Object.values(instruction).includes(firstWord)) {
        const key = Object.entries(instruction).find(([key, value]) => value === firstWord)?.[0];
        if (key) {
            stack.openClose[key].pop();
        }
        if (stack.sequence.length === 0 || instruction[stack.sequence.pop()?.[0]] !== firstWord) {
            stack.fault.push([firstWord, lineNumber, 'Reihenfolge falsch']);
        }
    } else if (firstWord === 'ELSE') {
        handleElseLogic(firstWord, lineNumber, stack);
    }

    if (firstWord === 'GROUP_BEGIN' && groupID !== undefined) {
        handleGroupBegin(firstWord, groupID, groupName, lineNumber, stack);
    }

    if (firstWord === 'GROUP_END' && groupID !== undefined) {
        handleGroupEnd(firstWord, groupID, groupName, lineNumber, stack);
    }
}

// Funktion zur Behandlung von ELSE
function handleElseLogic(firstWord: string, lineNumber: number, stack: any) {
    if (
        stack.sequence.length === 0 ||
        stack.sequence[stack.sequence.length - 1][0] !== 'IF' ||
        stack.lastIf.includes(stack.sequence[stack.sequence.length - 1][1])
    ) {
        stack.fault.push([firstWord, lineNumber, 'Reihenfolge falsch']);
    } else {
        stack.lastIf.push(stack.sequence[stack.sequence.length - 1][1]);
    }
}

// Funktion zur Behandlung von GROUP_BEGIN
function handleGroupBegin(firstWord: string, groupID: number, groupName: string, lineNumber: number, stack: any) {
    if (stack.sequenceGroup.includes(groupID)) {
        stack.fault.push([firstWord, lineNumber, `GROUP_BEGIN(${groupID}${groupName}) hat bereits eine offene Gruppe`]);
    }
    stack.group.push([`GROUP_BEGIN(${groupID}${groupName})`, lineNumber, 'nicht geschlossen']);
    stack.sequenceGroup.push(groupID);
}

// Funktion zur Behandlung von GROUP_END
function handleGroupEnd(firstWord: string, groupID: number, groupName: string, lineNumber: number, stack: any) {
    if (stack.sequenceGroup.length === 0 || groupID !== stack.sequenceGroup[stack.sequenceGroup.length - 1]) {
        stack.fault.push([firstWord, lineNumber, `GROUP_END(${groupID}${groupName}) in falscher Reihenfolge`]);
    }
    stack.sequenceGroup.pop();
    stack.group.pop();
}

// Hauptfunktion
export function checkOpenClose(cncCode: vscode.TextDocument): Array<[string, number, string]> {
    const regex = new RegexDictionary();
    const stack = createStackDictionary();

    for (let i = 0; i < cncCode.lineCount; i++) {
        const line = cncCode.lineAt(i).text.replace(regex.lineNumer, '').trim();
        const lineNumber = i + 1;
        if (!processLine(line, lineNumber, stack)) {
            break;
        }
    }

    stack.fault.push(...Object.values(stack.openClose).flat());
    stack.group.push(...stack.sequenceGroup);
    return stack.fault;
}
