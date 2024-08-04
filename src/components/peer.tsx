import React, { useEffect, useRef, useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';

import { useSelector, useDispatch } from 'react-redux';
import io from 'socket.io-client';
import { RtcRequest } from '../interfaces/RtcRequest';
import { RootState } from '../hooks/store';
import { setFriend, setFriends, setReceiver, setSearching } from '../hooks/slices/user';
import userSingleton from '../utils/userSingleton';
import { resetGame, setPlayerNumber } from '../hooks/slices/ticTacToe';
import { uniqueArrayByKey } from '../utils/helpers/uniqueArray';

const socket = io('https://tic-tac-toe-back-neon.vercel.app'); // Change the URL if necessary

const WebRTCWithSocketIO = () => {
    const dispatch = useDispatch();
    const reduxStore = useSelector((state: RootState) => state.user);
    const reduxStoreRef = useRef(reduxStore);

    const [value, setValue] = useState('');
    const [isDisabled, setIsDisabled] = useState(false);
    const [isSent, setIsSent] = useState(false);


    useEffect(() => {
        reduxStoreRef.current = reduxStore;
    }, [reduxStore]);


    const handleSendInvitation = () => {
        dispatch(setReceiver(value));
        setIsSent(true);
        setIsDisabled(true);
    };
    const resetPeerConnection = () => {
        window.location.reload();

        // userSingleton.peerConnection!.current = new RTCPeerConnection();
        // userSingleton.dataChannelRef!.current = null;
        // dispatch(setFriend({ name: "", uuid: "" }))
        // dispatch(setReceiver(''))
        // dispatch(setSearching(false))
    }
    const initializePeerConnection = () => {
        userSingleton.peerConnection!.current = new RTCPeerConnection();


        userSingleton.peerConnection!.current.ondatachannel = (event) => {
            userSingleton.dataChannelRef!.current = event.channel;
            console.log('Data channel received:', event.channel.label);

            userSingleton.dataChannelRef!.current.onopen = () => {
                dispatch(resetGame())
                socket.close();
                console.log('Data channel is open__________');
                userSingleton.dataChannelRef!.current?.send(JSON.stringify({ friend: { name: reduxStoreRef.current?.userName, uuid: reduxStoreRef.current?.sender } }));
            };

            userSingleton.dataChannelRef!.current.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data?.friend && !reduxStoreRef.current?.friend?.name) {
                    dispatch(setFriend(data?.friend));
                    dispatch(setFriends(uniqueArrayByKey("uuid", [...reduxStore.friends, data.friend])))
                    userSingleton.dataChannelRef!.current?.send(JSON.stringify({ friend: { name: reduxStoreRef.current?.userName, uuid: reduxStoreRef.current?.sender } }));
                }
                if (data?.setter) {
                    dispatch(data.setter)
                }
                console.log('Message peer2 received:', data);

            };

            userSingleton.dataChannelRef!.current.onclose = () => {
                console.log('Data channel is closed');
                resetPeerConnection()
                socket.open();

            };
        };
        userSingleton.peerConnection!.current.onicecandidate = (event) => {
            if (event.candidate) {
                console.log('ICE candidate:', event.candidate);
                socket.emit('ice-candidate', { candidate: event.candidate, sender: reduxStoreRef.current.sender, receiver: reduxStoreRef.current.receiver } as RtcRequest);
            }
        };

    };

    useEffect(() => {
        if (!reduxStore.sender) return
        // Initialize RTCPeerConnection
        // peerConnection!.current = new RTCPeerConnection();

        initializePeerConnection();        // Handle ICE candidate events
        // peerConnection!.current.onicecandidate = (event) => {
        //     if (event.candidate) {
        //         console.log('ICE candidate:', event.candidate);
        //         socket.emit('ice-candidate', { candidate: event.candidate, sender: userSingleton.sender, receiver: userSingleton.receiver } as RtcRequest);
        //     }
        // };

        // // Handle data channel events
        // peerConnection!.current.ondatachannel = (event) => {
        //     dataChannelRef!.current = event.channel;
        //     console.log('Data channel received:', event.channel.label);

        //     dataChannelRef!.current.onopen = () => {
        //         console.log('Data channel is open');
        //         dataChannelRef!.current?.send('Hello World');
        //     };

        //     dataChannelRef!.current.onmessage = (event) => {
        //         console.log('Message received:', event.data);
        //         if (event.data === 'Hello World') {
        //             dataChannelRef!.current?.send('Fine World');
        //         }
        //     };

        //     dataChannelRef!.current.onclose = () => {
        //         console.log('Data channel is closed');
        //     };
        // };

        // Socket.io event handlers

        socket.on(reduxStoreRef.current.sender + '-offer', async (rtcRequest: RtcRequest) => {
            dispatch(setPlayerNumber(2))
            if (rtcRequest?.receiver) dispatch(setReceiver(rtcRequest.sender))
            console.log('Offer received:', rtcRequest);
            await userSingleton.peerConnection!.current!.setRemoteDescription(new RTCSessionDescription(rtcRequest.offer));
            const answer = await userSingleton.peerConnection!.current!.createAnswer();
            await userSingleton.peerConnection!.current!.setLocalDescription(answer);
            console.log('Answer sent:', answer);
            socket.emit('answer', { offer: rtcRequest.offer, answer, sender: reduxStoreRef.current.sender, receiver: reduxStoreRef.current.receiver } as RtcRequest);
        });

        socket.on(reduxStoreRef.current.sender + '-answer', async (rtcRequest: RtcRequest) => {
            console.log('Answer received:', rtcRequest);
            await userSingleton.peerConnection!.current!.setRemoteDescription(new RTCSessionDescription(rtcRequest.answer));
        });

        socket.on(reduxStoreRef.current.sender + '-candidate', async (rtcRequest: RtcRequest) => {
            console.log('ICE candidate received:', rtcRequest);
            await userSingleton.peerConnection!.current!.addIceCandidate(new RTCIceCandidate(rtcRequest.candidate));
        });

        // Create an offer when the component mounts
        // const createOffer = async () => {
        //     dataChannelRef!.current = peerConnection!.current!.createDataChannel('dataChannel');
        //     dataChannelRef!.current.onopen = () => console.log('Data channel is open');
        //     dataChannelRef!.current.onmessage = (event) => console.log('Message received:', event.data);
        //     dataChannelRef!.current.onclose = () => console.log('Data channel is closed');

        //     const offer = await peerConnection!.current!.createOffer();
        //     await peerConnection!.current!.setLocalDescription(offer);
        //     console.log('Offer created:', offer);
        //     socket.emit('offer', { offer, sender: userSingleton.sender, receiver: userSingleton.receiver } as RtcRequest);
        // };

        // if (value) createOffer();

        return () => {
            userSingleton.peerConnection!.current?.close();
            socket.off(reduxStoreRef.current.sender + '-offer');
            socket.off(reduxStoreRef.current.sender + '-answer');
            socket.off(reduxStoreRef.current.sender + '-candidate');
        };
    }, [reduxStore.sender]);
    useEffect(() => {
        const createOffer = async () => {
            userSingleton.dataChannelRef!.current = userSingleton.peerConnection!.current!.createDataChannel('dataChannel');
            userSingleton.dataChannelRef!.current.onopen = () => {
                dispatch(resetGame())
                socket.close();
                dispatch(setSearching(false))

                console.log('Data channel is open');
            }
            userSingleton.dataChannelRef!.current.onmessage = (event) => {
                const parsedData = JSON.parse(event.data);
                if (parsedData?.friend && !reduxStoreRef.current?.friend?.name) {
                    dispatch(setFriend(parsedData.friend))
                    dispatch(setFriends(uniqueArrayByKey("uuid", [...reduxStore.friends, parsedData.friend])))
                    const data = { name: reduxStoreRef.current.userName, uuid: reduxStoreRef.current.sender }
                    userSingleton.dataChannelRef?.current?.send(JSON.stringify({ friend: data }))
                }
                if (parsedData?.setter) {
                    dispatch(parsedData.setter)
                }

                console.log('Message received:', parsedData.setter);

            }
            userSingleton.dataChannelRef!.current.onclose = () => {
                console.log('Data channel is closed');
                resetPeerConnection()
                socket.open();
            }

            const offer = await userSingleton.peerConnection!.current!.createOffer();
            await userSingleton.peerConnection!.current!.setLocalDescription(offer);
            console.log('Offer created:', offer);
            socket.emit('offer', { offer, sender: reduxStoreRef.current.sender, receiver: reduxStoreRef.current.receiver } as RtcRequest);
        };
        let isChannelOpen = false
        if (userSingleton!.dataChannelRef!.current) {
            if (userSingleton!.dataChannelRef!.current!.readyState === "open") isChannelOpen = true;
        }

        if (reduxStore.searching && reduxStore.receiver && !isChannelOpen) createOffer();

    }, [reduxStore.searching])
    return (
        <></>
    );
};

export default WebRTCWithSocketIO;
