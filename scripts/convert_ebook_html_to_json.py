from __future__ import annotations

import html
import json
import re
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ASSET_DIR = ROOT / 'dist' / 'assets'

COLOR_KEYS = {
    'bg-body': 'background',
    'text-main': 'text',
    'gold-primary': 'title',
    'text-muted': 'muted',
    'accent-amber': 'accent',
}


def normalize_hex(value: str | None) -> str | None:
    if not value:
        return None
    value = value.strip()
    if re.fullmatch(r'#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})', value):
        return value.lower()
    return None


class EbookExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.title = ''
        self.description = ''
        self.theme = 'dark'
        self.sections = []
        self._in_title = False
        self._current_heading = None
        self._current_section = None
        self._current_list = None
        self._seen_text = []

    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        if tag == 'title':
            self._in_title = True
        if tag in {'h1', 'h2', 'h3'}:
            level = int(tag[1])
            self._current_heading = {'kind': 'heading', 'level': level, 'title': '', 'text': ''}
        elif tag == 'p':
            self._current_section = {'kind': 'paragraph', 'text': ''}
        elif tag == 'blockquote':
            self._current_section = {'kind': 'quote', 'text': ''}
        elif tag == 'li':
            if self._current_list is None:
                self._current_list = {'kind': 'list', 'text': ''}
            self._current_list['text'] += '• '
        if tag == 'meta' and str(attrs_dict.get('name', '')).lower() == 'description':
            self.description = str(attrs_dict.get('content', '')).strip()
        if 'data-theme' in attrs_dict:
            self.theme = str(attrs_dict['data-theme'])

    def handle_endtag(self, tag):
        if tag == 'title':
            self._in_title = False
        if tag in {'h1', 'h2', 'h3'} and self._current_heading is not None:
            cleaned = re.sub(r'\s+', ' ', self._current_heading['text']).strip()
            if cleaned:
                self.sections.append({'kind': 'heading', 'level': self._current_heading['level'], 'title': cleaned, 'text': cleaned})
            self._current_heading = None
        elif tag in {'p', 'blockquote'} and self._current_section is not None:
            cleaned = re.sub(r'\s+', ' ', self._current_section['text']).strip()
            if cleaned:
                self.sections.append({'kind': self._current_section['kind'], 'text': cleaned})
            self._current_section = None
        elif tag == 'li' and self._current_list is not None:
            cleaned = re.sub(r'\s+', ' ', self._current_list['text']).strip()
            if cleaned:
                self.sections.append({'kind': 'list', 'text': cleaned})
            self._current_list = None

    def handle_data(self, data):
        text = data.strip()
        if not text:
            return
        if self._in_title:
            self.title = (self.title + ' ' + text).strip()
            return
        if self._current_heading is not None:
            self._current_heading['text'] += ' ' + text
            return
        if self._current_section is not None:
            self._current_section['text'] += ' ' + text
            return
        if self._current_list is not None:
            self._current_list['text'] += text + ' '
            return
        self._seen_text.append(text)

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        self.handle_endtag(tag)


def extract_colors(html_text: str) -> dict:
    colors = {
        'background': '#f8fafc',
        'text': '#1f2937',
        'title': '#6d28d9',
        'muted': '#64748b',
        'accent': '#d4af37',
    }
    for var_name, key in COLOR_KEYS.items():
        match = re.search(rf'--{var_name}:\s*([^;]+);', html_text)
        if match:
            value = normalize_hex(match.group(1).strip())
            if value:
                colors[key] = value
    return colors


def extract_description(html_text: str) -> str:
    meta_match = re.search(r'<meta\s+name=["\']description["\']\s+content=["\']([^"\']+)["\']', html_text, re.I)
    if meta_match:
        return html.unescape(re.sub(r'\s+', ' ', meta_match.group(1)).strip())
    return ''


def normalized_label(value: str) -> str:
    value = html.unescape(value).lower().replace('’', "'")
    return re.sub(r'[^a-z0-9]+', ' ', value).strip()


