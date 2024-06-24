import * as vscode from 'vscode';
import { brackets } from './checkBrackets';

export function openClose(cncCode: vscode.TextDocument): { [key: string]: Array<number> } {

    const stackInstructions: Array<string> = [];

    let allFaults: { [key: string]: Array<number> } = {
        'IF': [],
        'ELSE': [],
        'ENDIF': [],
        'WHILE': [],
        'ENDWHILE': [],
        'LOOP': [],
        'ENDLOOP': [],
        'FOR': [],
        'ENDFOR': [],
        'KLAMMER': [],
        'Reihenfolge': []
    };

    const instruction: { [key: string]: string } = {
        'IF': 'ENDIF',
        'WHILE': 'ENDWHILE',
        'LOOP': 'ENDLOOP',
        'FOR': 'ENDFOR',
    };

    for (let i = 0; i < cncCode.lineCount; i++) {
        let line: any = cncCode.lineAt(i).text.replace(/^\s*N\d+/i, "").trim();
        const lineNumber: number = i + 1;

        // kontrolle ob Klammern paarweise vorkommen und in der richtigen Reihenfolge
        if (!brackets(line)) {
            allFaults.KLAMMER.push(lineNumber);
        }

        // bei MultiArchiv wird nach jedem Programm kontolliert ob es ein Fehler gibt
        // bei einem Fehler wird abgebrochen und die Fehler zurückgegeben
        if (/^%_N_/.test(line)){
            // iteriert durch das Dictionary und kontolliert ob alle Array leer sind
            for (const key in allFaults) {
                if (allFaults[key].length !== 0){
                    break;
                }
            }
        }

        // Überprüft ob die Anweisungen in der richtigen Reihenfolge sind
        line = line.replace(/;.*/, "");
        if (!(/^.*\b(GOTO(F|B)?)\b/i.test(line))) {
            const addInstruction: string = line.match(/^\b(IF|WHILE|LOOP|FOR)\b/i);
            if (addInstruction) {
                stackInstructions.push(addInstruction[1].toUpperCase());
            }
        }
        const deleteInstuction: string = line.match(/^\b(ENDIF|ENDWHILE|ENDLOOP|ENDFOR)\b/i);
        if (deleteInstuction) {
            if (stackInstructions.length === 0 ||
                instruction[stackInstructions.pop() as string] !== deleteInstuction[1].toLocaleUpperCase()) {
                allFaults.Reihenfolge.push(lineNumber);
            }
        }
        const elseInstuction: string = line.match(/^\bELSE\b/i);
        if (elseInstuction) {
            if (stackInstructions[stackInstructions.length - 1] !== "IF") {
                allFaults.Reihenfolge.push(lineNumber);
            }
        }

        // IF
        // Fügt die Zeilennummer allFaults.IF hinzu --> IF wenn kein GOTO in der Zeile ist
        // Fügt die Zeilennummer allFaults.ELSE hinzu --> IF wenn kein GOTO in der Zeile ist
        if (/^\bIF\b/i.test(line) && !(/^.*\b(GOTO(F|B)?)\b/i.test(line))) {
            allFaults.IF.push(lineNumber);
            allFaults.ELSE.push(lineNumber);
        }

        // ELSE
        // Überprüf ob zuvor eine IF Anweisung war und ob beireits eine ELSE Anweisung in der aktuellen IF Anweidung vorkommt
        else if (/^\bELSE\b/i.test(line)) {
            if (allFaults.ELSE.length !== 0) {
                if (allFaults.ELSE[allFaults.ELSE.length - 1] !== allFaults.IF[allFaults.IF.length - 1]) {
                    allFaults.ELSE.push(lineNumber);
                } else {
                    allFaults.ELSE.pop();
                }
            } else {
                allFaults.ELSE.push(lineNumber);
            }
        }

        // ENDIF
        // Enfernt die Zeilennummer aus allFaults.IF
        // oder fügt eine Zeilennummer allFaults.ENDIF hinzu
        if (/^\bENDIF\b/i.test(line)) {
            if (allFaults.IF.length !== 0) {
                const deleteElse: any = allFaults.IF.pop();
                const index = allFaults.ELSE.indexOf(deleteElse);
                if (index !== -1) {
                    allFaults.ELSE.splice(index, 1);
                }
            } else {
                allFaults.ENDIF.push(lineNumber);
            }
        }

        // WHILE
        // Fügt die Zeilennummer allFaults.WHILE hinzu
        else if (/^\bWHILE\b/i.test(line)) {
            allFaults.WHILE.push(lineNumber);
        }

        // Endwhile
        // Enfernt die Zeilennummer aus allFaults.WHILE
        // oder fügt eine Zeilennummer dem allFaults.ENDWHILE hinzu
        else if (/^\bENDWHILE\b/i.test(line)) {
            if (allFaults.WHILE.length !== 0) {
                allFaults.WHILE.pop();
            } else {
                allFaults.ENDWHILE.push(lineNumber);
            }
        }

        // LOOP
        // Fügt die Zeilennummer allFaults.LOOP hinzu
        else if (/^\bLOOP\b/i.test(line)) {
            allFaults.LOOP.push(lineNumber);
        }

        // ENDLOOP
        // Enfernt die Zeilennummer aus allFaults.LOOP
        // oder fügt eine Zeilennummer dem allFaults.ENDLOOP hinzu
        else if (/^\bENDLOOP\b/i.test(line)) {
            if (allFaults.LOOP.length !== 0) {
                allFaults.LOOP.pop();
            } else {
                allFaults.ENDLOOP.push(lineNumber);
            }
        }

        // FOR
        // Fügt die Zeilennummer allFaults.FOR hinzu
        else if (/^\bFOR\b/i.test(line)) {
            allFaults.FOR.push(lineNumber);
        }

        // ENDFOR
        // Enfernt die Zeilennummer allFaults.FOR
        // oder fügt eine Zeilennummer dem allFaults.ENDFOR hinzu
        else if (/^\bENDFOR\b/i.test(line)) {
            if (allFaults.FOR.length !== 0) {
                allFaults.FOR.pop();
            } else {
                allFaults.ENDFOR.push(lineNumber);
            }
        }
    }
    // Enfernt die Zeilennummer aus allFaults.ELSE wenn die Zeilennumer schon in allFaults.IF entahlten ist 
    for (let i = 0; i < allFaults.IF.length; i++) {
        const index = allFaults.ELSE.indexOf(allFaults.IF[i]);
        if (index !== -1) {
            allFaults.ELSE.splice(index, 1);
        }
    }
    return allFaults;
}
