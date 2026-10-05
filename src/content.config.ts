// src/content.config.ts

import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import * as s from './lib/content/schemas.ts';

function contentLoader(...patterns: string[]) {
  return glob({
    base: './src/content',
    pattern: [...patterns, '!**/_*'],
    generateId: ({ data }) => String(data.id),
  });
}

export const collections = {

  systems: defineCollection({
    loader: contentLoader('systems/*/index.md'),
    schema: s.systemSchema,
  }),
  concepts: defineCollection({
    loader: contentLoader('concepts/*/index.md'),
    schema: s.conceptSchema,
  }),
  gateways: defineCollection({
    loader: contentLoader('gateways/*/index.md'),
    schema: s.gatewaySchema,
  }),
  sections: defineCollection({
    loader: contentLoader('systems/*/*/index.md', 'concepts/*/*/index.md'),
    schema: s.sectionSchema,
  }),
  gatewaySections: defineCollection({
    loader: contentLoader('gateways/*/*/index.md'),
    schema: s.sectionGatewaySchema,
  }),
  articles: defineCollection({
    loader: contentLoader('systems/*/*/*.md','concepts/*/*/*.md', 'concepts/*/*.md', '!**/index.md'),
    schema: s.articleSchema,
  }),
  gatewayArticles: defineCollection({
    loader: contentLoader('gateways/*/*/*.md', 'gateways/*/*.md', '!**/index.md'),
    schema: s.articleGatewaySchema,
  }),
  tools: defineCollection({
    loader: contentLoader('tools/**/*.md'),
    schema: s.toolSchema,
  }),
  standardSources: defineCollection({
    loader: contentLoader('sources/standards/**/*.yaml'),
    schema: s.standardSourceSchema,
  }),
  bookSources: defineCollection({
    loader: contentLoader('sources/books/**/*.yaml'),
    schema: s.bookSourceSchema,
  }),
  paperSources: defineCollection({
    loader: contentLoader('sources/papers/**/*.yaml'),
    schema: s.paperSourceSchema,
  }),
  reportSources: defineCollection({
    loader: contentLoader('sources/reports/**/*.yaml'),
    schema: s.reportSourceSchema,
  }),
  documentationSources: defineCollection({
    loader: contentLoader('sources/documentation/**/*.yaml'),
    schema: s.documentationSourceSchema,
  }),
  webSources: defineCollection({
    loader: contentLoader('sources/web/**/*.yaml'),
    schema: s.webSourceSchema,
  }),
}