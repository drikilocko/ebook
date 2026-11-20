export interface EbookHeading {
    id: string;
    title: string;
    level: number;
    page?: number;
}

export interface EbookTocGroup {
    id: string;
    title: string;
    chapters: EbookHeading[];
    page?: number;
}

const TOME_HEADING = /^(?:tome|volume|vol\.?|livre)\s+\d+/i;

export const groupEbookHeadings = (headings: EbookHeading[]): EbookTocGroup[] => {
    const groups: EbookTocGroup[] = [];

    headings.forEach((heading) => {
        const startsTome = TOME_HEADING.test(heading.title);
        const startsSection = startsTome || heading.level === 1;
        if (startsSection) {
            groups.push({
                id: heading.id,
                title: heading.title,
                chapters: [],
            });
        } else if (groups.length === 0) {
            groups.push({ id: 'ebook-contents', title: 'Sommaire', chapters: [] });
        }

        if (!startsTome && !(heading.level === 1 && headings.some((item) => TOME_HEADING.test(item.title)))) {
            groups[groups.length - 1].chapters.push(heading);
        }
    });

    if (groups.length > 1 && groups[0].id === 'ebook-contents' && groups[0].chapters.length === 0) {
        return groups.slice(1);
    }

    return groups;
};

export const EBOOK_READER_CSS = `
    :root {
        color-scheme: light;
        --reader-background: #ffffff;
        --reader-text: #263248;
        --reader-title: #6d28d9;
    }
    html { background: #e2e8f0 !important; scroll-behavior: smooth; }
    body {
        box-sizing: border-box !important;
        max-width: 860px !important;
        min-height: 100vh !important;
        margin: 32px auto !important;
        padding: clamp(24px, 6vw, 72px) !important;
        background: var(--reader-background) !important;
        color: var(--reader-text) !important;
        border: 1px solid #e2e8f0 !important;
        border-radius: 20px !important;
        box-shadow: 0 16px 48px rgba(15, 23, 42, .08) !important;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif !important;
        font-size: 17px !important;
        line-height: 1.85 !important;
        overflow-wrap: anywhere !important;
    }
    h1, h2, h3, h4 {
        color: var(--reader-title) !important;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif !important;
        font-weight: 800 !important;
        line-height: 1.3 !important;
        margin: 2em 0 .7em !important;
        scroll-margin-top: 24px;
    }
    h1 { font-size: clamp(30px, 5vw, 42px) !important; }
    h2 { font-size: clamp(24px, 4vw, 32px) !important; }
    h3 { font-size: 22px !important; }
    p, li { color: var(--reader-text) !important; font-size: 17px !important; line-height: 1.85 !important; }
    a { color: #6d28d9 !important; }
    img, video, table { max-width: 100% !important; }
    img { height: auto !important; border-radius: 12px; }
    table { display: block; overflow-x: auto; border-collapse: collapse; }
    th, td { padding: 10px 12px; border: 1px solid #e2e8f0; }
    blockquote {
        margin: 24px 0 !important;
        padding: 16px 20px !important;
        border-left: 4px solid #8b5cf6 !important;
        border-radius: 0 12px 12px 0 !important;
        background: #f5f3ff !important;
        background: color-mix(in srgb, var(--reader-title) 8%, white) !important;
        color: var(--reader-text) !important;
    }
    pre, code { max-width: 100%; overflow-x: auto; white-space: pre-wrap; }
    @media (max-width: 600px) {
        html { background: var(--reader-background) !important; }
        body {
            width: auto !important;
            max-width: none !important;
            min-height: 100vh !important;
            margin: 0 !important;
            padding: 24px 20px !important;
            border: 0 !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            font-size: 16px !important;
        }
        p, li { font-size: 16px !important; }
    }
`;

