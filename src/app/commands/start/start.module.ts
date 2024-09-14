import { CreateModule } from '../../../framework/decorators/create-module';
import { SignUpScene } from './sign-up.scene';
import { StartCommand } from './start.command';

@CreateModule({
    modules: [],
    triggers: [ StartCommand ],
    scenes: [ SignUpScene ],
    providers: []
})
export class StartModule {

}