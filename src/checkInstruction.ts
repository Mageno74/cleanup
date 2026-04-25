import { RegexDictionary} from './dataDict';

export function checkIsInstruction(
    line: string,
    instruction: { [key: string]: string },
): { group: string; groupID: string; groupName: string } | null {
    const regex: RegexDictionary = new RegexDictionary();

    // Zeile bereinigen
    const cleanedLine = line.replace(regex.comment, '').trim();

    // Regex-Matching
    const match = cleanedLine.match(regex.instruction);

    // Frühzeitiges Beenden bei GOTO-Instruktionen
    if (regex.gotoInstruction.test(cleanedLine)) {
        return null;
    }

    // Frühzeitiges Beenden bei REPEAT mit zusätzlichem Inhalt
    if (match && match[1].toUpperCase() === 'REPEAT' && match[3] !== '') {
        return null;
    }

    // Überprüfung auf gültige Instruktionen
    if (match) {
        const group = match[1].toUpperCase();
        const groupID = match[2] || '';
        const groupName = match[3] || '';

        if (instruction[group] || Object.values(instruction).includes(group) || group === 'ELSE') {
            return { group, groupID, groupName };
        }
    }

    return null;
}


