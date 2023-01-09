import React, { useState } from 'react';
import { useContext } from 'react';

type ChatReloadContextValue = {
	reason: string | undefined;
	initReload: (matchId: string | undefined) => void;
};

export const ChatReloadContext = React.createContext<ChatReloadContextValue>({
	reason: undefined,
	initReload: () => {}
});

export const ChatReloadProvider = ({ children }: any) => {
	const [reason, setReason] = useState<string | undefined>(undefined);

	return (
		<ChatReloadContext.Provider
			value={{
				reason,
				initReload: (matchId) => {
					setReason(matchId);
				}
			}}
		>
			{children}
		</ChatReloadContext.Provider>
	);
};

export const useStateChatReload = () => useContext(ChatReloadContext);
