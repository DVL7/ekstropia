// src/lib/content/rules.ts

const REQUIRES_REVIEW_DATE: string[] = ['review', 'published', 'needs-review'];

export function hasReviewDate(a: { status: string; lastReviewed?: Date }) {
    if (REQUIRES_REVIEW_DATE.includes(a.status)) {
        return a.lastReviewed !== undefined;
    }
    return true;
}

export const reviewDateError = {
    error: 'Status require lastReviewed',
    path: ['lastReviewed'],
}