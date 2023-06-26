import {fightRepository} from "../repositories/fightRepository.js";

class FightersService {
    save(body) {
        const {winnerId, loserId, log} = body;

        const data = {
            fighter1: winnerId,
            fighter2: loserId,
            log,
        };
        const fight = fightRepository.create(data);
        if (!fight) {
            throw new Error(`The fight ${body} has not been saved.`);
        }
        return fight;
    }
}

const fightersService = new FightersService();

export {fightersService};
