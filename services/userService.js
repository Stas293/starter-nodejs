import {userRepository} from "../repositories/userRepository.js";

class UserService {
    findAll() {
        const users = userRepository.getAll();
        if (users.length === 0) {
            return [];
        }
        return users;
    }

    search(search) {
        const item = userRepository.getOne(search);
        if (!item) {
            return null;
        }
        return item;
    }

    save(user) {
        user.firstName = user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1).toLowerCase();
        user.lastName = user.lastName.charAt(0).toUpperCase() + user.lastName.slice(1).toLowerCase();
        user.email = user.email.toLowerCase();
        const savedUser = userRepository.create(user);
        if (!savedUser) {
            throw new Error(`The user ${user} has not been created.`);
        }
        return savedUser;
    }

    update(id, data) {
        if (userRepository.getOne({id}) === null) {
            throw new Error(`User with id ${id} does not exist.`);
        }
        if (data.firstName) {
            data.firstName = data.firstName.charAt(0).toUpperCase() + data.firstName.slice(1).toLowerCase();
        }
        if (data.lastName) {
            data.lastName = data.lastName.charAt(0).toUpperCase() + data.lastName.slice(1).toLowerCase();
        }
        if (data.email) {
            data.email = data.email.toLowerCase();
        }
        const user = userRepository.update(id, data);
        if (!user) {
            return null;
        }
        return user;
    }

    delete(id) {
        let user = userService.search({id});
        if (id !== user?.id) {
            throw new Error(`User with id ${id} does not exist.`);
        }

        user = userRepository.delete(id);
        if (!user) {
            return null;
        }
        return user;
    }
}

const userService = new UserService();

export {userService};
