import {fightRepository} from "../repositories/fightRepository.js";
import {fighterRepository} from "../repositories/fighterRepository.js";

class FightersService {
    save(body) {
        const {winnerId, loserId, log} = body;

        const data = {
            fighter1: winnerId,
            fighter2: loserId,
            log,
        };
        if (!fighterRepository.getOne({id: winnerId})) {
            throw new Error(`Fighter with id ${winnerId} does not exist.`);
        }
        if (!fighterRepository.getOne({id: loserId})) {
            throw new Error(`Fighter with id ${loserId} does not exist.`);
        }

        const fight = fightRepository.create(data);
        if (!fight) {
            throw new Error(`The fight ${body} has not been saved.`);
        }
        return fight;
    }

    findAll() {
        const fights = fightRepository.getAll();
        if (fights.length === 0) {
            return [];
        }
        return fights;
    }

    search(param) {
        const fight = fightRepository.getOne(param);
        if (!fight) {
            return null;
        }
        return fight;
    }
}

const fightersService = new FightersService();

export {fightersService};
