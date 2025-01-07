import { ReciveMessageWhatsAppDto } from "../../domain/dtos/recive-message-whatsapp.dto";


export interface WhatsAppService {

    sendMessage: ( to: string, message: string ) => Promise<boolean>;
    reciveMessage: ( reciveMessageWhatsAppDto: ReciveMessageWhatsAppDto ) => Promise<boolean>;
    validateToken: (mode: string, token: string, verifyToken: string) => Promise<boolean>;
    

}