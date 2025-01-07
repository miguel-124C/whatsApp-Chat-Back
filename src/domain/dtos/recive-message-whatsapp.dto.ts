import { ContactMessageWhatsApp, MessageWhatsApp, ReciveValueMessageWhatsApp } from "../../presentation/interfaces";


export class ReciveMessageWhatsAppDto {

    private constructor(
        public readonly contacts: ContactMessageWhatsApp,
        public readonly messages: MessageWhatsApp
    ){ }

    static create( props: {[ key: string ]: any} ): [ string?,  ReciveMessageWhatsAppDto? ]{
        const valueMessage = props.entry[0].changes[0].value as ReciveValueMessageWhatsApp;

        if( !valueMessage.messages[0] ) return ['Missing Messages'];
        if( !valueMessage.contacts[0] ) return ['Missing Contacts'];

        const messages = valueMessage.messages[0];
        const contacts = valueMessage.contacts[0];

        return [undefined, new ReciveMessageWhatsAppDto( contacts, messages)]
    }

}