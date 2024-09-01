import { Service } from './abstract-services/service.abstract-class';

export const services: Service<any>[] = [];

export function InitializeServices() {
    for(const service of services) {
        service.connectRepository();
    }
}