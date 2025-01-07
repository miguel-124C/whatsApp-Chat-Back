import { ReciveOrShipmentMessage } from "../enum/reciveorshipment-message";


export class MessageWhatsAppUtil {

    static VerifyTypeMessage = ( object: any): ReciveOrShipmentMessage | null => {

        if(object.entry[0].changes[0].value.messages ) {
            return ReciveOrShipmentMessage.RECIVE
        }else if(object.entry[0].changes[0].value.statuses ) {
            return ReciveOrShipmentMessage.SHIPMENT
        };

        return null;
    }

}