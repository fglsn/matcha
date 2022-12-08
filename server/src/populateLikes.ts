import dotenv from 'dotenv';
import { addLikeEntry, checkLikeEntry } from './repositories/likesRepository';
import { addMatchEntry } from './repositories/matchesRepository';
import { getIdList } from './repositories/userRepository';

const populateLikesAndMatches = async () => {
	const idList = await getIdList();
	for (let i = 0; i < idList.length; i++) {
		const j = (idList.length * Math.random()) | 0;
		if (idList[i].id !== idList[j].id) {
			await addLikeEntry(idList[i].id, idList[j].id);
			if (await checkLikeEntry(idList[j].id, idList[i].id)) {
				await addMatchEntry(idList[i].id, idList[j].id);
			}
		}
	}
};

dotenv.config();

void (async () => {
	try {
		for (let i = 0; i < 10; i++) {
			await populateLikesAndMatches();
		}
	} catch (e) {
		console.log(e);
	}
})();
