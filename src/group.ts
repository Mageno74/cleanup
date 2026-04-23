export function group(line: string, instruction: { [key: string]: string }): { group: string; groupID?: string; groupName?: string } | null {
    const match = line.match(/^(\w*)\s*\(?\s*(\d+)?(.*)/i);

    if (/^.*\b(GOTO(F|B)?)\b/i.test(line)) {
        return null;
    }
    if (match && match[1].toUpperCase() === 'REPEAT' && match[3] !== '') {
        return null;
    }
    if (match && instruction[match[1].toUpperCase()] || match && Object.values(instruction).includes(match[1].toUpperCase())) {
        const group = match[1].toUpperCase();
        const groupID = match[2] || '';
        const groupName = match[3] || '';
        return { group, groupID, groupName };
    }
    if (match && match[1].toUpperCase() === 'ELSE') {
        const group = match[1].toUpperCase();
        return { group };
    }
    return null;
}


