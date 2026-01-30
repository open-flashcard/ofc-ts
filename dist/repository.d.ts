import { Deck } from './index';
import { Card as FSRSCard, ReviewLog } from 'ts-fsrs';
export interface CardState extends FSRSCard {
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
//# sourceMappingURL=repository.d.ts.map