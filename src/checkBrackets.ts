export function checkbrackets(text: string, lineNumber: number, data:any) {
    const stringRegex = /"[^"]*"/g;
    const coment = /;.*/;
    const stack: string[] = [];
    const brackets: { [key: string]: string } = {
        '(': ')',
        '{': '}',
        '[': ']',
    };
    text = text.replace(stringRegex, ''); // entfernt alles zwischen Anführungszeichen
    text = text.replace(coment, ''); // entfernt alles hinter dem Semikolon
    for (const char of text) {
        if (brackets[char]) {
            stack.push(char);
        } else if (Object.values(brackets).includes(char)) {
            if (stack.length === 0 || brackets[stack.pop() as string] !== char) {
            data.faultArray.push(['Klammer', lineNumber, 'nicht paarweise']);
            }
        }
    }
    if (stack.length !== 0){
        data.faultArray.push(['Klammer', lineNumber, 'nicht paarweise']);
    }
}
