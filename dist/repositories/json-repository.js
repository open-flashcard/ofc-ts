"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonFileRepository = void 0;
const fs = __importStar(require("fs/promises"));
class JsonFileRepository {
    // In-memory cache loaded from JSON files. 
    // In a real app, this might read/write to specific state files.
    constructor() {
        this.decks = new Map();
        this.cardStates = new Map();
        this.logs = new Map();
    }
    async loadDeckFromFile(path) {
        const data = await fs.readFile(path, 'utf-8');
        const deck = JSON.parse(data);
        this.decks.set(deck.id, deck); // Also index by ID
        this.decks.set(path, deck); // Index by path for convenience
    }
    async getDeck(idOrPath) {
        return this.decks.get(idOrPath);
    }
    async getCardState(cardId) {
        return this.cardStates.get(cardId);
    }
    async saveCardState(cardId, state) {
        this.cardStates.set(cardId, state);
    }
    async getReviewLog(cardId) {
        return this.logs.get(cardId) || [];
    }
    async saveReviewLog(cardId, log) {
        const existing = this.logs.get(cardId) || [];
        existing.push(log);
        this.logs.set(cardId, existing);
    }
}
exports.JsonFileRepository = JsonFileRepository;
//# sourceMappingURL=json-repository.js.map