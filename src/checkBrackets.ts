export function brackets(text: string): boolean {
    const stack: string[] = [];
    const brackets: { [key: string]: string } = {
        '(': ')',
        '{': '}',
        '[': ']',
    };
    text = text.replace(/;.*/, ''); // entfernt alles hinter dem Semikolon
    for (const char of text) {
        if (brackets[char]) {
            stack.push(char);
        } else if (Object.values(brackets).includes(char)) {
            if (stack.length === 0 || brackets[stack.pop() as string] !== char) {
                return false;
            }
        }
    }
    return stack.length === 0;
}
