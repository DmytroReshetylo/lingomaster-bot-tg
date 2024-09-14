import { Provider } from './provider.type';

export type TriggerConfig = {
    trigger: string;
    providers: Provider<any, any>[];
}