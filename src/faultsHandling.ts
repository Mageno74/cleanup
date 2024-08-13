import * as vscode from 'vscode';

const diagnosticCollection = vscode.languages.createDiagnosticCollection('cleanup');
let isWindowOpen: boolean = false;

export function markFaults(faults: Array<any>, cncCode: vscode.TextDocument): boolean {
    const diagnostics: vscode.Diagnostic[] = [];
    diagnosticCollection.clear();
    let isFault = false;
    for (let i = 0; i < faults.length; i++) {
        const range = new vscode.Range(faults[i][1] - 1, 0, faults[i][1] - 1, cncCode.lineAt(faults[i][1] - 1).text.length);
        const diagnostic = new vscode.Diagnostic(range, `Fehler >> ${faults[i][0]} >> ${faults[i][2]} `, vscode.DiagnosticSeverity.Error);
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

