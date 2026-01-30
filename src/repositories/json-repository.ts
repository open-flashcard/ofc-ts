import * as fs from 'fs/promises';
import {FlashcardRepository, CardState} from '../repository';
import {Deck} from '../index';
import {createEmptyCard, ReviewLog} from 'ts-fsrs';

export class JsonFileRepository implements FlashcardRepository {
    private decks: Map<string, Deck> = new Map();
    private cardStates: Map<string, CardState> = new Map();
    private logs: Map<string, ReviewLog[]> = new Map();

    // In-memory cache loaded from JSON files. 
    // In a real app, this might read/write to specific state files.

    constructor() {
    }

    async loadDeckFromFile(path: string): Promise<void> {
        const data = await fs.readFile(path, 'utf-8');
        const deck = JSON.parse(data) as Deck;
        this.decks.set(deck.id, deck); // Also index by ID
        this.decks.set(path, deck);    // Index by path for convenience
    }

    async getDeck(idOrPath: string): Promise<Deck | undefined> {
        return this.decks.get(idOrPath);
    }

    async getCardState(cardId: string): Promise<CardState | undefined> {
        return this.cardStates.get(cardId);
    }

    async saveCardState(cardId: string, state: CardState): Promise<void> {
        this.cardStates.set(cardId, state);
    }

    async getReviewLog(cardId: string): Promise<ReviewLog[]> {
        return this.logs.get(cardId) || [];
    }

    async saveReviewLog(cardId: string, log: ReviewLog): Promise<void> {
        const existing = this.logs.get(cardId) || [];
        existing.push(log);
        this.logs.set(cardId, existing);
    }
}
