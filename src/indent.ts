import { RegexDictionary } from './dataDict';

export function createIndentationSize(withoutNumberLine: string, indentData: any, indentSize: number) {
    const regex = new RegexDictionary();
    const BASIC_INDENT = 1;

    const cleanedLine = withoutNumberLine.replace(regex.comment, '').trim();

    // Überprüfen, ob die Einrückung reduziert werden soll
    if (regex.closeInstruction.test(cleanedLine) && indentData.indentLevel > 0) {
        indentData.indentLevel--;
    }

    // Einrückung berechnen
    indentData.whitespace = ' '.repeat(indentSize * indentData.indentLevel + BASIC_INDENT);

    // Überprüfen, ob die Einrückung erhöht werden soll
    if (regex.openInstruction.test(cleanedLine) && !regex.gotoInstruction.test(cleanedLine)) {
        indentData.indentLevel++;
    }
}
