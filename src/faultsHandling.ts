import * as vscode from 'vscode';

const diagnosticCollection = vscode.languages.createDiagnosticCollection('cleanup');
let isWindowOpen: boolean = false;

export function displayFaults(faults: Array<[string, number, string]>, cncCode: vscode.TextDocument): boolean {
    const diagnostics: vscode.Diagnostic[] = [];
    diagnosticCollection.clear();
    let hasFaults = false;

    // Hilfsfunktion: Erstellt eine Diagnose
    const createDiagnostic = (fault: string, lineNumber: number, message: string): vscode.Diagnostic => {
        const range = new vscode.Range(lineNumber - 1, 0, lineNumber - 1, cncCode.lineAt(lineNumber - 1).text.length);
        return new vscode.Diagnostic(range, `Fehler >> ${fault} >> ${message}`, vscode.DiagnosticSeverity.Error);
    };

    // Diagnosen erstellen
    for (const [fault, lineNumber, message] of faults) {
        diagnostics.push(createDiagnostic(fault, lineNumber, message));
        hasFaults = true;
    }

    // Diagnosen setzen
    diagnosticCollection.set(cncCode.uri, diagnostics);

    // Problemansicht öffnen, falls noch nicht geöffnet
    if (!isWindowOpen) {
        vscode.commands.executeCommand('workbench.actions.view.problems');
        isWindowOpen = true;
    }

    return hasFaults;
}
