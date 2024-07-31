export function indentation(withoutNumberLine: string, count: number, indentSice: number): [string, number] {

    // subtrahiert 1 von count wenn ENDIF, ENDWHILE, ELSE, ENDLOOP, ENDFOR am Anfang der Zeile steht
    if (/^\b(ENDIF|ENDWHILE|ELSE|ENDLOOP|ENDFOR)\b/i.test(withoutNumberLine) && count > 0) {
        count--;
    }
    // legt die Einrückung fest
    const whitespace = ' '.repeat(indentSice * count + 1);

    // addiert 1 zu count wenn IF, WHILE, ELSE, LOOP, FOR am Anfang der Zeile steht und kein GOTO/F/B folgt
    withoutNumberLine = withoutNumberLine.replace(/;.*/, '');
    if (/^\b(IF|WHILE|ELSE|LOOP|FOR)\b/i.test(withoutNumberLine) && !(/^.*\b(GOTO(F|B)?)\b/i.test(withoutNumberLine))) {
        count++;
    }
    return [whitespace, count];
}

