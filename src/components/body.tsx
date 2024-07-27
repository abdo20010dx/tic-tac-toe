import React, { useState } from 'react';
import { Box, Button, Grid, MenuItem, Select, Typography, Avatar } from '@mui/material';

const TicTacToe = () => {
    const [size, setSize] = useState(3);
    const [gameState, setGameState] = useState(Array(3 * 3).fill(null));
    const [isXTurn, setIsXTurn] = useState(true);
    const [winner, setWinner] = useState(null);
    const [playerOneSymbol, setPlayerOneSymbol] = useState('X');
    const [playerTwoSymbol, setPlayerTwoSymbol] = useState('O');

    const handleSizeChange = (event: any) => {
        const newSize = event.target.value;
        setSize(newSize);
        resetGame(newSize);
    };

    const resetGame = (newSize = size) => {
        setGameState(Array(newSize * newSize).fill(null));
        setIsXTurn(true);
        setWinner(null);
    };

    const toggleSymbols = () => {
        setPlayerOneSymbol((prev) => (prev === 'X' ? 'O' : 'X'));
        setPlayerTwoSymbol((prev) => (prev === 'X' ? 'O' : 'X'));
    };

    const handleButtonClick = (index: any) => {
        if (gameState[index] === null && !winner) {
            const newState = [...gameState];
            newState[index] = isXTurn ? playerOneSymbol : playerTwoSymbol;
            setGameState(newState);
            setIsXTurn(!isXTurn);

            const gameArray = [];
            for (let i = 0; i < size; i++) {
                gameArray.push(newState.slice(i * size, i * size + size));
            }

            const result = checkWinner(gameArray);
            if (result.winner) {
                setWinner(result.winner);
            } else if (result.isDraw) {
                setWinner('draw' as any);
            }
        }
    };

    const checkWinner = (tictactoeArray: any) => {
        let winner = null;
        let isRowWon = true;
        let isColumnWon = true;
        let intersect1st = true;
        let intersect2nd = true;
        let isDraw = true;

        for (let index = 0; index < tictactoeArray.length; index++) {
            isRowWon = true;
            isColumnWon = true;
            if (index !== 0) {
                intersect1st = tictactoeArray[index][index] === tictactoeArray[index - 1][index - 1] && intersect1st;
                intersect2nd = tictactoeArray[index][tictactoeArray.length - 1 - index] === tictactoeArray[index - 1][tictactoeArray.length - 1 - (index - 1)] && intersect2nd;
            }

            for (let index2 = 0; index2 < tictactoeArray.length; index2++) {
                if (tictactoeArray[index][index2] === null) {
                    isDraw = false;
                }

                if (index2 !== 0) {
                    isRowWon = tictactoeArray[index][index2] === tictactoeArray[index][index2 - 1] && isRowWon;
                    if (isRowWon && tictactoeArray.length - 1 === index2) {
                        winner = tictactoeArray[index][index2];
                        break;
                    }

                    isColumnWon = tictactoeArray[index2][index] === tictactoeArray[index2 - 1][index] && isColumnWon;
                    if (isColumnWon && tictactoeArray.length - 1 === index2) {
                        winner = tictactoeArray[index2][index];
                        break;
                    }
                }
            }

            const intersectPoint = Math.ceil((tictactoeArray.length - 1) / 2);
            if ((intersect1st || intersect2nd) && tictactoeArray.length - 1 === index) {
                winner = tictactoeArray[intersectPoint][intersectPoint];
            }
            if (winner) break;
        }

        return { winner, isDraw: !winner && isDraw };
    };

    const gridSize = `${size * 100}px`;

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh', justifyContent: 'center', padding: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: '600px', marginBottom: '20px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ marginRight: 1 }}>P1</Avatar>
                    <Box>
                        <Typography variant="body1">Player One</Typography>
                        <Typography variant="h6">{playerOneSymbol}</Typography>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ marginRight: 1 }}>P2</Avatar>
                    <Box>
                        <Typography variant="body1">Player Two</Typography>
                        <Typography variant="h6">{playerTwoSymbol}</Typography>
                    </Box>
                </Box>
            </Box>
            <Box sx={{ marginBottom: '20px' }}>
                <Typography variant="h6" sx={{ marginBottom: '10px' }}>Select Grid Size:</Typography>
                <Select value={size} onChange={handleSizeChange}>
                    <MenuItem value={3}>3 x 3</MenuItem>
                    <MenuItem value={5}>5 x 5</MenuItem>
                    <MenuItem value={7}>7 x 7</MenuItem>
                </Select>
            </Box>
            <Grid container spacing={0} sx={{ width: gridSize, maxWidth: '100%', height: gridSize, maxHeight: '100%' }}>
                {gameState.map((value, index) => (
                    <Grid item xs={12 / size} key={index} sx={{ border: '1px solid black' }}>
                        <Button
                            variant="outlined"
                            onClick={() => handleButtonClick(index)}
                            sx={{
                                width: '100%',
                                height: '100%',
                                aspectRatio: '1',
                                fontSize: { xs: '16px', sm: '24px' },
                                padding: '0',
                                minWidth: '0',
                                pointerEvents: value !== null || winner ? 'none' : 'auto',
                            }}
                        >
                            {value}
                        </Button>
                    </Grid>
                ))}
            </Grid>
            {winner && (
                <Box sx={{ marginTop: '20px', textAlign: 'center' }}>
                    <Typography variant="h6">
                        {winner === 'draw'
                            ? 'Game is a draw!'
                            : `Player ${winner === playerOneSymbol ? 'One' : 'Two'} wins!`}
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ marginTop: '10px' }}
                        onClick={() => {
                            toggleSymbols();
                            resetGame();
                        }}
                    >
                        Reset Game
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default TicTacToe;
