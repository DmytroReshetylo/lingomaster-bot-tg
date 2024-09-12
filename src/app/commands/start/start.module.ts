import { CreateModule } from '../../../framework/decorators/create-module';
import { StartCommand } from './start.command';

@CreateModule({
    modules: [],
    triggers: [ StartCommand ],
    scenes: [],
    providers: []
})
export class StartModule {

}