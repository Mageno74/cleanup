export function indentation(withoutNumberLine: string, count: number, indentSize: number): [string, number] {
    // enfernt alles nach einem Semikolon
    withoutNumberLine = withoutNumberLine.replace(/;.*/, '');
    // subtrahiert 1 von count wenn ENDIF, ENDWHILE, ELSE, ENDLOOP, ENDFOR am Anfang der Zeile steht
    if (/^\b(ENDIF|ENDWHILE|ELSE|ENDLOOP|ENDFOR)\b/i.test(withoutNumberLine) && count > 0) {
        count--;
    }

    // legt die Einrückung fest
    const whitespace = ' '.repeat(indentSize * count + 1);

    // addiert 1 zu count wenn IF, WHILE, ELSE, LOOP, FOR am Anfang der Zeile steht und kein GOTO/F/B folgt
    if (/^\b(IF|WHILE|ELSE|LOOP|FOR)\b/i.test(withoutNumberLine) && !/^.*\b(GOTO(F|B)?)\b/i.test(withoutNumberLine)) {
        count++;
    }
    return [whitespace, count];
}
