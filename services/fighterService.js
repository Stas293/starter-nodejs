import {fighterRepository} from "../repositories/fighterRepository.js";

class FighterService {
    findAll() {
        const fighters = fighterRepository.getAll();
        if (fighters.length === 0) {
            return [];
        }
        return fighters;
    }

    search(search) {
        const fighter = fighterRepository.getOne(search);
        if (!fighter) {
            return null;
        }
        return fighter;
    }

    save(body) {
        const {name, power, defense, health} = body;

        const data = {
            name: name.charAt(0).toUpperCase() + name.slice(1).toLowerCase(),
            power,
            defense,
            health: health || 100,
        };
        const fighter = fighterRepository.create(data);
        if (!fighter) {
            throw new Error(`The fighter ${body} has not been saved.`);
        }
        return fighter;
    }

    update(id, data) {
        if (data.name) {
            data.name = data.name.charAt(0).toUpperCase() + data.name.slice(1).toLowerCase();
        }
        const fighter = fighterRepository.update(id, data);
        if (!fighter) {
            return null;
        }
        return fighter;
    }

    delete(id) {
        let fighter = fighterService.search({id});
        if (id !== fighter?.id) {
            throw new Error(`Fighter with id ${id} does not exist`);
        }

        fighter = fighterRepository.delete(id);
        if (!fighter) {
            return null;
        }
        return fighter;
    }
}

const fighterService = new FighterService();

export {fighterService};
