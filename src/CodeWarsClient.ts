import * as vscode from 'vscode';
import * as request from 'request';
import { CW_API_URL } from './CodeWarsConstants';

export interface CwRank {
    id: string;
    name: string;
    color: string;
}

export interface CwCreatedBy {
    username: string;
    url: string;
}

export interface CwSession {
    projectId: string;
    solutionId: string;
    setup: string;
    exampleFixture: string;
    code: string;
}

export interface CwGetCodeChallengeResponse {
    id?: string;
    name?: string;
    slug?: string;
    category?: string;
    publishedAt?: string;
    approvedAt?: string;
    languages?: Array<string>;
    url?: string;
    rank?: CwRank;
    createdBy?: CwCreatedBy;
    approvedBy?: string;
    description?: string;
    totalAttempts?: number;
    totalCompleted?: number;
    totalStars?: number;
    tags?: Array<string>;
}

export interface CwTrainCodeChallengeResponse {
    success?: boolean;
    name?: string;
    slug?: string;
    href?: string;
    description?: string;
    author?: string;
    rank?: string;
    averageCompletion?: number;
    tags?: Array<string>;
    session?: CwSession;
}

export interface CwSolutionResponse {
    success?: boolean;
    dmid?: string;
    valid?: boolean;
    reason?: string;
    output?: Array<string>;
    wall_time: number;
}

export class CodeWarsClient
{
    public static getCodeChallenge(id_or_slug: string): request.Request {
        return request.get(`${CW_API_URL}/code-challenges/${id_or_slug}`);
    }

    public static trainCodeChallenge(id_or_slug: string): request.Request {
        const token = this.getConfigValue('api-access-token');
        const language = this.getConfigValue('language');

        const options: request.CoreOptions = {
            headers: { 'Authorization': token },
        };

        return request.post(`${CW_API_URL}/code-challenges/${id_or_slug}/${language}/train`, options);
    }

    public static trainNextCodeChallenge(strategy: string, peek: boolean = false): request.Request {
        const token = this.getConfigValue('api-access-token');
        const language = this.getConfigValue('language');

        const options: request.CoreOptions = {
            headers: { 'Authorization': token },
            formData: {
                'strategy': strategy,
                'peek': peek ? 'true' : 'false',
            },
        };

        return request.post(`${CW_API_URL}/code-challenges/${language}/train`, options);
    }

    public static peekIntoNextCodeChallenge(strategy: string): request.Request {
        return this.trainNextCodeChallenge(strategy, true);
    }

    public static attemptSolution(project_id: string, solution_id: string, code: string): request.Request {
        const token = this.getConfigValue('api-access-token');

        const options: request.CoreOptions = {
            headers: { 'Authorization': token },
            formData: {
                'code': code,
            },
        };
        return request.post(`${CW_API_URL}/code-challenges/projects/${project_id}/solutions/${solution_id}/attempt`, options);
    }

    public static finalizeSolution(project_id: string, solution_id: string): request.Request {
        const token = this.getConfigValue('api-access-token');

        const options: request.CoreOptions = {
            headers: { 'Authorization': token },
        };

        return request.post(`${CW_API_URL}/code-challenges/projects/${project_id}/solutions/${solution_id}/finalize`, options);
    }

    public static getDeferredResponse(dmid: string): request.Request {
        const token = this.getConfigValue('api-access-token');

        const options: request.CoreOptions = {
            headers: { 'Authorization': token },
        };

        return request.get(`${CW_API_URL}/deferred/${dmid}`, options);
    }


    private static getConfigValue<T>(key: string): T {
        const vcwConfig: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration('vcw');
        if (!vcwConfig.has(key)) {
            vscode.window.showInformationMessage(`Cannot find vcw.${key} value. Please provide it through your config!`);
            return undefined;
        }

        return vcwConfig.get<T>(key);
    }
}