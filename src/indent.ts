export function indentation(withoutNumberLine: string, count: number, indentSize: number): [string, number] {
    // Reguläre Ausdrücke für Anweisungen
    const closeInstruction = /^\b(ENDIF|ENDWHILE|ELSE|ENDLOOP|ENDFOR)\b/i;
    const openInstruction = /^\b(IF|WHILE|ELSE|LOOP|FOR)\b/i;
    const gotoInstruction = /^.*\b(GOTO(F|B)?)\b/i;
    const BASIC_INDENT = 1;

    // enfernt alles nach einem Semikolon
    withoutNumberLine = withoutNumberLine.replace(/;.*/, '');

    // subtrahiert 1 von count wenn ENDIF, ENDWHILE, ELSE, ENDLOOP, ENDFOR am Anfang der Zeile steht
    if (closeInstruction.test(withoutNumberLine) && count > 0) {
        count--;
    }

    // legt die Einrückung fest
    const whitespace = ' '.repeat(indentSize * count + BASIC_INDENT);

    // addiert 1 zu count wenn IF, WHILE, ELSE, LOOP, FOR am Anfang der Zeile steht und kein GOTO/F/B folgt
    if (openInstruction.test(withoutNumberLine) && !gotoInstruction.test(withoutNumberLine)) {
        count++;
    }
    return [whitespace, count];
}
