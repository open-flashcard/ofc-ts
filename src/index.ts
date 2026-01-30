export * from './schema/generated';
import * as Schema from './schema/generated';

// Re-export specific ts-fsrs types that consumers might need
export { Rating, State, FSRSParameters, generatorParameters, ReviewLog, RecordLog } from 'ts-fsrs';

export * from './repository';
export * from './repositories/json-repository';
export * from './engine';

// Aliases for convenience and compatibility with previous code
export type Deck = Schema.OpenFlashcardStandardDeck;
export type Card = Schema.Card;
export type Side = Schema.Side;

// Construct a strict Union type for Content to replace the loose object from schema
export type Content =
    | Schema.ContentText
    | Schema.ContentMarkdown
    | Schema.ContentHtml
    | Schema.ContentLatex
    | Schema.ContentImage
    | Schema.ContentAudio
    | Schema.ContentVideo
    | Schema.ContentTts
    | Schema.ContentMermaid
    | Schema.ContentCode
    | Schema.ContentList
    | Schema.ContentMultipleChoice
    | Schema.ContentCustom
    | Schema.ContentUrl;

// Helper to check content type (type guard concepts could be added here)
