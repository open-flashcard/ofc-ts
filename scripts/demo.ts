import { JsonFileRepository } from '../src/repositories/json-repository';
import { PracticeEngine } from '../src/engine';
import { Rating } from 'ts-fsrs';
import * as path from 'path';

async function main() {
    const repo = new JsonFileRepository();
    const deckPath = path.resolve(__dirname, '../../flashcards/istqb/istqb-test-levels.json');

    console.log(`Loading deck from: ${deckPath}`);
    await repo.loadDeckFromFile(deckPath);

    const deck = await repo.getDeck(deckPath);
    if (!deck) {
        console.error('Failed to load deck');
        return;
    }
    console.log(`Loaded deck: ${deck.name} with ${deck.cards.length} cards`);

    const engine = new PracticeEngine(repo);

    // Get due cards
    const due = await engine.getDueCards(deck.id);
    console.log(`Cards due: ${due.length}`);

    if (due.length > 0) {
        const card = due[0];
        console.log(`Practicing card: ${card.id}`);

        // Simulate grading
        console.log('Grading as Good...');
        await engine.gradeCard(card.id, Rating.Good);

        const state = await repo.getCardState(card.id);
        console.log('New state:', state);

        const dueAfter = await engine.getDueCards(deck.id);
        console.log(`Cards due now: ${dueAfter.length}`);
    }
}

main().catch(console.error);
