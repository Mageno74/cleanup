import * as vscode from 'vscode';

const diagnosticCollection = vscode.languages.createDiagnosticCollection('cleanup');
let isWindowOpen: boolean = false;

export function markFaults(faults: { [key: string]: Array<number> }, cncCode: vscode.TextDocument): boolean {
    const diagnostics: vscode.Diagnostic[] = [];
    diagnosticCollection.clear();
    let isFault = false;
    // iteriert durch das Dictionary und gibt alle Fehler aus
    for (const key in faults) {
        for (let i = 0; i < faults[key].length; i++) {
            const range = new vscode.Range(faults[key][i] - 1, 0, faults[key][i] - 1, cncCode.lineAt(faults[key][i] - 1).text.length);
            const diagnostic = new vscode.Diagnostic(range, `Fehler >> ${key} `, vscode.DiagnosticSeverity.Error);
            diagnostics.push(diagnostic);
            isFault = true;
        }
    }
    diagnosticCollection.set(cncCode.uri, diagnostics);

    if (!isWindowOpen){
        vscode.commands.executeCommand('workbench.actions.view.problems');
        isWindowOpen = true;
    }
    return isFault;
}
