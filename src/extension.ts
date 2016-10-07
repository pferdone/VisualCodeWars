'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as request from 'request';

import DescriptionContent, {CwResponse} from './ContentProvider';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "visualcodewars" is now active!');

    vscode.workspace.registerTextDocumentContentProvider('vcw-desc', new DescriptionContent());

    context.subscriptions.push(vscode.commands.registerCommand('vcw.peekNextChallenge', peekNextCodeChallenge));
    context.subscriptions.push(vscode.commands.registerCommand('vcw.trainSpecificChallenge', trainSpecificChallenge));
}

export function peekNextCodeChallenge() {
    const quickPicks = [
        {
            label: 'default',
            description: 'Also referred to as the “Rank Up” workout. Will select a challenge that is above your current level.',
        },
        {
            label: 'random',
            description: 'Randomly selected code challenges',
        },
        {
            label: 'reference_workout',
            description: 'Will select code challenges that are tagged as reference.',
        },
        {
            label: 'beta_workout',
            description: 'Will select beta code challenges.',
        },
        {
            label: 'retrain_workout',
            description: 'Will focus on code challenges that you have already completed.',
        },
        {
            label: 'algorithm_retest',
            description: 'Will focus on algorithm code challenges that you have already completed.',
        },
        {
            label: 'kyu_8_workout',
            description: 'Will focus on 8 kyu code challenges.',
        },
        {
            label: 'kyu_7_workout',
            description: 'Will focus on 7 kyu code challenges.',
        },
        {
            label: 'kyu_6_workout',
            description: 'Will focus on 6 kyu code challenges.',
        },
        {
            label: 'kyu_5_workout',
            description: 'Will focus on 5 kyu code challenges.',
        },
        {
            label: 'kyu_4_workout',
            description: 'Will focus on 4 kyu code challenges.',
        },
        {
            label: 'kyu_3_workout',
            description: 'Will focus on 3 kyu code challenges.',
        },
        {
            label: 'kyu_2_workout',
            description: 'Will focus on 2 kyu code challenges.',
        },
        {
            label: 'kyu_1_workout',
            description: 'Will focus on 1 kyu code challenges.',
        },
    ];
    vscode.window.showQuickPick<any>(quickPicks).then(
        (value: vscode.QuickPickItem) => {
            getNextChallenge(value.label);
        }, (reason: any) => {
            console.log(reason);
        });
}

export function trainSpecificChallenge() {
    let options: vscode.InputBoxOptions = {
        ignoreFocusOut: true,
        placeHolder: 'Input code challenge slug',
        prompt: "The slug for '../kata/disease-spread' would be 'disease-spread'"
    };

    vscode.window.showInputBox(options).then(
        (value: string) => {
            console.log(value);
        }, (reason: any) => {
            console.log(reason);
        });
}

export function getNextChallenge(strategy: string) {
    let vcwConfig: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration('vcw');
    if (!vcwConfig.has('api-access-token')) {
        vscode.window.showInformationMessage('Please provide an access token!');
        return;
    }

    if (!vcwConfig.has('language')) {
        vscode.window.showInformationMessage('Please provide a programming language!');
        return;
    }

    let token: string = vcwConfig.get<string>('api-access-token');
    let language: string = vcwConfig.get<string>('language');

    let options: request.RequiredUriUrl & request.CoreOptions = {
        url: `https://www.codewars.com/api/v1/code-challenges/${language}/train`,
        method: 'POST',
        headers: {
            'Authorization': token,
        },
        formData: {
            'strategy': strategy,
            'peek': 'peek',
        },
    };

    request(options, (error, response, body): void => {
        if (response.statusCode==200) {
            let json: CwResponse = JSON.parse(body);
            console.log(json);
            DescriptionContent.setResponse(json);
            let challenge = vscode.Uri.parse('vcw-desc://challenge');
            vscode.commands.executeCommand('vscode.previewHtml', challenge, vscode.ViewColumn.Two, json.name+json.rank);
        } else {
            console.log(error);
        }
    });
}

// this method is called when your extension is deactivated
export function deactivate() {
}