def normalize_sections(sections: list[dict], title: str, subtitle: str) -> list[dict]:
    heading_index = next(
        (index for index, section in enumerate(sections) if section.get('kind') == 'heading'),
        -1,
    )
    if heading_index > 0:
        sections = sections[heading_index:]

    normalized = []
    for section in sections:
        section = dict(section)
        text = re.sub(r'\s+', ' ', str(section.get('text', ''))).strip()
        if section.get('kind') == 'list':
            text = re.sub(r'^[\s•\u2022\u2023\u25e6*–—-]+', '', text).strip()
        if not text:
            continue

        is_tome = re.match(r'^(?:tome|partie|volume|livre)\s+\d+\b', text, re.I)
        is_chapter = re.match(r'^(?:chapitre\s+\d+\b|ch\.\s*)', text, re.I)
        if section.get('kind') != 'heading' and (is_tome or is_chapter):
            text = re.sub(r'^ch\.\s*', 'Chapitre ', text, flags=re.I)
            section.update({
                'kind': 'heading',
                'level': 2 if is_tome else 3,
                'title': text,
                'text': text,
            })
        else:
            section['text'] = text
            if section.get('kind') == 'heading':
                section['title'] = re.sub(r'\s+', ' ', str(section.get('title') or text)).strip()
        normalized.append(section)

    if normalized and normalized[0].get('kind') == 'heading' and normalized[0].get('level') == 1:
        first_title = normalized_label(str(normalized[0].get('title', '')))
        document_title = normalized_label(title)
        if first_title and (document_title.startswith(first_title) or first_title.startswith(document_title)):
            normalized.pop(0)

    if normalized and normalized[0].get('kind') != 'heading' and subtitle:
        first_text = normalized_label(str(normalized[0].get('text', '')))
        document_subtitle = normalized_label(subtitle)
        if first_text and (
            document_subtitle.startswith(first_text)
            or first_text.startswith(document_subtitle)
        ):
            normalized.pop(0)

    return normalized


def build_document(html_path: Path) -> dict:
    html_text = html_path.read_text(encoding='utf-8', errors='ignore')
    extractor = EbookExtractor()
    extractor.feed(html_text)
    title = extractor.title.strip() or html_path.stem.replace('_', ' ').replace('-', ' ').title()
    description = extractor.description or extract_description(html_text)
    colors = extract_colors(html_text)
    sections = normalize_sections(extractor.sections, title, description)
    if not sections:
        text_lines = [re.sub(r'\s+', ' ', item).strip() for item in extractor._seen_text if re.sub(r'\s+', ' ', item).strip()]
        sections = [{'kind': 'paragraph', 'text': ' '.join(text_lines).strip()}] if text_lines else []
    text = ' '.join(section.get('text', '') for section in sections).strip()

    payload = {
        'title': title,
        'subtitle': description,
        'description': description,
        'theme': extractor.theme,
        'colors': colors,
        'sections': sections,
        'text': text,
        'source': html_path.name,
        'format': 'json',
    }
    return payload


if __name__ == '__main__':
    for html_path in sorted(ASSET_DIR.glob('*.html')):
        if html_path.name == 'index.html':
            continue
        doc = build_document(html_path)
        out_path = html_path.with_suffix('.json')
        out_path.write_text(json.dumps(doc, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
        print(f'Exported {html_path.name} -> {out_path.name}')

    for json_path in sorted(ASSET_DIR.glob('livre*.json')):
        doc = json.loads(json_path.read_text(encoding='utf-8'))
        doc['sections'] = normalize_sections(
            doc.get('sections', []),
            str(doc.get('title', '')),
            str(doc.get('subtitle') or doc.get('description') or ''),
        )
        doc['text'] = ' '.join(section.get('text', '') for section in doc['sections']).strip()
        json_path.write_text(json.dumps(doc, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
        print(f'Normalized {json_path.name}')
