import type { EbookTocGroup } from './ebookReader';

export type EbookFormat = 'pdf' | 'html' | 'json';

export interface EbookJsonColorScheme {
    background: string;
    text: string;
    title: string;
    muted: string;
    accent: string;
}

export interface EbookJsonSection {
    kind?: 'heading' | 'paragraph' | 'quote' | 'list';
    title?: string;
    text?: string;
    level?: number;
    color?: string;
}

export interface EbookJsonDocument {
    title?: string;
    subtitle?: string;
    description?: string;
    theme?: string;
    colors?: Partial<EbookJsonColorScheme>;
    sections?: EbookJsonSection[];
    text?: string;
}

export const defaultEbookJsonColors: EbookJsonColorScheme = {
    background: '#ffffff',
    text: '#1f2937',
    title: '#6d28d9',
    muted: '#64748b',
    accent: '#d4af37',
};

const normalizeHex = (value?: string): string | undefined => {
    if (!value) return undefined;
    const trimmed = value.trim();
    if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(trimmed)) return trimmed;
    return undefined;
};

export const resolveEbookFormat = (sourcePath?: string, explicitFormat?: EbookFormat): EbookFormat => {
    if (explicitFormat) return explicitFormat;
    const extension = (sourcePath || '').split('.').pop()?.toLowerCase();
    if (extension === 'json') return 'json';
    if (extension === 'html' || extension === 'htm') return 'html';
    return 'pdf';
};

export const inferEbookJsonColors = (source?: string): EbookJsonColorScheme => {
    const raw = source || '';
    const match = (variableName: string) => {
        const regex = new RegExp(`--${variableName}:\\s*([^;]+);`, 'i');
        const value = regex.exec(raw)?.[1]?.trim();
        return normalizeHex(value) || defaultEbookJsonColors[variableName === 'bg-body' ? 'background' : variableName === 'text-main' ? 'text' : variableName === 'gold-primary' ? 'title' : variableName === 'text-muted' ? 'muted' : 'accent'];
    };

    const fallback = { ...defaultEbookJsonColors };
    const colors: Partial<EbookJsonColorScheme> = {
        background: match('bg-body') || fallback.background,
        text: match('text-main') || fallback.text,
        title: match('gold-primary') || fallback.title,
        muted: match('text-muted') || fallback.muted,
        accent: match('accent-amber') || fallback.accent,
    };

    return { ...defaultEbookJsonColors, ...colors };
};

const escapeHtml = (value: string): string => value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
}[character] || character));

interface EbookLayoutSection extends EbookJsonSection {
    id: string;
    text: string;
}

interface EbookLayoutPage {
    id: string;
    number: number;
    sections: EbookLayoutSection[];
    wordCount: number;
}

interface EbookJsonLayout {
    pages: EbookLayoutPage[];
    toc: EbookTocGroup[];
}

