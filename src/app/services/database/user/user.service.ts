import { dbConnection } from '../db.connection';
import { InterfaceLanguages, Languages } from '../../../../core/language-interface/enums';
import { User } from './user.entity';

export class UserService {
    #userRepository = dbConnection.getRepository(User);

    async getAll() {
        return await this.#userRepository.find();
    }

    async getAccount(idTelegram: string, relations?: string[]) {
        const result = await this.#userRepository.find({where: {idTelegram}, relations});

        if(!result.length) {
            return null;
        }

        return result[0];
    }

    async createAccount(idTelegram: string, name: string, interfaceLanguage: InterfaceLanguages, nativeLanguage: Languages) {
        await this.#userRepository.insert({idTelegram, name, interfaceLanguage, nativeLanguage});
    }

    async deleteAccount(idTelegram: string) {
        await this.#userRepository.delete({idTelegram});
    }

    async changeLanguageInterface(idTelegram: string, interfaceLanguage: InterfaceLanguages) {
        await this.#userRepository.update({idTelegram}, {interfaceLanguage});
    }
}

export const userService = new UserService();