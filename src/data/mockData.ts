import { Currency } from '../types';

export const CURRENCIES: Currency[] = [
    { code: 'FCFA', symbol: 'CFA ', rate: 610 },
    { code: 'USD', symbol: '$', rate: 1 },
    { code: 'EUR', symbol: '€', rate: 0.92 },
    { code: 'GBP', symbol: '£', rate: 0.79 },
];

export const CATEGORIES = [
    { id: 'ALL', name: 'TOUTES LES FORMATIONS', icon: 'grid' },
    { id: 'ENTREPRENEURIAT', name: 'ENTREPRENEURIAT', thumbnail: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=300&q=80' },
    { id: 'MARKETING DIGITAL', name: 'MARKETING DIGITAL', thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=300&q=80' },
    { id: 'FINANCES', name: 'FINANCES', thumbnail: 'https://images.unsplash.com/photo-1468254095677-bbcba94a7066?auto=format&fit=crop&w=300&q=80' },
    { id: 'DEVELOPPEMENT PERSONNEL', name: 'DÉVELOPPEMENT PERSONNEL', thumbnail: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80' },
    { id: 'COMPETENCES NUMERIQUES', name: 'COMPÉTENCES NUMÉRIQUES', thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=300&q=80' },
];
