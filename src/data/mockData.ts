import { Product, Currency } from '../types';

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

const coverImage = (imageId: string) =>
    `https://images.unsplash.com/${imageId}?auto=format&fit=crop&w=800&q=85`;

const digitalFormat = [{ name: 'Ebook JSON', hex: '#6d28d9' }];
const usdPerFcfa = (amount: number) => amount / CURRENCIES[0].rate;

const makeAppreciations = (items: Array<{ author: string; rating: number; quote: string; highlight: string }>) =>
    items.map((item, index) => ({ id: `app-${index + 1}`, ...item }));

const makeComments = (items: Array<{ user: string; chapter: string; text: string; rating: number }>) =>
    items.map((item, index) => ({ id: `comment-${index + 1}`, ...item }));

const buildProduct = (book: {
    id: string;
    name: string;
    category: string;
    brand: string;
    price: number;
    rating: number;
    reviewsCount: number;
    image: string;
    preview: string;
    description: string;
    specifications: string;
    ebookStoragePath: string;
    theme: Product['theme'];
    relatedBookIds: string[];
    userAppreciations: Array<{ author: string; rating: number; quote: string; highlight: string }>;
    comments: Array<{ user: string; chapter: string; text: string; rating: number }>;
    isHidden?: boolean;
}): Product => ({
    id: book.id,
    name: book.name,
    category: book.category,
    brand: book.brand,
    price: book.price,
    rating: book.rating,
    reviewsCount: book.reviewsCount,
    images: [book.image],
    backgroundImage: book.image,
    theme: book.theme,
    preview: book.preview,
    description: book.description,
    specifications: book.specifications,
    colors: digitalFormat,
    isNewIn: true,
    isHidden: book.isHidden,
    productType: 'Ebook de formation',
    ebookFormat: 'json',
    ebookStoragePath: book.ebookStoragePath,
    relatedBookIds: book.relatedBookIds,
    userAppreciations: makeAppreciations(book.userAppreciations),
    comments: makeComments(book.comments),
});

