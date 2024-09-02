import { Service } from '../../services/database/abstract-services/service.abstract-class';
import { EntityNames } from '../../services/database/entities/entity-names';


export const SessionSubscribers = new Map<Service<any>, EntityNames>();