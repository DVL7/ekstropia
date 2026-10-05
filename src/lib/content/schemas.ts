// src/lib/content/schemas.ts
/*
File defines frontmatter model for content in src/content/*. 
Fields like `slug` and `redirectFrom` (previous slugs) are automatically
generated and out of schemas.ts.
Fields `id` automatically fill `from new-entry` and validated separately.
Fields `order` validated separately.
Rule: published content needs `lastReviewed` validated by `rules.ts`. 
*/
import { z } from 'astro/zod';
import {hasReviewDate, reviewDateError } from './rules.ts'


// status for content
const publishedStatus = z.enum([
    'planned',
    'researching',
    'draft',
    'review',
    'published',
    'needs-review',
    'archived',
]);

// global atlas node
export const atlasNodeSchema = z.strictObject({
    targetId: z.string().min(1),
    title: z.string().optional(),
    layer: z.enum(['A0','A1', 'A2', 'A3', 'A4']),
    summary: z.string().min(1),
});

// shared by system, concept and gateway
export const contextFields = z.strictObject({
    id: z.string().min(1),
    title: z.string().min(1),
    aliases: z.array(z.string()).default([]),  // alternative titles
    summary: z.string().min(1),
    status: publishedStatus,
    lastReviewed: z.coerce.date().optional(),
})

// shared by sections in different types of contents
export const sectionFields = z.strictObject({
    id: z.string().min(1),
    title: z.string().min(1),
    aliases: z.array(z.string()).default([]),  // alternative titles
    summary: z.string().min(1),
    learningGoal: z.string().min(1),
    status: publishedStatus,
    order: z.int().min(1),  
});

// shared by articles in different types of contents
export const articleFields = z.strictObject({
    id: z.string().min(1),
    title: z.string().min(1),
    aliases: z.array(z.string()).default([]),  // alternative titles
    keywords: z.array(z.string()).default([]),
    summary: z.string().min(1),
    status: publishedStatus,
    changeSensitivity: z.enum(['low', 'medium', 'high']),
    order: z.int().min(1),  
    lastReviewed: z.coerce.date().optional(),
});

// shared in different types of sources
export const sourceFields = z.strictObject({
    id: z.string().min(1),
    title: z.string().min(1),
    authors: z.array(z.string()).min(1),
    published: z.coerce.date().optional(),
    url: z.url({ protocol: /^https?$/ }).optional(),
    notes: z.string().optional(),
});

// A2/A3 layer
export const systemSchema = z.strictObject({
    ...contextFields.shape,
    scope: z.string().min(1),
    coverage: z.enum(['planned', 'in-progress', 'core-complete']),
}).refine(hasReviewDate, reviewDateError);

// A0/A1 layer
export const conceptSchema = z.strictObject({
    ...contextFields.shape,
    scope: z.string().optional(),
    coverage: z.enum(['topic-bucket', 'planned', 'in-progress', 'core-complete']),
}).refine(
  (c) => c.coverage === 'topic-bucket' || !!c.scope,
  { error: 'concept requires scope unless coverage is "topic-bucket"', path: ['scope'] }
).refine(hasReviewDate, reviewDateError);

// A4 layer
export const gatewaySchema = z.strictObject({
    ...contextFields.shape,
    entryQuestion: z.string().min(1),
}).refine(hasReviewDate, reviewDateError);

// for system and concept sections
export const sectionSchema = z.strictObject({
    ...sectionFields.shape,
    scope: z.string().min(1),
})

// for gateway sections
export const sectionGatewaySchema = z.strictObject({
    ...sectionFields.shape,
    entryQuestion: z.string().min(1),
})

// for system and concept articles
export const articleSchema = z.strictObject({
    ...articleFields.shape,
}).refine(hasReviewDate, reviewDateError);

// for gateway articles
export const articleGatewaySchema = z.strictObject({
    ...articleFields.shape,
    entryQuestion: z.string().min(1),
}).refine(hasReviewDate, reviewDateError);

// common for every types of tools
export const toolSchema = z.strictObject({
    id: z.string().min(1),
    title: z.string().min(1),
    summary: z.string().min(1),
    status: publishedStatus, 
    learningGoal: z.string().min(1),
    fallbackDescription: z.string().min(1),  // description which describe the goal, can replace the tool
    standalone: z.boolean(),                 // false = embedded in article, true has own route
    lastReviewed: z.coerce.date().optional(),
}).refine(hasReviewDate, reviewDateError);

export const standardSourceSchema = z.strictObject({
    ...sourceFields.shape,  
    designation: z.string().min(1),  // example: `RFC-1034`, `ISO-8601`, `IEEE-802.11`
});

export const bookSourceSchema = z.strictObject({
    ...sourceFields.shape,
    isbn: z.string().optional(),  // example: ISBN-10, ISBN-13
    publisher: z.string().optional(),
    edition: z.string().optional(),
});

export const paperSourceSchema = z.strictObject({
    ...sourceFields.shape,
    doi: z.string().optional(),  // example: 10.<prefiks>/<sufiks>` without `https://doi.org/`
    venue: z.string().optional(),
});

export const reportSourceSchema = z.strictObject({
    ...sourceFields.shape,
    publisher: z.string().optional(),
});

export const documentationSourceSchema = z.strictObject({
    ...sourceFields.shape,
    url: z.url({ protocol: /^https?$/ }),
    accessedAt: z.coerce.date(),
    version: z.string().optional(),
});

export const webSourceSchema = z.strictObject({
    ...sourceFields.shape,
    url: z.url({ protocol: /^https?$/ }),
    accessedAt: z.coerce.date(),
});
