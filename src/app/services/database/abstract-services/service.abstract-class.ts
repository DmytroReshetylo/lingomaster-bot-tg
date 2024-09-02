import { FindOptionsWhere, ObjectLiteral, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { Constructor } from '../../../../core/types';
import { dbConnection } from '../db.connection';
import { services } from '../initialize-services';

export abstract class Service<T extends ObjectLiteral> {
    private repository!: Repository<T>;
    private entity: Constructor<T>;

    constructor(entity: Constructor<T>) {
        this.entity = entity;

        services.push(this);
    }

    connectRepository() {
        this.repository = dbConnection.getRepository(this.entity);
    }

    abstract getSessionData(conditions: FindOptionsWhere<T>): Promise<T | T[] | null>;

    async getAll() {
        return await this.repository.find();
    }

    async getEntities(conditions: FindOptionsWhere<T>) {
        return await this.repository.find({where: conditions});
    }

    async getEntity(conditions: FindOptionsWhere<T>){
        const result = await this.getEntities(conditions);

        if(!result.length) {
            return null;
        }

        return result[0];
    }

    async insert(entity: QueryDeepPartialEntity<T>) {
        const result = await this.repository.insert(entity);

        return !!result;
    }

    async update(conditions: FindOptionsWhere<T>, changeOptions: QueryDeepPartialEntity<T>){
        const result = await this.repository.update(conditions, changeOptions);

        return !!result;
    }

    async delete(conditions: FindOptionsWhere<T>) {
        const result = await this.repository.delete(conditions);

        return !!result;
    }
}