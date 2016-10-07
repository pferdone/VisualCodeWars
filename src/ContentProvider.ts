'use strict';

import * as vscode from 'vscode';
import * as marked from 'marked';

const style = '<style>body, div, dl, dt, dd, ul, ol, li, h1, h2, h3, h4, h5, h6, pre, form, p, blockquote, th, td { margin: 0; padding: 0; font-size: 14px; direction: ltr; } p { font-family: "Lato","Helvetica Neue","Helvetica",sans-serif; font-weight: normal; font-size: 14px; line-height: 1.6; margin-bottom: 16px; } ul, ol { font-size: 14px; line-height: 1.8; margin-bottom: 16px; list-style-position: inside; } ul { list-style: disc; margin-left: 15px; } code { font-family: "CamingoCode-Regular",monospace; : block; padding: 10px; margin-bottom: 15px; font-weight: normal; overflow-x: auto; margin-top: 10px; background-color: rgba(0,0,0,0.4); } li>code { display: inline; padding: 3.33333px; border-radius: 3px; border: 1px solid rgba(255,255,255,0.125); } p>code {display: inline; padding: 3.33333px; border-radius: 3px; border: 1px solid rgba(255,255,255,0.125);} pre code { margin-top: 0; display: block; background-color: rgba(0,0,0,0.4); color: #c5c8c6; padding: 0.5em; overflow-x: auto; font-family: "CamingoCode-Regular",monospace; font-size: 13px; border: 1px solid rgba(255,255,255,0.125); }</style>';

export interface CwResponse {
    success?: boolean;
    name?: string;
    slug?: string;
    href?: string;
    description?: string;
    author?: string;
    rank?: string;
    averageCompletion?: string;
    tags?: Array<string>;
}

export default class DescriptionContent implements vscode.TextDocumentContentProvider
{
    private static _response: CwResponse;

    public static setResponse(obj: CwResponse): void {
        this._response = obj;
    }

    public provideTextDocumentContent(uri: vscode.Uri): string {
        //console.log('DescriptionContent', DescriptionContent._response);
        const res = DescriptionContent._response;
        let description = marked.parse(res.description);
        description = '<h1>Description</h1><br/>'.concat(style.concat(description))
        description = description.concat(`<div><h3>Tags</h3><pre><code>${res.tags.join(', ')}</code></pre></div>`);

        return description;
    }
}