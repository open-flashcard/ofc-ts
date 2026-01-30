import { Card, Deck } from './index';
import { Card as FSRSCard, RecordLog, ReviewLog } from 'ts-fsrs';

export interface CardState extends FSRSCard {
    // We can extend this if needed, but FSRSCard covers the basics (stability, difficulty, etc.)
    // It tracks: due, stability, difficulty, elapsed_days, scheduled_days, reps, lapses, state, last_review
}

export interface FlashcardRepository {
    /** Retrieves a deck by ID (or path in file-based terms) */
    getDeck(id: string): Promise<Deck | undefined>;

    /** Retrieves FSRS state for a specific card */
    getCardState(cardId: string): Promise<CardState | undefined>;

    /** Saves the updated FSRS state */
    saveCardState(cardId: string, state: CardState): Promise<void>;

    /** (Optional) Retrieves practice history */
    getReviewLog(cardId: string): Promise<ReviewLog[]>;

    /** (Optional) Saves a review attempt */
    saveReviewLog(cardId: string, log: ReviewLog): Promise<void>;
}
