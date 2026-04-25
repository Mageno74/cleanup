import { RegexDictionary, createBracketDictionary} from './dataDict';

export function checkBrackets(text: string, lineNumber: number, data: { fault: [string, number, string][] }
): void {
    const regex = new RegexDictionary();
    const brackets: { [key: string]: string } = createBracketDictionary();
    const stack: string[] = [];

    const cleanedText = text
        .replace(regex.string, '')
        .replace(regex.comment, ''); 

    for (const char of cleanedText) {
        if (brackets[char]) {
            stack.push(char);
        } else if (Object.values(brackets).includes(char)) {
            if (stack.length === 0 || brackets[stack.pop() as string] !== char) {
            data.fault.push(['Klammer', lineNumber, 'nicht paarweise']);
            }
        }
    }
    if (stack.length !== 0){
        data.fault.push(['Klammer', lineNumber, 'nicht paarweise']);
    }
}