export const PRODUCTS: Product[] = [
    buildProduct({
        id: 'livre-09-liberte-financiere',
        isHidden: true,
        name: 'De 0 F à la Liberté Totale',
        category: 'FINANCES',
        brand: 'Vance Sterling',
        price: usdPerFcfa(14000),
        rating: 4.9,
        reviewsCount: 142,
        image: coverImage('photo-1519682337058-a94d519337bc'),
        preview: 'Le vrai power move n’est pas d’économiser plus : c’est de faire circuler de l’argent qui te libère.',
        description: 'Le guide pratique consacré au développement des revenus et à la liberté financière.',
        specifications: 'Livre numérique JSON • Lecture en ligne • Thème finance & libertés individuelles',
        ebookStoragePath: 'formations/livre09_de_0f_a_la_liberte.json',
        theme: { background: '#0f172a', surface: '#111827', accent: '#d4af37', title: '#fef3c7', text: '#e2e8f0', glow: 'rgba(212,175,55,0.35)' },
        relatedBookIds: ['livre-10-pourquoi-tu-es-pauvre', 'livre-11-arrete-de-travailler-dur', 'livre-02-inversion_roles', 'livre-03-art_frustration', 'livre-04-addiction_emotionnelle'],
        userAppreciations: [
            { author: 'Amina', rating: 5, quote: 'J’ai compris que la vraie liberté commence quand on arrête de courir après des paiements et on construit des systèmes.', highlight: 'La règle de l’épargne intelligente' },
            { author: 'Moussa', rating: 5, quote: 'Le chapitre sur l’argent non négociable m’a fait revoir toute ma stratégie.', highlight: 'Le signal de rupture' },
            { author: 'Nadia', rating: 4, quote: 'Le plus fort : ça parle de discipline sans culpabilité. On repart avec une vraie architecture.', highlight: 'Le système de revenu' },
            { author: 'Kossi', rating: 5, quote: 'J’ai appliqué la règle sur mon budget 72h après la lecture et j’ai enfin vu la différence.', highlight: 'L’équilibre de la croissance' },
            { author: 'Sarah', rating: 5, quote: 'C’est le premier livre qui m’a donné un plan simple, lisible et sans blabla.', highlight: 'La libération financière' },
        ],
        comments: [
            { user: 'Béatrice', chapter: 'Règle d’argent', text: 'J’ai adoré la partie sur le fait de ne plus travailler pour survivre. C’est exactement ce que j’avais besoin d’entendre.', rating: 5 },
            { user: 'Yvan', chapter: 'La liberté totale', text: 'La règle que je retiens : tes revenus doivent te rendre indépendant avant même que tu ne te sentes prêt.', rating: 5 },
            { user: 'Mireille', chapter: 'Budget brut', text: 'Le chapitre sur le budget brut m’a beaucoup fascinée car il casse la logique de perte qui nous enferme.', rating: 5 },
            { user: 'Tino', chapter: 'Le système', text: 'J’ai vu une vraie transformation dans la manière de gérer le cashflow sans dramatiser.', rating: 4 },
            { user: 'Estelle', chapter: 'Le signal de rupture', text: 'Ce passage sur la récupération du contrôle de l’argent m’a touchée parce que c’est exactement le moment où j’ai basculé.', rating: 5 },
            { user: 'Hervé', chapter: 'Les sources', text: 'Le conseil sur la diversification des revenus est super clair et immédiatement appliquable.', rating: 5 },
            { user: 'Fanta', chapter: 'L’honnêteté comptable', text: 'J’ai beaucoup aimé la règle sur la vérité financière, parce qu’on ne peut pas guérir ce qu’on refuse de mesurer.', rating: 5 },
            { user: 'Daniel', chapter: 'La libération', text: 'La partie sur l’écart entre ce que tu dépenses et ce que tu produis est une bombe.', rating: 5 },
            { user: 'Lia', chapter: 'Le plan de sortie', text: 'Le livre donne une impulsion très claire pour sortir du piège du salaire sans tomber dans le “je vais m’en sortir plus tard”.', rating: 4 },
            { user: 'Marlon', chapter: 'L’exécution', text: 'C’est le genre de livre qui rend le passage à l’action presque impossible à remettre à demain.', rating: 5 },
        ],
    }),
    buildProduct({
        id: 'livre-10-pourquoi-tu-es-pauvre',
        isHidden: true,
        name: 'Pourquoi tu es encore pauvre',
        category: 'FINANCES',
        brand: 'Vance Sterling',
        price: usdPerFcfa(12000),
        rating: 4.8,
        reviewsCount: 138,
        image: coverImage('photo-1460925895917-afdab827c52f'),
        preview: 'La pauvreté n’est pas un destin : c’est souvent une suite de décisions mal répliquées, que le livre expose sans compromis.',
        description: 'Un livre sur les habitudes financières et les principes de gestion de l’argent.',
        specifications: 'Livre numérique JSON • Lecture en ligne • Thème finance & habitudes',
        ebookStoragePath: 'formations/livre10_pourquoi_tu_es_pauvre.json',
        theme: { background: '#111827', surface: '#1f2937', accent: '#a78bfa', title: '#ddd6fe', text: '#e5e7eb', glow: 'rgba(167,139,250,0.35)' },
        relatedBookIds: ['livre-09-liberte-financiere', 'livre-11-arrete-de-travailler-dur', 'livre-05-psychologie_sombre', 'livre-06-arme_du_silence', 'livre-07-masterclass_chaud_froid'],
        userAppreciations: [
            { author: 'Alex', rating: 5, quote: 'Ce livre m’a donné l’impression d’avoir enfin les lunettes pour comprendre mes erreurs d’argent.', highlight: 'Le schéma de pauvreté' },
            { author: 'Faiza', rating: 5, quote: 'Je n’ai pas seulement lu un livre, j’ai reconnu mes habitudes dans chaque page.', highlight: 'La vérité crue' },
            { author: 'Dorian', rating: 5, quote: 'Le chapitre sur les décisions répétées a été la clé. J’avais la mauvaise routine, pas le mauvais talent.', highlight: 'Le faux confort' },
            { author: 'Claire', rating: 4, quote: 'Le niveau de franchise est brutal, mais c’est précisément ce qui rend le livre si puissant.', highlight: 'La fuite de la responsabilité' },
            { author: 'Ludo', rating: 5, quote: 'À partir du moment où j’ai vu mon propre système, j’ai pu agir sans me sentir coupable.', highlight: 'Le plan de redirection' },
        ],
        comments: [
            { user: 'Noë', chapter: 'Le faux rêve', text: 'Le passage sur le manque d’échelle de pensée m’a énormément touché. C’est vrai qu’on reste petit quand on ne veut pas changer de logique.', rating: 5 },
            { user: 'Sonia', chapter: 'Les habitudes', text: 'Je me reconnais dans beaucoup de situations décrites. Le livre est direct et très utile.', rating: 5 },
            { user: 'Rachid', chapter: 'Le système de fuite', text: 'J’ai adoré la règle qui dit qu’on ne sort pas de la pauvreté sans cesser d’utiliser les mêmes outils mentaux.', rating: 5 },
            { user: 'Yasmine', chapter: 'Le vrai coût', text: 'Le chapitre sur les petits sacrifices aEnchanté l’ensemble, c’est très concret et pas du blabla.', rating: 4 },
            { user: 'Ibrahim', chapter: 'La responsabilisation', text: 'Le livre force à regarder les dépenses comme des décisions, pas comme des accidents. Ça a été très fort.', rating: 5 },
            { user: 'Mélanie', chapter: 'La redirection', text: 'J’ai beaucoup aimé la manière de rendre le redressement financier presque instinctif, sans romantisme.', rating: 5 },
            { user: 'Karim', chapter: 'L’auto-sabotage', text: 'Cette partie sur le délire du “je ne suis pas prêt” m’a fait rire et réfléchir en même temps.', rating: 5 },
            { user: 'Hélène', chapter: 'Le plan', text: 'Le plus précieux, c’est qu’on peut l’appliquer sans attendre un miracle. Très utile.', rating: 4 },
            { user: 'Mickaël', chapter: 'La vérité', text: 'Le livre est on ne peut plus honnête : il prend la croissance personnelle et l’argent comme un système, pas comme un don.', rating: 5 },
            { user: 'Flore', chapter: 'Le déclic', text: 'La dernière règle m’a énormément fasciné : il ne s’agit pas de gagner plus, mais de penser plus gros.', rating: 5 },
        ],
    }),
    buildProduct({
        id: 'livre-11-arrete-de-travailler-dur',
        isHidden: true,
        name: 'Arrête de travailler dur',
        category: 'FINANCES',
        brand: 'Vance Sterling',
        price: 0,
        rating: 4.9,
        reviewsCount: 201,
        image: coverImage('photo-1512820790803-83ca734da794'),
        preview: 'Le vrai gain vient moins du travail acharné que de la manière de créer de la valeur sans dépendre du temps.',
        description: 'Le livre numérique gratuit sur les stratégies financières et la création de revenus.',
        specifications: 'Livre numérique JSON • Gratuit • Lecture en ligne • Thème revenus & efficacité',
        ebookStoragePath: 'formations/livre11_arrete_de_travailler_dur.json',
        theme: { background: '#052e16', surface: '#0f172a', accent: '#4ade80', title: '#dcfce7', text: '#d1fae5', glow: 'rgba(74,222,128,0.28)' },
        relatedBookIds: ['livre-09-liberte-financiere', 'livre-10-pourquoi-tu-es-pauvre', 'livre-01-choc_emotionnel', 'livre-08-exploiter_psy_feminine', 'livre-07-masterclass_chaud_froid'],
        userAppreciations: [
            { author: 'Léa', rating: 5, quote: 'C’est le premier livre qui m’a donné le courage de sortir de la logique “trop de travail, trop peu de revenus”.', highlight: 'Le pouvoir du système' },
            { author: 'Jules', rating: 5, quote: 'La règle la plus forte : le travail intelligent crée de la liberté, pas le travail épuisant.', highlight: 'Le manque de structure' },
            { author: 'Nina', rating: 5, quote: 'J’ai eu le déclic sur la différence entre effort visible et valeur captée.', highlight: 'La déconnexion revenus/heure' },
            { author: 'Olivier', rating: 5, quote: 'Aucune morale, juste des principes utiles et applicables au quotidien.', highlight: 'La capitalisation de valeur' },
            { author: 'Rita', rating: 4, quote: 'Le chapitre sur l’impact du temps m’a beaucoup fasciné parce qu’il révèle le vrai coût de l’inaction.', highlight: 'Le temps est un levier' },
        ],
        comments: [
            { user: 'Ariane', chapter: 'Le travail inutile', text: 'J’ai beaucoup aimé la partie sur le travail inutile : c’est exactement là que la plupart des gens se perdent sans le voir.', rating: 5 },
            { user: 'Patrice', chapter: 'Le déclic', text: 'Le livre remet les priorités à leur place. Travail dur, mais avec une logique de valeur, pas de fatigue inutile.', rating: 5 },
            { user: 'Sonia', chapter: 'Le système', text: 'J’ai admiré la règle sur la création de valeur sans dépendre du temps. C’est la meilleure ligne du livre.', rating: 5 },
            { user: 'Mamadou', chapter: 'La refonte', text: 'C’est le genre de lecture qui te fait remettre les bonnes questions sur la table dès la première page.', rating: 5 },
            { user: 'Mady', chapter: 'Le coût du temps', text: 'Je le recommande surtout à ceux qui travaillent beaucoup mais gagnent peu. Ça ouvre les yeux très vite.', rating: 4 },
            { user: 'Gérald', chapter: 'Le salaire sans liberté', text: 'Le chapitre sur la dépendance au salaire a été le plus marquant pour moi.', rating: 5 },
            { user: 'Mina', chapter: 'La meilleure piste', text: 'Le livre est puissant parce qu’il donne un cadre sans prérequis. On peut commencer très vite.', rating: 5 },
            { user: 'Abdoul', chapter: 'La logique de valeur', text: 'Le passage sur la valeur et la perception de ton travail est excellent. Ça change beaucoup la manière de vendre.', rating: 5 },
            { user: 'Lina', chapter: 'Le bon sens', text: 'J’ai trouvé la proposition très crédible : moins de stress, plus d’impact, plus de liberté.', rating: 4 },
            { user: 'Cedric', chapter: 'La libération', text: 'J’ai gardé le principe : une vie forte ne se construit pas à coups de surmenage, mais par des choix de valeur.', rating: 5 },
        ],
    }),
    buildProduct({
        id: 'ebook-1-mindset-succes',
        name: 'Mindset du Succès : Reprogrammez votre Mental',
        category: 'DEVELOPPEMENT PERSONNEL',
        brand: 'Dr. Kouadio',
        price: usdPerFcfa(15000),
        rating: 4.9,
        reviewsCount: 256,
        image: coverImage('photo-1507003211169-0a1dd7228f2d'),
        preview: 'Découvrez les 7 piliers mentaux qui séparent les gagnants de ceux qui abandonnent.',
        description: 'Un guide complet pour transformer votre façon de penser et adopter les habitudes mentales des hauts performeurs. Basé sur la psychologie cognitive et les neurosciences.',
        specifications: 'Livre numérique JSON • 180 pages • Exercices pratiques inclus • Accès à vie',
        ebookStoragePath: 'ebooks/ebook1_mindset_succes.json',
        theme: { background: '#1a1a2e', surface: '#16213e', accent: '#e94560', title: '#ffd700', text: '#eaeaea', glow: 'rgba(233,69,96,0.35)' },
        relatedBookIds: ['ebook-2-discipline-fer', 'ebook-3-habitudes-gagnantes', 'ebook-4-leadership-interieur'],
        userAppreciations: [
            { author: 'Jean-Marc', rating: 5, quote: 'Ce livre a littéralement changé ma façon d\'aborder les défis quotidiens.', highlight: 'La technique du recadrage' },
            { author: 'Aïcha', rating: 5, quote: 'Les exercices pratiques sont puissants. J\'ai vu des résultats en 2 semaines.', highlight: 'Le journal de victoire' },
            { author: 'Kevin', rating: 4, quote: 'Très bien structuré, facile à lire, concepts profonds mais accessibles.', highlight: 'Les 7 piliers' },
            { author: 'Fatou', rating: 5, quote: 'Le chapitre sur l\'auto-sabotage m\'a ouvert les yeux sur mes propres blocages.', highlight: 'Identifier les patterns' },
        ],
        comments: [
            { user: 'Marc', chapter: 'Pilier 1 - Vision', text: 'La clarification de la vision est l\'exercice le plus puissant que j\'aie fait.', rating: 5 },
            { user: 'Sophie', chapter: 'Pilier 3 - Action', text: 'La règle des 5 secondes a changé ma productivité du jour au lendemain.', rating: 5 },
            { user: 'Ibrahim', chapter: 'Pilier 5 - Résilience', text: 'Apprendre à voir l\'échec comme donnée, pas comme définition. Libérateur.', rating: 5 },
        ],
    }),
    buildProduct({
        id: 'ebook-2-discipline-fer',
        name: 'Discipline de Fer : Maîtrisez l\'Art de la Consistance',
        category: 'DEVELOPPEMENT PERSONNEL',
        brand: 'Coach Marcus',
        price: usdPerFcfa(12000),
        rating: 4.8,
        reviewsCount: 189,
        image: coverImage('photo-1532012197267-da84d127e765'),
        preview: 'La discipline n\'est pas un don, c\'est un système. Apprenez à le construire pas à pas.',
        description: 'Méthode éprouvée pour développer une discipline inébranlable sans volonté surhumaine. Systèmes, routines, et environnement design.',
        specifications: 'Livre numérique JSON • 156 pages • Templates de routines • Tracker d\'habitudes inclus',
        ebookStoragePath: 'ebooks/ebook2_discipline_fer.json',
        theme: { background: '#0d1b2a', surface: '#1b263b', accent: '#00b4d8', title: '#90e0ef', text: '#caf0f8', glow: 'rgba(0,180,216,0.3)' },
        relatedBookIds: ['ebook-1-mindset-succes', 'ebook-3-habitudes-gagnantes', 'ebook-4-leadership-interieur'],
        userAppreciations: [
            { author: 'Pierre', rating: 5, quote: 'Enfin un livre qui ne dit pas "sois discipliné" mais montre COMMENT le devenir.', highlight: 'La règle des 2 minutes' },
            { author: 'Leila', rating: 5, quote: 'Le concept de "design d\'environnement" a tout changé pour moi.', highlight: 'Supprimer la friction' },
            { author: 'Yannick', rating: 4, quote: 'Simple, actionnable, sans fluff. Je l\'ai relu 3 fois déjà.', highlight: 'L\'identité basée sur les habitudes' },
        ],
        comments: [
            { user: 'Amadou', chapter: 'Système vs Volonté', text: 'La distinction système/volonté est la clé. J\'arrête de me blâmer, je construis des systèmes.', rating: 5 },
            { user: 'Nadia', chapter: 'Routine du matin', text: 'Ma routine matinale est passée de 0 à 45 min de focus pur en 10 jours.', rating: 5 },
        ],
    }),
    buildProduct({
        id: 'ebook-3-habitudes-gagnantes',
        name: 'Habitudes Gagnantes : La Science du Changement Durable',
        category: 'COMPETENCES NUMERIQUES',
        brand: 'Prof. Amadou Diallo',
        price: usdPerFcfa(18000),
        rating: 4.9,
        reviewsCount: 312,
        image: coverImage('photo-1481627834876-b7833e8f5570'),
        preview: 'Basé sur les dernières recherches en sciences du comportement. Créez des habitudes qui tiennent.',
        description: 'La science complète de la formation d\'habitudes : boucles de rétroaction, design d\'environnement, identity shift. Avec protocoles 21/66/90 jours.',
        specifications: 'Livre numérique JSON • 220 pages • Protocoles étape par étape • Feuilles de travail téléchargeables',
        ebookStoragePath: 'ebooks/ebook3_habitudes_gagnantes.json',
        theme: { background: '#0f0f23', surface: '#1a1a3e', accent: '#7c3aed', title: '#c4b5fd', text: '#e0e7ff', glow: 'rgba(124,58,237,0.35)' },
        relatedBookIds: ['ebook-1-mindset-succes', 'ebook-2-discipline-fer', 'ebook-4-leadership-interieur'],
        userAppreciations: [
            { author: 'Dr. Komi', rating: 5, quote: 'Rigoureux scientifiquement, mais parfaitement accessible. Rare.', highlight: 'La boucle habitue-récompense' },
            { author: 'Esther', rating: 5, quote: 'Le protocole 66 jours m\'a permis d\'installer la méditation et le sport durablement.', highlight: 'Le tracking sans obsession' },
            { author: 'Moussa', rating: 5, quote: 'J\'ai appliqué le "habit stacking" à mon business. +40% productivité en 1 mois.', highlight: 'L\'empilement d\'habitudes' },
        ],
        comments: [
            { user: 'Salimata', chapter: 'Loi du moindre effort', text: 'Réduire la friction pour les bonnes habitudes, l\'augmenter pour les mauvaises. Génial.', rating: 5 },
            { user: 'Thierry', chapter: 'Identité', text: 'Devenir "quelqu\'un qui fait X" au lieu de "vouloir faire X". Changement de perspective total.', rating: 5 },
            { user: 'Grace', chapter: 'Plaques de croissance', text: 'Comprendre que la stagnation fait partie du processus m\'a sauvé de l\'abandon.', rating: 5 },
        ],
    }),
    buildProduct({
        id: 'ebook-4-leadership-interieur',
        name: 'Leadership Intérieur : Devenez le Leader de votre Vie',
        category: 'ENTREPRENEURIAT',
        brand: 'Mme. Aïssatou Fall',
        price: usdPerFcfa(20000),
        rating: 5.0,
        reviewsCount: 143,
        image: coverImage('photo-1552664730-d307ca884978'),
        preview: 'Le vrai leadership commence par soi. Maîtrisez vos émotions, décisions et impact.',
        description: 'Guide de leadership personnel pour entrepreneurs et cadres : intelligence émotionnelle, prise de décision sous pression, vision stratégique, influence éthique.',
        specifications: 'Livre numérique JSON • 198 pages • Études de cas africaines • Cahier de réflexion inclus',
        ebookStoragePath: 'ebooks/ebook4_leadership_interieur.json',
        theme: { background: '#140f26', surface: '#1e1436', accent: '#d4a843', title: '#fef08a', text: '#fefce8', glow: 'rgba(212,168,67,0.35)' },
        relatedBookIds: ['ebook-1-mindset-succes', 'ebook-2-discipline-fer', 'ebook-3-habitudes-gagnantes'],
        userAppreciations: [
            { author: 'M. Diop', rating: 5, quote: 'Le seul livre de leadership qui parle de nos réalités africaines. Authentique et puissant.', highlight: 'L\'éthique du leader' },
            { author: 'Claire', rating: 5, quote: 'Le chapitre sur la décision sous incertitude m\'a servi en pleine négociation.', highlight: 'Le cadre OODA adapté' },
            { author: 'Ousmane', rating: 5, quote: 'Leadership = service. Ce livre recentre sur l\'essentiel. À relire chaque année.', highlight: 'Le leader serviteur' },
        ],
        comments: [
            { user: 'Awa', chapter: 'Intelligence émotionnelle', text: 'Gérer ses déclencheurs émotionnels avant de gérer les autres. La base.', rating: 5 },
            { user: 'Kofi', chapter: 'Vision stratégique', text: 'L\'exercice de la "lettre à soi-même dans 5 ans" a clarifié ma direction business.', rating: 5 },
            { user: 'Djénéba', chapter: 'Influence éthique', text: 'Convaincre sans manipuler. L\'approche par les valeurs partagées change tout.', rating: 5 },
        ],
    }),
];
