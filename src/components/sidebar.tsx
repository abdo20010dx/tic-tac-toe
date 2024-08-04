import React, { useEffect, useState } from 'react';
import { Drawer, TextField, Button, IconButton, Typography, Box, Divider } from '@mui/material';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import { openDB } from 'idb';
import { v4 as uuidv4 } from 'uuid';
import { RootState } from '../hooks/store';
import { useDispatch, useSelector } from 'react-redux';
import { setFriend, setFriends, setReceiver, setSearching, setSender, setUserName } from '../hooks/slices/user';
import copy from "copy-to-clipboard";

const Sidebar = () => {
    const dispatch = useDispatch();
    const reduxStore = useSelector((state: RootState) => state.user);
    const [isOpen, setIsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [username, setUsername] = useState('');
    const [uuid, setUUID] = useState<string>('');
    const [friendUUID, setFriendUUID] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const saveIdb = async (inputValue: any, keyValue: string) => {
        const db = await openDB('localDb', 1);
        await db.put('store', inputValue, keyValue);
    };

    const handleToggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const handleToggleEdit = () => {
        setIsEditing(!isEditing);
    };

    const handleSave = async () => {
        setIsEditing(false);
        await saveIdb(username, 'userName');
        dispatch(setUserName(username as string))

    };

    const handleCopyUUID = () => {
        copy(uuid);

        // navigator.clipboard.writeText(uuid);
    };

    const handleAddFriend = () => {
        dispatch(setReceiver(friendUUID))
        dispatch(setSearching(true))
        setFriendUUID('');
        dispatch(setSearching(true));
    };
    const handleInviteFriend = (uuid: string) => {
        dispatch(setReceiver(uuid))
        dispatch(setSearching(true))
        setFriendUUID('');
        dispatch(setSearching(true));
    };

    const handleAbortSearch = () => {
        dispatch(setSearching(false));
    };

    const filteredFriends = reduxStore.friends.filter((friend) =>
        friend.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    useEffect(() => {
        async function load() {
            if (reduxStore.friends.length)
                await saveIdb(reduxStore.friends, "friends")
        }
        load()
    }, [reduxStore.friends])

    useEffect(() => {
        // Open or create the IndexedDB
        const initDB = async () => {
            const db = await openDB('localDb', 1, {
                upgrade(db) {
                    db.createObjectStore('store');
                },
            });
            return db;
        };

        // Get the stored value on component mount
        const fetchValue = async (keyValue: string) => {
            const db = await initDB();
            const value = await db.get('store', keyValue);
            return value
        };
        async function load() {
            const db = await initDB();
            const transaction = db.transaction('store', 'readonly');
            const store = transaction.objectStore('store');

            // Fetch all data

            let senderFetched = await store.get('sender')
            let userNameFetched = await store.get('userName')
            let friendsFetched = await store.get('friends')
            // if (!friendsFetched) await saveIdb([], 'friends')
            if (!userNameFetched) await saveIdb('', 'userName')
            dispatch(setSender(senderFetched as string))
            dispatch(setUserName(userNameFetched as string))
            dispatch(setFriends(friendsFetched ?? []))
            if (!senderFetched) {
                await saveIdb(uuidv4(), 'sender')
                senderFetched = await fetchValue('sender')

                dispatch(setSender(senderFetched as string))
                setUUID(senderFetched)

            }
            setUUID(senderFetched as string)
            setUsername(userNameFetched ?? '')


        }
        load()
    }, []);

    return (
        <>
            {/* Button to Toggle Sidebar */}
            <Button onClick={handleToggleSidebar}>
                <MenuIcon />
                {isOpen ? 'Close' : 'Open'} Sidebar
            </Button>

            {/* Sidebar */}
            <Drawer open={isOpen} onClose={handleToggleSidebar}>
                <Box p={2} width="300px">
                    {/* Username Section */}
                    <TextField
                        fullWidth
                        label="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        disabled={!isEditing}
                    />
                    <Button onClick={isEditing ? handleSave : handleToggleEdit}>
                        {isEditing ? 'Save' : 'Edit'}
                    </Button>

                    <Divider sx={{ my: 2 }} />

                    {/* UUID Copy Section */}
                    <Box display="flex" alignItems="center">
                        <IconButton onClick={handleCopyUUID}>
                            <FileCopyIcon />
                        </IconButton>
                        <Typography>{uuid}</Typography>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* Add Friend Section */}
                    <Box display="flex" alignItems="center" mb={2}>
                        <TextField
                            fullWidth
                            label="Friend's UUID"
                            value={friendUUID}
                            onChange={(e) => setFriendUUID(e.target.value)}
                        />
                        <Button onClick={handleAddFriend}>
                            <AddIcon />
                            Add Friend
                        </Button>
                    </Box>

                    {/* Search Popup */}
                    {reduxStore.searching && (
                        <Box
                            sx={{
                                position: 'fixed',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                p: 2,
                                bgcolor: 'white',
                                boxShadow: 3,
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            <Typography>Searching for user...</Typography>
                            <IconButton onClick={handleAbortSearch}>
                                <CloseIcon />
                            </IconButton>
                        </Box>
                    )}

                    <Divider sx={{ my: 2 }} />

                    {/* Search Friends */}
                    <TextField
                        fullWidth
                        label="Search Friends"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        margin="dense"
                    />

                    {/* Friends List */}
                    <Box height="150px" overflow="auto">
                        {filteredFriends.map((friend) => (
                            <Box display="flex" alignItems="center" key={friend.uuid} mb={1}>
                                <Typography>{friend.name}</Typography>
                                <Button onClick={() => handleInviteFriend(friend.uuid)}>Invite</Button>
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Drawer>
        </>
    );
};

export default Sidebar;
