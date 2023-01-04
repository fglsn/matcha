import {
	Typography
} from '@mui/material';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Chat, ChatMsg, UserEntryForChat } from '../../types';
import Box from '@mui/material/Box';
import { getChatMessages } from '../../services/chats';
import { useServiceCall } from '../../hooks/useServiceCall';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import calendar from 'dayjs/plugin/calendar';
import React from 'react';

dayjs.extend(relativeTime);
dayjs.extend(calendar);

const receivedMsg = {
	display: 'flex',
	flexWrap: 'wrap',
	flexDirection: 'row',
	justifyContent: 'flex-start',
	alignItems: 'center',
	textAlign: 'left',
	// wordWrap: 'break-word',
	pr: '50%'
	// maxWidth: '50%'
};

const sentMsg = {
	display: 'flex',
	flexWrap: 'wrap',
	flexDirection: 'row-reverse',
	justifyContent: 'flex-start',
	alignItems: 'center',
	textAlign: 'left',
	// wordWrap: 'break-word',
	pl: '50%'
	// maxWidth: '50%'
};

const MsgBoxStyles = {
	display: 'flex',
	wrap: 'nowrap',
	flexDirection: 'row',
	alignItems: 'flex-end',
	bgcolor: 'primary.main',
	border: 1,
	borderColor: 'secondary.main',
	p: 1,
	borderRadius: '7px'
	// wordWrap: 'break-word'
};

const Messages = ({
	messages,
	matchId,
	users,
	userId,
	setMessages
}: {
	messages: ChatMsg[];
	matchId: string;
	users: UserEntryForChat[];
	userId: string;
	setMessages: React.Dispatch<React.SetStateAction<ChatMsg[]>>;
}) => {
	// const [sender] = users.filter((user) => user.id === userId);
	// const [receiver] = users.filter((user) => user.id !== userId);
	const [pageNum, setPageNum] = useState(1);
	const [hasMore, setHasMore] = useState(true);
    const date = useRef<dayjs.Dayjs>(dayjs());

	const {
		data: chatMsgs,
		error: chatMsgsError,
		loading: isLoading
	}: {
		data: Chat | undefined;
		error: Error | undefined;
		loading: boolean;
	} = useServiceCall(
		async () => await getChatMessages(matchId, pageNum, 30),
		[matchId, pageNum]
	);

	useEffect(() => {
		if (chatMsgs) {
			if (chatMsgs.messages.length === 0) {
				setHasMore(false);
			} else {
				setMessages((prev) => {
					const arr = [...prev, ...chatMsgs.messages];
					return arr.filter(
						(value, index, self) =>
							index ===
							self.findIndex((m) => m.message_id === value.message_id)
					);
				});
			}
		}
	}, [chatMsgs, setMessages]);

	const observer = useRef<IntersectionObserver | null>(null);

	const lastMsgElementRef = useCallback(
		(node) => {
			if (isLoading) return;
			if (observer.current) observer.current.disconnect();
			observer.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting && hasMore) {
					setPageNum((prev) => prev + 1);
				}
			});
			if (node) observer.current.observe(node);
		},
		[isLoading, hasMore]
	);

    // let dateRef = dayjs().format('D MMM YY');
    // const messagesCopy = messages.map(m => m);
    // for (let i = 0; i < messagesCopy.length; i++) {
    //     if (dayjs(messagesCopy[i].message_time).format('D MMM YY') !== dateRef) {
    //         const TimeBar = {
    //             message_id: `-${i}`,
    //             receiver_id: '0',
    //             sender_id: '0',
    //             message_text: dateRef,
    //             message_time: messagesCopy[i-1].message_time
    //         };
    //         messagesCopy.splice(i - 1, 0, TimeBar);
    //         dateRef = dayjs(messagesCopy[i].message_time).format('D MMM YY');
    //     }
    //     if (i === messagesCopy.length - 1){
    //         const TimeBar = {
    //             message_id: `-${i}`,
    //             receiver_id: '0',
    //             sender_id: '0',
    //             message_text: dateRef,
    //             message_time: messagesCopy[i-1].message_time
    //         };
    //         messagesCopy.splice(i, 0, TimeBar);
    //     }
    // }

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column-reverse',
				width: '100%',
				overflowY: 'auto',
				perspective: '1px',
				p: 1
			}}
		>
			{messages.map((msg, i) =>
                        <Box
                            sx={msg.receiver_id === userId ? receivedMsg : sentMsg}
                            {...(messages.length === i + 1
                                ? { ref: lastMsgElementRef }
                                : {})}
                            key={msg.message_id}
                        >
                            <Box
                                sx={{
                                    ...MsgBoxStyles
                                }}
                            >
                                <Typography
                                    color="secondary"
                                    variant="body2"
                                    sx={{ mx: 1, wordBreak: 'break-word' }}
                                >{`${msg.message_text} `}</Typography>
                                <Typography color="grey" sx={{ fontSize: '0.6rem' }}>
                                    {dayjs(msg.message_time).format('HH:mm')}
                                </Typography>
                            </Box>
                        </Box>
            )}
			<div>{chatMsgsError && 'Error loading more messages...'}</div>
			<div>{isLoading && 'Loading...'}</div>
		</Box>
	);
};

export default Messages;