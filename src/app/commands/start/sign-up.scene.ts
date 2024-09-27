import { CreateScene } from '../../../framework/decorators/create-scene';
import { SelectInterfaceLanguageComposer } from '../../shared/composers/select-interface-language/select-interface-language.composer';
import { InputNameComposer } from './composers/input-name.composer';
import { SelectNativeLanguageComposer } from './composers/select-native-language.composer';
import { SignUpComposer } from './composers/sign-up.composer';

@CreateScene({
    name: 'sign-up-scene',
    providers: [],
    composers: [SelectInterfaceLanguageComposer, SelectNativeLanguageComposer, InputNameComposer, SignUpComposer]
})
export class SignUpScene {}