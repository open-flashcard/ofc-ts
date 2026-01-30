import { Rating, FSRSParameters } from 'ts-fsrs';
import { FlashcardRepository } from './repository';
import { Card as SchemaCard } from './index';
export declare class PracticeEngine {
    private fsrs;
    private repo;
    constructor(repo: FlashcardRepository, params?: FSRSParameters);
    /**
     * Get all cards from a deck that are due for review.
     * If a card has no FSRS state, it is considered 'New' and due immediately (or managed by new card limits).
     */
    getDueCards(deckId: string, mode?: 'mixed' | 'review' | 'new', order?: 'standard' | 'random'): Promise<SchemaCard[]>;
    /**
     * Grade a card response.
     * Updates the card's state in the repository and logs the review.
     */
    gradeCard(cardId: string, rating: Rating): Promise<void>;
}
//# sourceMappingURL=engine.d.ts.map