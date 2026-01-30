"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PracticeEngine = void 0;
const ts_fsrs_1 = require("ts-fsrs");
class PracticeEngine {
    constructor(repo, params) {
        this.repo = repo;
        this.fsrs = new ts_fsrs_1.FSRS(params || (0, ts_fsrs_1.generatorParameters)());
    }
    /**
     * Get all cards from a deck that are due for review.
     * If a card has no FSRS state, it is considered 'New' and due immediately (or managed by new card limits).
     */
    async getDueCards(deckId, mode = 'mixed', order = 'standard') {
        const deck = await this.repo.getDeck(deckId);
        if (!deck) {
            throw new Error(`Deck not found: ${deckId}`);
        }
        const dueCards = [];
        const now = new Date();
        for (const card of deck.cards) {
            const state = await this.repo.getCardState(card.id);
            if (!state) {
                // New card
                if (mode === 'mixed' || mode === 'new') {
                    dueCards.push(card);
                }
            }
            else {
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
    async gradeCard(cardId, rating) {
        let state = await this.repo.getCardState(cardId);
        if (!state) {
            // Initialize new card state if not present
            state = (0, ts_fsrs_1.createEmptyCard)();
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
        const result = schedulingCards[rating];
        if (!result) {
            throw new Error(`Invalid rating: ${rating}`);
        }
        // Update state
        await this.repo.saveCardState(cardId, result.card);
        // Log review
        await this.repo.saveReviewLog(cardId, result.log);
    }
}
exports.PracticeEngine = PracticeEngine;
//# sourceMappingURL=engine.js.map