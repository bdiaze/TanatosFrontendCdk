import { Injectable } from '@angular/core';
import DOMPurify from 'dompurify';

@Injectable({
    providedIn: 'root',
})
export class HtmlSanitizerHelper {
    private configured = false;

    constructor() {
        this.configure();
    }

    private configure(): void {
        if (this.configured) return;

        DOMPurify.addHook('uponSanitizeAttribute', (node, data) => {
            if (data.attrName === 'class') {
                const allowed = /^ql-indent-[1-8]$/;

                if (!allowed.test(data.attrValue)) {
                    data.keepAttr = false;
                }
            }
        });

        DOMPurify.addHook('afterSanitizeAttributes', (node: any) => {
            if (node.tagName === 'A') {
                node.setAttribute('rel', 'noopener noreferrer');
                node.setAttribute('target', '_blank');
            }
        });

        this.configured = true;
    }

    sanitizeQuill(html: string | null | undefined): string | null | undefined {
        if (!html) return html;

        return DOMPurify.sanitize(html, {
            ALLOWED_TAGS: [
                // base
                'p',
                'br',

                // texto
                'strong',
                'b',
                'em',
                'i',
                'u',
                's',
                'strike',

                // estructura
                'blockquote',

                // headers
                'h1',
                'h2',
                'h3',

                // script
                'sub',
                'sup',

                // listas
                'ul',
                'ol',
                'li',

                // links
                'a',
            ],

            ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],

            // Solo http, https
            ALLOWED_URI_REGEXP: /^(?:(?:https?):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
        });
    }
}