export const createEbookReaderScript = (): string => {
    const css = JSON.stringify(EBOOK_READER_CSS);
    return `
        (function() {
            var style = document.createElement('style');
            style.textContent = ${css};
            (document.head || document.documentElement).appendChild(style);
            var headings = Array.prototype.slice.call(document.querySelectorAll('h1, h2, h3'));
            var items = headings.map(function(heading, index) {
                var id = 'ebook-heading-' + index;
                heading.setAttribute('data-ebook-reader-id', id);
                return {
                    id: id,
                    title: (heading.textContent || '').trim().slice(0, 180),
                    level: Number(heading.tagName.substring(1))
                };
            }).filter(function(item) { return item.title.length > 0; });
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'ebook-toc', headings: items }));
        })();
        true;
    `;
};

export interface EbookNavItem {
    id: string;
    title: string;
    level: number;
    page?: number;
    isGroup: boolean;
}

/** Flattens the table of contents into reading order (groups first, then their chapters). */
export const flattenEbookNavigation = (groups: EbookTocGroup[]): EbookNavItem[] => {
    const items: EbookNavItem[] = [];
    const seen = new Set<string>();
    groups.forEach((group) => {
        const isSynthetic = group.id === 'ebook-contents' || group.id === 'ebook-chapters' || group.id === 'ebook-page-index';
        if (!isSynthetic && !seen.has(group.id)) {
            seen.add(group.id);
            items.push({ id: group.id, title: group.title, level: 1, page: group.page, isGroup: true });
        }
        group.chapters.forEach((chapter) => {
            if (seen.has(chapter.id)) return;
            seen.add(chapter.id);
            items.push({ id: chapter.id, title: chapter.title, level: chapter.level, page: chapter.page, isGroup: false });
        });
    });
    return items;
};

/** Extra CSS that keeps the last lines readable above the floating mobile navigation bar. */
export const EBOOK_NAV_SPACER_CSS = `
    html { scroll-padding-top: 16px; }
    body::after { content: ""; display: block; height: 112px; }
`;

/**
 * Browser-side scroll spy shared by the web iframe and native WebViews.
 * Calls `report(activeId, progress)` whenever the reading position changes.
 */
export const EBOOK_SCROLL_SPY_SOURCE = `
    function installEbookScrollSpy(win, report, withSpacer) {
        var doc = win.document;
        if (!doc || doc.__ebookSpyInstalled) return;
        doc.__ebookSpyInstalled = true;
        if (withSpacer) {
            var spacer = doc.createElement('style');
            spacer.textContent = ${JSON.stringify(EBOOK_NAV_SPACER_CSS)};
            (doc.head || doc.documentElement).appendChild(spacer);
        }
        var lastId = null;
        var lastProgress = -1;
        var ticking = false;
        function targets() {
            var marked = doc.querySelectorAll('[data-ebook-reader-id]');
            return marked.length ? marked : doc.querySelectorAll('.reader-page[id]');
        }
        function measure() {
            ticking = false;
            var list = targets();
            var threshold = win.innerHeight * 0.3;
            var activeId = null;
            for (var i = 0; i < list.length; i++) {
                if (list[i].getBoundingClientRect().top <= threshold) {
                    activeId = list[i].getAttribute('data-ebook-reader-id') || list[i].id;
                } else {
                    break;
                }
            }
            var root = doc.scrollingElement || doc.documentElement;
            var max = Math.max(1, root.scrollHeight - win.innerHeight);
            var progress = Math.min(1, Math.max(0, (win.scrollY || root.scrollTop) / max));
            progress = Math.round(progress * 200) / 200;
            if (activeId !== lastId || progress !== lastProgress) {
                lastId = activeId;
                lastProgress = progress;
                report(activeId, progress);
            }
        }
        function onScroll() {
            if (!ticking) {
                ticking = true;
                (win.requestAnimationFrame || setTimeout)(measure);
            }
        }
        win.addEventListener('scroll', onScroll, { passive: true });
        win.addEventListener('resize', onScroll);
        measure();
    }
`;

export const createEbookScrollSpyScript = (withSpacer: boolean): string => `
    (function() {
        ${EBOOK_SCROLL_SPY_SOURCE}
        installEbookScrollSpy(window, function(activeId, progress) {
            if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'ebook-progress', activeId: activeId, progress: progress }));
            }
        }, ${withSpacer ? 'true' : 'false'});
    })();
    true;
`;
