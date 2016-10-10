import * as vscode from 'vscode';

export const CW_BASE_URL: string = 'https://www.codewars.com';
export const CW_API_URL: string = 'https://www.codewars.com/api/v1';

export const STRATEGY_PICKS: Array<vscode.QuickPickItem> = [
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