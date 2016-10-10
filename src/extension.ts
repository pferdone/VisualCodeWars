'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as request from 'request';

import DescriptionContent from './DescriptionContent';
import { STRATEGY_PICKS } from './CodeWarsConstants';
import { CodeWarsClient, CwTrainCodeChallengeResponse } from './CodeWarsClient';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('VisualCodeWars is now active!');

    vscode.workspace.registerTextDocumentContentProvider('vcw-desc', new DescriptionContent());

    context.subscriptions.push(vscode.commands.registerCommand('vcw.peekNextChallenge', peekNextCodeChallenge));
    context.subscriptions.push(vscode.commands.registerCommand('vcw.trainSpecificChallenge', trainSpecificChallenge));
}

export function peekNextCodeChallenge() {
    vscode.window.showQuickPick<vscode.QuickPickItem>(STRATEGY_PICKS).then(
        (value: vscode.QuickPickItem) => {
            const request:request.Request = CodeWarsClient.trainNextCodeChallenge(value.label, true);
            let json: string = '';
            request
                .on('data', (data) => { json += data; })
                .on('complete', (response, body) => {
                    let tccr: CwTrainCodeChallengeResponse = JSON.parse(json);
                    previewDescription(tccr);
                })
                .on('error', (e) => {
                    vscode.window.showInformationMessage('No challenge available for selected options!');
                });
        }, (reason: any) => {
            console.log(reason);
        }
    );
}

export function trainSpecificChallenge() {
    let options: vscode.InputBoxOptions = {
        ignoreFocusOut: true,
        placeHolder: 'Input code challenge slug',
        prompt: "The slug for '../kata/disease-spread' would be 'disease-spread'"
    };

    vscode.window.showInputBox(options).then(
        (value: string) => {
            const request:request.Request = CodeWarsClient.trainCodeChallenge(value);
            let json: string = '';
            request
                .on('data', (data) => { json += data; })
                .on('complete', (response, body) => {
                    let tccr: CwTrainCodeChallengeResponse = JSON.parse(json);
                    previewDescription(tccr);
                })
                .on('error', (e) => {
                    vscode.window.showInformationMessage('No such challenge available!');
                });
        }, (reason: any) => {
            console.log(reason);
        });
}

export function previewDescription(tccr: CwTrainCodeChallengeResponse): void {
    DescriptionContent.setResponse(tccr);
    let challenge = vscode.Uri.parse(`vcw-desc://${tccr.slug}`);
    vscode.commands.executeCommand('vscode.previewHtml', challenge, vscode.ViewColumn.Two, `${tccr.name}`);
}

// this method is called when your extension is deactivated
export function deactivate() {
}