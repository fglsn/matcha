import dotenv from 'dotenv';
import { getIdList } from './repositories/userRepository';
import { likeUser } from './services/users';

const populateLikesAndMatches = async () => {
	const idList = await getIdList();
	for (let i = 0; i < idList.length; i++) {
		const j = (idList.length * Math.random()) | 0;
		if (idList[i].id !== idList[j].id) {
			await likeUser(idList[i].id, idList[j].id);
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
