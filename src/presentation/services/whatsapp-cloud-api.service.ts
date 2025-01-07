import axios from "axios";
import { Envs } from '../../config/envs';
import { ReciveMessageWhatsAppDto } from "../../domain/dtos/recive-message-whatsapp.dto";
import { ContactService } from "./contact.service";
import { ChatService } from "./chat.service";
import { WssService } from "./wss.service";
import { Message, StatusMessage, TypeMessage } from "../interfaces";

export class WhatsAppCloudApi {

    constructor(
        private readonly contactService = new ContactService(),
        private readonly chatService = new ChatService(),
    ){ }

    private readonly basUrl = `${Envs.CLOUD_API_BASE_URL}/${Envs.CLOUD_API_VERSION}`;

    getListContacts = () => this.contactService.getContacts();

    getChatByPhoneNumber( phoneNumber: string ){
        return this.chatService.getChatByPhoneNumber(phoneNumber);
    }

    sendMessage = async (to: string, message: string) => {
        try {
            console.log(to, message);
            const responseMessage = await axios({
                method: "POST",
                url: `${this.basUrl}/${Envs.WHATSAPP_BUSINESS_PHONE_NUMBER_ID}/messages`,
                data: {
                  messaging_product: "whatsapp",
                  to,
                  type: 'text', // Hacer esto dinamico
                  text: { body: message },
                },
                headers: {
                   "Content-Type": "application/json",
                   "Authorization": "Bearer " + Envs.WHATSAPP_TOKEN
                },
            });

            const { contacts, messages } = responseMessage.data;

            const lastMessage: Message = {
                id: messages[0].id,
                of: 'me',
                status: StatusMessage.SENT,
                text: message,
                timestamp: Math.floor(Date.now() / 1000).toString(),
                typeText: TypeMessage.TEXT,
                // TODO: ver si el mensaje que se responde es respondiendo otro, o es reaaccionando
            }
            const chat = this.chatService.addMessage(contacts[0].wa_id, lastMessage);

            this.contactService.updateLastMessage(to, lastMessage);
            WssService.instance.sendMessage('on-chat-changed', chat);

            return true;
        } catch (error) {
            throw error;
        }
    };

    validateToken = async (mode: string, token: string, verifyToken: string) => {
        try {
            if (mode === "subscribe" && token === verifyToken) {
                console.log("WEBHOOK_VERIFIED");
                return true;
            } else {
                return false;
            }
        } catch (error) {
            throw error;
        }
    };

    reciveMessage = async (reciveMessageWhatsAppDto: ReciveMessageWhatsAppDto ) => {
        const { contacts, messages } = reciveMessageWhatsAppDto!;

        const phoneNumber = contacts.wa_id;
        const nameContact = contacts.profile.name;

        const lastMessage: Message = {
            id: messages.id,
            of: 'to',
            text: messages.text.body,
            timestamp: messages.timestamp,
            status: StatusMessage.DELIVERED,
            typeText: TypeMessage.TEXT,
        };

        if(!this.contactService.existsContact(contacts.wa_id)){
            const newContact = { nameContact, phoneNumber, lastMessage };

            this.contactService.createContact(newContact);
            this.chatService.initChat({ phoneNumber, nameContact, messages: [ lastMessage ] });
            
            return true;
        }

        this.contactService.updateLastMessage(phoneNumber, lastMessage);
        const contactsOrder = this.contactService.moveContactInFirstPosition( phoneNumber );

        const chat = this.chatService.addMessage(phoneNumber, lastMessage);
        WssService.instance.sendMessage('on-chat-changed', chat);
        WssService.instance.sendMessage('on-contact-new', contactsOrder);

        return true;
    }
}