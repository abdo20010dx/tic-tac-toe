// Chat.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Button, TextField, Box, Typography } from '@mui/material';

interface ChatProps {
    dataChannel: RTCDataChannel | null;
}

const Chat: React.FC<ChatProps> = ({ dataChannel }) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<string[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (dataChannel) {
            dataChannel.onmessage = (event) => {
                setMessages((prevMessages) => [...prevMessages, event.data]);
            };
        }
    }, [dataChannel]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = () => {
        if (dataChannel && message) {
            dataChannel.send(message);
            setMessages((prevMessages) => [...prevMessages, message]);
            setMessage('');
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '400px', border: '1px solid #ccc', padding: 2 }}>
            <Box sx={{ flex: 1, overflowY: 'auto', marginBottom: 2 }}>
                <Typography variant="body1" gutterBottom>Chat:</Typography>
                {messages.map((msg, index) => (
                    <Typography key={index} variant="body2">{msg}</Typography>
                ))}
                <div ref={messagesEndRef} />
            </Box>
            <Box sx={{ display: 'flex' }}>
                <TextField
                    fullWidth
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message"
                />
                <Button onClick={handleSend} variant="contained" color="primary" sx={{ marginLeft: 2 }}>
                    Send
                </Button>
            </Box>
        </Box>
    );
};

export default Chat;
