export type Player = 'X' | 'O';
export type CellValue = Player | null;
export type Board = CellValue[][];

export interface GameState {
    id: string;
    board: Board;
    current_turn: Player;
    status: 'ongoing' | 'won' | 'draw';
    winner: Player | null;
}