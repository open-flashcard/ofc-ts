import { FSRS, Card as FSRSCard, Rating, createEmptyCard, generatorParameters, FSRSParameters, RecordLogItem } from 'ts-fsrs';
import { FlashcardRepository, CardState } from './repository';
import { Card as SchemaCard, Deck } from './index';

export class PracticeEngine {
    private fsrs: FSRS;
    private repo: FlashcardRepository;

    constructor(repo: FlashcardRepository, params?: FSRSParameters) {
        this.repo = repo;
        this.fsrs = new FSRS(params || generatorParameters());
    }

    /**
     * Get all cards from a deck that are due for review.
     * If a card has no FSRS state, it is considered 'New' and due immediately (or managed by new card limits).
     */
    async getDueCards(deckId: string, mode: 'mixed' | 'review' | 'new' = 'mixed', order: 'standard' | 'random' = 'standard'): Promise<SchemaCard[]> {
        const deck = await this.repo.getDeck(deckId);
        if (!deck) {
            throw new Error(`Deck not found: ${deckId}`);
        }

        const dueCards: SchemaCard[] = [];
        const now = new Date();

        for (const card of deck.cards) {
            const state = await this.repo.getCardState(card.id);

            if (!state) {
                // New card
                if (mode === 'mixed' || mode === 'new') {
                    dueCards.push(card);
                }
            } else {
                // Check if due
                if (mode === 'mixed' || mode === 'review') {
                    if (state.due <= now) {
                        dueCards.push(card);
                    }
                }
            }
        }

        // specific sorting logic can be added here (e.g. prioritize learning, then review)
        if (order === 'random') {
            // Fisher-Yates shuffle
            for (let i = dueCards.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [dueCards[i], dueCards[j]] = [dueCards[j], dueCards[i]];
            }
        }

        return dueCards;
    }

    /**
     * Grade a card response.
     * Updates the card's state in the repository and logs the review.
     */
    async gradeCard(cardId: string, rating: Rating): Promise<void> {
        let state = await this.repo.getCardState(cardId);

        if (!state) {
            // Initialize new card state if not present
            state = createEmptyCard() as CardState;
        }

        // FSRS processing
        // ts-fsrs 'repeat' takes the card and current time, returns possibilities for each rating.
        // We select the specific rating chosen by the user.
        const now = new Date();
        const schedulingCards = this.fsrs.repeat(state, now);

        // schedulingCards is a RecordLog (object with keys for Ratings). 
        // We need to look up the result for the specific rating.

        // We cast to any or use a specific type assertion because TypeScript is picky about enum keys
        // and implicit iterators in the type definition
        const result = schedulingCards[rating as unknown as keyof typeof schedulingCards] as RecordLogItem;

        if (!result) {
            throw new Error(`Invalid rating: ${rating}`);
        }

        // Update state
        await this.repo.saveCardState(cardId, result.card as CardState);

        // Log review
        await this.repo.saveReviewLog(cardId, result.log);
    }
}