const normalizeHeadingText = (value: string): string =>
    value.toLocaleLowerCase().replace(/[’']/g, '').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();

const cleanSectionText = (section: EbookJsonSection): string => {
    const text = typeof section.text === 'string' ? section.text : '';
    return text.replace(/\s+/g, ' ').trim();
};

const splitIntoChunks = (text: string, maxWords: number): string[] => {
    const words = text.split(/\s+/);
    const chunks: string[] = [];
    for (let offset = 0; offset < words.length; offset += maxWords) {
        chunks.push(words.slice(offset, offset + maxWords).join(' '));
    }
    return chunks;
};

const buildEbookJsonLayout = (document: EbookJsonDocument): EbookJsonLayout => {
    const sourceSections = Array.isArray(document.sections) && document.sections.length > 0
        ? document.sections
        : [{ kind: 'paragraph' as const, text: document.text || '' }];
    const firstHeadingIndex = sourceSections.findIndex((section) => section.kind === 'heading');
    const meaningfulSections = firstHeadingIndex > 0
        ? sourceSections.slice(firstHeadingIndex)
        : sourceSections;
    const sectionOffset = firstHeadingIndex > 0 ? firstHeadingIndex : 0;
    const documentTitle = normalizeHeadingText(document.title || '');
    const documentSubtitle = normalizeHeadingText(document.subtitle || document.description || '');

    const normalizedSections: EbookLayoutSection[] = meaningfulSections
        .map((section, index) => {
            let text = cleanSectionText(section);
            if (section.kind === 'list') text = text.replace(/^[\s•\u2022\u2023\u25e6*–—-]+/, '').trim();

            const titleText = section.kind === 'heading'
                ? (typeof section.title === 'string' && section.title.trim() ? section.title.trim() : text)
                : text;
            const isTome = /^(?:tome|partie|volume|livre)\s+\d+\b/i.test(text);
            const isChapter = /^(?:chapitre\s+\d+\b|ch\.\s*)/i.test(text);
            if (section.kind !== 'heading' && (isTome || isChapter)) {
                const headingText = text.replace(/^ch\.\s*/i, 'Chapitre ');
                return {
                    ...section,
                    id: `ebook-section-${sectionOffset + index}`,
                    kind: 'heading' as const,
                    level: isTome ? 2 : 3,
                    title: headingText,
                    text: headingText,
                };
            }
            return {
                ...section,
                id: `ebook-section-${sectionOffset + index}`,
                text: titleText,
            };
        })
        .filter((section) => section.text.length > 0);

    if (
        normalizedSections[0]?.kind === 'heading'
        && normalizedSections[0].level === 1
        && (
            normalizeHeadingText(normalizedSections[0].text) === documentTitle
            || documentTitle.startsWith(normalizeHeadingText(normalizedSections[0].text))
        )
    ) {
        normalizedSections.shift();
    }
    if (
        normalizedSections[0]?.kind !== 'heading'
        && documentSubtitle
        && (
            documentSubtitle.startsWith(normalizeHeadingText(normalizedSections[0]?.text || ''))
            || normalizeHeadingText(normalizedSections[0]?.text || '').startsWith(documentSubtitle)
        )
    ) {
        normalizedSections.shift();
    }

    const pages: EbookLayoutPage[] = [{ id: 'ebook-page-1', number: 1, sections: [], wordCount: 0 }];
    const maxWordsPerPage = 280;
    const startPage = () => {
        pages.push({
            id: `ebook-page-${pages.length + 1}`,
            number: pages.length + 1,
            sections: [],
            wordCount: 0,
        });
    };

    normalizedSections.forEach((section) => {
        const words = section.text.split(/\s+/).length;
        const isHeading = section.kind === 'heading';
        if (
            isHeading
            && pages[pages.length - 1].sections.length > 0
            && ((section.level || 1) <= 2 || pages[pages.length - 1].wordCount >= 200)
        ) {
            startPage();
        }

        const chunks = words > maxWordsPerPage
            ? splitIntoChunks(section.text, maxWordsPerPage)
            : [section.text];
        chunks.forEach((chunk, chunkIndex) => {
            let page = pages[pages.length - 1];
            const chunkWords = chunk.split(/\s+/).length;
            if (page.sections.length > 0 && page.wordCount + chunkWords > maxWordsPerPage) {
                startPage();
                page = pages[pages.length - 1];
            }
            page.sections.push({
                ...section,
                id: chunkIndex === 0 ? section.id : `${section.id}-continued-${chunkIndex + 1}`,
                text: chunk,
            });
            page.wordCount += chunkWords;
            if (chunkIndex < chunks.length - 1) startPage();
        });
    });

    const headingLocations = pages.flatMap((page) => page.sections
        .filter((section) => section.kind === 'heading')
        .map((section) => ({
            id: section.id,
            title: section.text,
            level: section.level || 2,
            page: page.number,
        })));
    const toc: EbookTocGroup[] = [];
    headingLocations.forEach((heading) => {
        if (heading.level <= 2) {
            toc.push({ id: heading.id, title: heading.title, page: heading.page, chapters: [] });
            return;
        }
        if (toc.length === 0) {
            toc.push({ id: 'ebook-chapters', title: 'Chapitres', page: heading.page, chapters: [] });
        }
        toc[toc.length - 1].chapters.push(heading);
    });

    if (toc.length === 0) {
        toc.push({
            id: 'ebook-page-index',
            title: 'Pages',
            page: 1,
            chapters: pages.map((page) => {
                const excerpt = page.sections.find((section) => section.kind !== 'heading')?.text
                    || page.sections[0]?.text
                    || '';
                const shortExcerpt = excerpt.split(/\s+/).slice(0, 7).join(' ');
                return {
                    id: page.id,
                    title: shortExcerpt ? `Page ${page.number} — ${shortExcerpt}` : `Page ${page.number}`,
                    level: 3,
                    page: page.number,
                };
            }),
        });
    }

    return { pages, toc };
};

export const buildEbookJsonNavigation = (document: unknown): EbookTocGroup[] => {
    const source = typeof document === 'object' && document !== null ? document as EbookJsonDocument : {};
    return buildEbookJsonLayout(source).toc;
};

export const renderEbookJsonDocument = (
    document: unknown,
    colorOverrides: Partial<EbookJsonColorScheme> = {},
): string => {
    const source = typeof document === 'object' && document !== null ? document as EbookJsonDocument : {};
    const layout = buildEbookJsonLayout(source);
    const sourceColors = source.colors || {};
    const colors: EbookJsonColorScheme = {
        background: normalizeHex(colorOverrides.background) || defaultEbookJsonColors.background,
        text: normalizeHex(colorOverrides.text) || defaultEbookJsonColors.text,
        title: normalizeHex(colorOverrides.title) || normalizeHex(sourceColors.title) || defaultEbookJsonColors.title,
        muted: normalizeHex(colorOverrides.muted) || defaultEbookJsonColors.muted,
        accent: normalizeHex(colorOverrides.accent) || normalizeHex(sourceColors.accent) || defaultEbookJsonColors.accent,
    };
    const title = escapeHtml(source.title || 'Document');
    const subtitle = escapeHtml(source.subtitle || source.description || '');
    const renderedPages = layout.pages.map((page) => `
        <article class="reader-page" id="${page.id}">
          <div class="page-content">
            ${page.number === 1 ? `<h1>${title}</h1>${subtitle ? `<p class="subtitle">${subtitle}</p>` : ''}` : ''}
            ${page.sections.map((section) => {
                const text = escapeHtml(section.text);
                const id = section.kind === 'heading'
                    ? ` id="${section.id}" data-ebook-reader-id="${section.id}"`
                    : '';
                if (section.kind === 'heading') {
                    const level = Math.min(Math.max(section.level || 2, 1), 3);
                    return `<h${level}${id}>${text}</h${level}>`;
                }
                if (section.kind === 'quote') return `<blockquote>${text}</blockquote>`;
                if (section.kind === 'list') return `<ul><li>${text}</li></ul>`;
                if (/^[•\u2022\u2023\u25e6*-]\s*/.test(text)) {
                    return `<ul><li>${text.replace(/^[•\u2022\u2023\u25e6*-]\s*/, '')}</li></ul>`;
                }
                return `<p>${text}</p>`;
            }).join('')}
          </div>
          <footer class="page-number">Page ${page.number}</footer>
        </article>
    `).join('');

    return `<!doctype html>
      <html lang="fr">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
          :root {
            --reader-background: ${colors.background};
            --reader-text: ${colors.text};
            --reader-title: ${colors.title};
            --reader-muted: ${colors.muted};
            --reader-accent: ${colors.accent};
          }
          html { background: #e2e8f0; scroll-behavior: smooth; scroll-padding-top: 16px; }
          body {
            margin: 0;
            padding: 24px 12px;
            background: #e2e8f0;
            color: var(--reader-text);
            font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            line-height: 1.8;
            font-size: 17px;
          }
          .reader-page {
            box-sizing: border-box;
            max-width: 860px;
            min-height: 900px;
            margin: 0 auto 24px;
            padding: clamp(28px, 5vw, 56px);
            display: flex;
            flex-direction: column;
            background: var(--reader-background);
            color: var(--reader-text);
            border: 1px solid #cbd5e1;
            border-radius: 10px;
            box-shadow: 0 8px 26px rgba(15, 23, 42, .1);
          }
          .page-content { flex: 1; }
          h1, h2, h3 {
            color: var(--reader-title);
            line-height: 1.25;
            margin: 1.5em 0 0.7em;
            font-weight: 800;
          }
          h1 { margin-top: 0; }
          h1 { font-size: clamp(28px, 4vw, 42px); }
          h2 { font-size: clamp(22px, 3vw, 30px); }
          h3 { font-size: 22px; }
          p { margin: 0 0 1.2em; color: var(--reader-text); }
          ul { margin: 0 0 1.2em; padding-left: 1.5em; }
          li { padding-left: .25em; color: var(--reader-text); }
          h2, h3 { scroll-margin-top: 16px; }
          blockquote {
            margin: 1.5em 0;
            padding: 1rem 1.2rem;
            border-left: 4px solid var(--reader-accent);
            background: rgba(109,40,217,0.08);
            color: var(--reader-muted);
            border-radius: 0 12px 12px 0;
          }
          .subtitle {
            margin: 0 0 1.5rem;
            color: var(--reader-muted);
            font-size: 0.95rem;
          }
          .page-number {
            margin-top: 32px;
            padding-top: 12px;
            border-top: 1px solid #e2e8f0;
            color: var(--reader-muted);
            text-align: center;
            font-size: 13px;
          }
          @media (max-width: 600px) {
            body { padding: 0; font-size: 16px; }
            .reader-page {
              min-height: 100vh;
              margin: 0 0 12px;
              padding: 28px 22px;
              border-radius: 0;
              box-shadow: none;
            }
          }
        </style>
      </head>
      <body>
        <main>${renderedPages}</main>
      </body>
      </html>`;
};
