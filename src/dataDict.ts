export function createDataDictionary() {
    return {
        countEmptyLine: 0,
        newLine: '',
        indentLevel: 0,
        digits: 4,
        whitespace: '',
        curentLineNumber: 0,
    };
}

export class RegexDictionary {
    lineNumer = /^\s*N\d+/i;
    comment = /;.*/;
    noNcCode = /^(;|%|$)/;
    newProgram = /^%/;
    string = /"[^"]*"/g;
    instruction = /^(\w*)\s*\(?\s*(\d+)?(.*)/i;
    closeInstruction = /^\b(ENDIF|ENDWHILE|ELSE|ENDLOOP|ENDFOR|UNTIL)\b/i;
    openInstruction = /^\b(IF|WHILE|ELSE|LOOP|FOR|REPEAT$)\b/i;
    gotoInstruction = /^.*\b(GOTO(F|B)?)\b/i;
}

export function createInstructionDictionary() {
    return {
        IF: 'ENDIF',
        WHILE: 'ENDWHILE',
        LOOP: 'ENDLOOP',
        FOR: 'ENDFOR',
        GROUP_BEGIN: 'GROUP_END',
        REPEAT: 'UNTIL',
    };
}

export function createStackDictionary() {
    return {
        sequence: [],
        fault: [],
        group: [],
        sequenceGroup: [],
        lastIf: [],
        openClose: {
            IF: [],
            WHILE: [],
            LOOP: [],
            FOR: [],
            GROUP_BEGIN: [],
            REPEAT: [],
        },
    };
}

export function createBracketDictionary() {
    return {
        '(': ')',
        '{': '}',
        '[': ']',
    };
}
