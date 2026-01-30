import { FlashcardRepository, CardState } from '../repository';
import { Deck } from '../index';
import { ReviewLog } from 'ts-fsrs';
export declare class JsonFileRepository implements FlashcardRepository {
    private decks;
    private cardStates;
    private logs;
    constructor();
    loadDeckFromFile(path: string): Promise<void>;
    getDeck(idOrPath: string): Promise<Deck | undefined>;
    getCardState(cardId: string): Promise<CardState | undefined>;
    saveCardState(cardId: string, state: CardState): Promise<void>;
    getReviewLog(cardId: string): Promise<ReviewLog[]>;
    saveReviewLog(cardId: string, log: ReviewLog): Promise<void>;
}
//# sourceMappingURL=json-repository.d.ts.map