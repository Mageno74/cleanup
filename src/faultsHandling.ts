import * as vscode from 'vscode';

const diagnosticCollection = vscode.languages.createDiagnosticCollection('cleanup');
let isWindowOpen: boolean = false;

export function markFaults(faults: Array<[string, number, string]>, cncCode: vscode.TextDocument): boolean {
    const diagnostics: vscode.Diagnostic[] = [];
    diagnosticCollection.clear();
    let isFault = false;
    for (const [fault, lineNumber, message] of faults) {
        const range = new vscode.Range(lineNumber - 1, 0, lineNumber - 1, cncCode.lineAt(lineNumber - 1).text.length);
        const diagnostic = new vscode.Diagnostic(
            range,
            `Fehler >> ${fault} >> ${message} `,
            vscode.DiagnosticSeverity.Error
        );
        diagnostics.push(diagnostic);
        isFault = true;
    }
    diagnosticCollection.set(cncCode.uri, diagnostics);

    if (!isWindowOpen) {
        vscode.commands.executeCommand('workbench.actions.view.problems');
        isWindowOpen = true;
    }
    return isFault;
}
