import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface TicTacToeState {
    playerNumber: number;
    size: number;
    playerOneSize: number;
    playerTwoSize: number;
    gameState: (string | null)[];
    isXTurn: boolean;
    winner: string | null;
    winningLine: any | null;
    playerOneSymbol: string;
    playerTwoSymbol: string;
    isPlayerOneFirst: boolean;
    message: string;
}

const initialState: TicTacToeState = {
    playerNumber: 1,
    size: 3,
    playerOneSize: 3,
    playerTwoSize: 3,
    gameState: Array(9).fill(null),
    isXTurn: true,
    winner: null,
    winningLine: null,
    playerOneSymbol: 'X',
    playerTwoSymbol: 'O',
    isPlayerOneFirst: true,
    message: '',
};

const ticTacToeSlice = createSlice({
    name: 'ticTacToe',
    initialState,
    reducers: {
        setPlayerNumber(state, action: PayloadAction<number>) {
            state.playerNumber = action.payload
        },
        setSize(state, action: PayloadAction<number>) {
            state.size = action.payload;
        },
        setPlayerOneSize(state, action: PayloadAction<number>) {
            state.playerOneSize = action.payload;
        },
        setPlayerTwoSize(state, action: PayloadAction<number>) {
            state.playerTwoSize = action.payload;
        },
        setGameState(state, action: PayloadAction<(string | null)[]>) {
            state.gameState = action.payload;
        },
        setIsXTurn(state, action: PayloadAction<boolean>) {
            state.isXTurn = action.payload;
        },
        setWinner(state, action: PayloadAction<string | null>) {
            state.winner = action.payload;
        },
        setWinningLine(state, action: PayloadAction<number[] | null>) {
            state.winningLine = action.payload;
        },
        setPlayerOneSymbol(state, action: PayloadAction<string>) {
            state.playerOneSymbol = action.payload;
        },
        setPlayerTwoSymbol(state, action: PayloadAction<string>) {
            state.playerTwoSymbol = action.payload;
        },
        setIsPlayerOneFirst(state, action: PayloadAction<boolean>) {
            state.isPlayerOneFirst = action.payload;
        },
        setMessage(state, action: PayloadAction<string>) {
            state.message = action.payload;
        },
        resetGame(state) {
            state.size = 3;
            state.playerOneSize = 3;
            state.playerTwoSize = 3;
            state.gameState = Array(9).fill(null);
            state.isXTurn = true;
            state.winner = null;
            state.winningLine = null;
            state.playerOneSymbol = 'X';
            state.playerTwoSymbol = 'O';
            state.isPlayerOneFirst = true;
            state.message = '';


        },
    },
});

export const {
    setPlayerNumber,
    setSize,
    setPlayerOneSize,
    setPlayerTwoSize,
    setGameState,
    setIsXTurn,
    setWinner,
    setWinningLine,
    setPlayerOneSymbol,
    setPlayerTwoSymbol,
    setIsPlayerOneFirst,
    setMessage,
    resetGame,
} = ticTacToeSlice.actions;

export const selectTicTacToe = (state: RootState) => state.ticTacToe;

export default ticTacToeSlice.reducer;
