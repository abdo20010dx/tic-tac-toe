import React, { useEffect, useState } from 'react';
import { Box, Button, Grid, MenuItem, Select, Typography, Avatar } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../hooks/store';
import { setGameState, setIsPlayerOneFirst, setIsXTurn, setMessage, setPlayerOneSize, setPlayerOneSymbol, setPlayerTwoSize, setPlayerTwoSymbol, setSize, setWinner, setWinningLine } from '../hooks/slices/ticTacToe';
import userSingleton from '../utils/userSingleton';

const TicTacToe = () => {
    const dispatch = useDispatch()
    const reduxUserStore = useSelector((state: RootState) => state.user);
    const reduxGameStore = useSelector((state: RootState) => state.ticTacToe);

    //share and run disptaching between players through webRtc 
    const shareDispatch = (setter: any) => {
        userSingleton!.dataChannelRef!.current?.send(JSON.stringify({ setter }))
        dispatch(setter)
    }


    const handleSizeChange = (player: string, event: any) => {
        const newSize = event.target.value;
        const playerNuame = reduxGameStore.playerNumber === 1 ? reduxUserStore.userName : reduxUserStore.friend.name
        if (player === 'one') {
            shareDispatch(setPlayerOneSize(newSize));
            shareDispatch(setMessage(`${playerNuame} asking to change game size to ${newSize}`));
        } else {
            shareDispatch(setPlayerTwoSize(newSize));
            shareDispatch(setMessage(`${playerNuame} asking to change game size to ${newSize}`));
        }
    };

    const resetGame = () => {
        if (reduxGameStore.playerOneSize === reduxGameStore.playerTwoSize) {
            shareDispatch(setSize(reduxGameStore.playerOneSize));
            shareDispatch(setGameState(Array(reduxGameStore.playerOneSize * reduxGameStore.playerOneSize).fill(null)));
            shareDispatch(setWinner(null));
            shareDispatch(setWinningLine(null));
            shareDispatch(setIsPlayerOneFirst(!reduxGameStore.isPlayerOneFirst));
            shareDispatch(setIsXTurn(!reduxGameStore.isPlayerOneFirst));
            toggleSymbols()
            shareDispatch(setMessage(''));
        } else {
            shareDispatch(setMessage('Both players must select the same size to start the game.'));
        }
    };

    const toggleSymbols = () => {
        shareDispatch(setPlayerOneSymbol((reduxGameStore.playerOneSymbol === 'X' ? 'O' : 'X')));
        shareDispatch(setPlayerTwoSymbol((reduxGameStore.playerTwoSymbol === 'X' ? 'O' : 'X')));
    };

    const handleButtonClick = (index: number) => {
        if (reduxGameStore.playerOneSize !== reduxGameStore.playerTwoSize) {
            shareDispatch(setMessage('Both players must select the same size to start the game.'));
            return;
        }

        if (reduxGameStore.gameState[index] === null && !reduxGameStore.winner) {
            const newState = [...reduxGameStore.gameState];
            newState[index] = reduxGameStore.isXTurn ? reduxGameStore.playerOneSymbol : reduxGameStore.playerTwoSymbol;
            shareDispatch(setGameState(newState));
            shareDispatch(setIsXTurn(!reduxGameStore.isXTurn));

            const gameArray = [];
            for (let i = 0; i < reduxGameStore.size; i++) {
                gameArray.push(newState.slice(i * reduxGameStore.size, i * reduxGameStore.size + reduxGameStore.size));
            }

            const result: any = checkWinner(gameArray);
            if (result.winner) {
                shareDispatch(setWinner(result.winner));
                shareDispatch(setWinningLine(result.line));
            } else if (result.isDraw) {
                shareDispatch(setWinner('draw' as any));
            }
        }
    };
    const checkWinner = (tictactoeArray: any) => {
        let winner = null;
        let winningLine = null;
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
                        winningLine = { type: 'row', index };
                        break;
                    }

                    isColumnWon = tictactoeArray[index2][index] === tictactoeArray[index2 - 1][index] && isColumnWon;
                    if (isColumnWon && tictactoeArray.length - 1 === index2) {
                        winner = tictactoeArray[index2][index];
                        winningLine = { type: 'column', index };
                        break;
                    }
                }
            }

            const intersectPoint = Math.ceil((tictactoeArray.length - 1) / 2);
            if ((intersect1st || intersect2nd) && tictactoeArray.length - 1 === index) {
                winner = tictactoeArray[intersectPoint][intersectPoint];
                winningLine = { type: intersect1st ? 'diagonal1' : 'diagonal2' };
            }
            if (winner) break;
        }

        return { winner, line: winningLine, isDraw: !winner && isDraw };
    };

    const gridSize = `${reduxGameStore.size * (reduxGameStore.size === 3 ? 100 : reduxGameStore.size === 5 ? 70 : 50)}px`;

    const renderWinningLine = (type: any, index: any) => {
        if (!type) return null;

        const baseStyle = {
            position: 'absolute',
            backgroundColor: 'red',
            transformOrigin: 'center',
        };

        switch (type) {
            case 'row':
                return (
                    <Box
                        sx={{
                            ...baseStyle,
                            width: '100%',
                            height: '2px',
                            top: `${index * (100 / reduxGameStore.size) + 50 / reduxGameStore.size}%`,
                            left: '0',
                        }}
                    />
                );
            case 'column':
                return (
                    <Box
                        sx={{
                            ...baseStyle,
                            width: '2px',
                            height: '100%',
                            top: '0',
                            left: `${index * (100 / reduxGameStore.size) + 50 / reduxGameStore.size}%`,
                        }}
                    />
                );
            case 'diagonal1':
                return (
                    <Box
                        sx={{
                            ...baseStyle,
                            width: '100%',
                            height: '2px',
                            top: '50%',
                            left: '0',
                            transform: 'rotate(45deg)',
                        }}
                    />
                );
            case 'diagonal2':
                return (
                    <Box
                        sx={{
                            ...baseStyle,
                            width: '100%',
                            height: '2px',
                            top: '50%',
                            left: '0',
                            transform: 'rotate(-45deg)',
                        }}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh', justifyContent: 'center', padding: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: '600px', marginBottom: '20px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ marginRight: 1 }}>P1</Avatar>
                    <Box>
                        <Typography variant="body1">{reduxUserStore.userName}</Typography>
                        <Typography variant="h6">{reduxGameStore.playerNumber === 1 ? reduxGameStore.playerOneSymbol : reduxGameStore.playerTwoSymbol}</Typography>
                        <Select value={reduxGameStore.playerOneSize} onChange={(event) => handleSizeChange('one', event)} disabled={!!reduxGameStore.winner || reduxGameStore.gameState.some(cell => cell !== null)}>
                            <MenuItem value={3}>3 x 3</MenuItem>
                            <MenuItem value={5}>5 x 5</MenuItem>
                            <MenuItem value={7}>7 x 7</MenuItem>
                        </Select>
                    </Box>
                </Box>
                <Box sx={{ displayy: 'flex', alignItems: 'center' }}>
                    <Button
                        sx={{ marginLeft: 2, height: "50%", width: "50%", }}
                        variant="contained"
                        color="error"
                        onClick={() => window.location.reload()}
                    >
                        Leave Game
                    </Button>

                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ marginRight: 1 }}>P2</Avatar>
                    <Box>
                        <Typography variant="body1">{reduxUserStore.friend.name}</Typography>
                        <Typography variant="h6">{reduxGameStore.playerNumber === 2 ? reduxGameStore.playerOneSymbol : reduxGameStore.playerTwoSymbol}</Typography>
                        <Select value={reduxGameStore.playerTwoSize} onChange={(event) => handleSizeChange('two', event)} disabled={!!reduxGameStore.winner || reduxGameStore.gameState.some(cell => cell !== null)}>
                            <MenuItem value={3}>3 x 3</MenuItem>
                            <MenuItem value={5}>5 x 5</MenuItem>
                            <MenuItem value={7}>7 x 7</MenuItem>
                        </Select>
                    </Box>
                </Box>
            </Box>
            {reduxGameStore.message && (
                <Typography variant="body1" sx={{ marginBottom: '20px', color: 'red' }}>
                    {reduxGameStore.message}
                </Typography>
            )}
            <Box sx={{ marginBottom: '20px' }}>
                <Button variant="contained" onClick={resetGame} disabled={!!reduxGameStore.winner || reduxGameStore.playerOneSize !== reduxGameStore.playerTwoSize || reduxGameStore.gameState.some(cell => cell !== null)}>
                    {reduxGameStore.winner ? 'Reset Game' : 'Play'}
                </Button>
            </Box>
            <Box sx={{ position: 'relative', width: gridSize, height: gridSize }}>
                {renderWinningLine(reduxGameStore.winningLine?.type, reduxGameStore.winningLine?.index)}
                <Grid container spacing={0} sx={{ width: '100%', height: '100%' }}>
                    {reduxGameStore.gameState.map((value, index) => (
                        <Grid item xs={12 / reduxGameStore.size} key={index} sx={{ border: '1px solid black' }}>
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
                                    pointerEvents: value !== null || reduxGameStore.winner || reduxGameStore.playerOneSize !== reduxGameStore.playerTwoSize || reduxGameStore.isXTurn !== (reduxGameStore.playerNumber === 1) ? 'none' : 'auto',
                                }}
                            >
                                {value}
                            </Button>
                        </Grid>
                    ))}
                </Grid>
            </Box>
            {reduxGameStore.winner && (
                <Box sx={{ marginTop: '20px', textAlign: 'center' }}>
                    <Typography variant="h6">
                        {reduxGameStore.winner === 'draw'
                            ? 'Game is a draw!'
                            : `Player ${(reduxGameStore.winner === (reduxGameStore.playerNumber === 1 ? reduxGameStore.playerOneSymbol : reduxGameStore.playerTwoSymbol)) ? reduxUserStore.userName : reduxUserStore.friend.name} wins!`}
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ marginTop: '10px' }}
                        onClick={resetGame}
                    >
                        Reset Game
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default TicTacToe;
