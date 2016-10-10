'use strict';

import * as vscode from 'vscode';
import * as marked from 'marked';
import { CwTrainCodeChallengeResponse } from './CodeWarsClient';
import { CW_BASE_URL } from './CodeWarsConstants';

const style = '<style>body, div, dl, dt, dd, ul, ol, li, h1, h2, h3, h4, h5, h6, pre, form, p, blockquote, th, td { margin: 0; padding: 0; font-size: 14px; direction: ltr; } p { font-family: "Lato","Helvetica Neue","Helvetica",sans-serif; font-weight: normal; font-size: 14px; line-height: 1.6; margin-bottom: 16px; } ul, ol { font-size: 14px; line-height: 1.8; margin-bottom: 16px; list-style-position: inside; } ul { list-style: disc; margin-left: 15px; } code { font-family: "CamingoCode-Regular",monospace; display: block; padding: 10px; margin-bottom: 15px; font-weight: normal; overflow-x: auto; margin-top: 10px; background-color: rgba(0,0,0,0.4); } li>code { display: inline; padding: 3.33333px; border-radius: 3px; border: 1px solid rgba(255,255,255,0.125); } p>code {display: inline; padding: 3.33333px; border-radius: 3px; border: 1px solid rgba(255,255,255,0.125);} pre code { margin-top: 0; margin-right: 15px; display: block; background-color: rgba(0,0,0,0.4); color: #c5c8c6; padding: 0.5em; overflow-x: auto; font-family: "CamingoCode-Regular",monospace; font-size: 13px; border: 1px solid rgba(255,255,255,0.125); } a { color: rgb(155,155,240); }</style>';

export default class DescriptionContent implements vscode.TextDocumentContentProvider
{
    private static _response: CwTrainCodeChallengeResponse;

    public static setResponse(obj: CwTrainCodeChallengeResponse): void {
        this._response = obj;
    }

    public provideTextDocumentContent(uri: vscode.Uri): string {
        //console.log('DescriptionContent', DescriptionContent._response);
        const response = DescriptionContent._response;
        let description = marked.parse(response.description);
        const url = CW_BASE_URL+response.href;
        description = '<br/><h1>Description</h1><br/>'.concat(style.concat(description));
        description = `<br/><a href="${url}">${url}</a><br/>`.concat(style.concat(description));
        description = description.concat(`<div><h3>Tags</h3><pre><code>${response.tags.join(', ')}</code></pre></div>`);

        return description;
    }
}