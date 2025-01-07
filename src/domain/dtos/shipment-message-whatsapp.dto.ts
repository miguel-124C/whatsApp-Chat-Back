import { ShipmentStatus } from '../../presentation/interfaces/shipment-message-whatsapp.interface';


export class ShipmentMessageWhatsAppDto {

    private constructor(
        public readonly shipmentStatus: ShipmentStatus
    ){

    }

    static create(props: {[ key: string ]: any} ): [ string?,  ShipmentMessageWhatsAppDto? ]{
        const valueMessage = props.entry[0].changes[0].value.statuses[0] as ShipmentStatus;
        if(!valueMessage) return ['No existe el status']

        if( !valueMessage.status ) return ['Status vacio'];

        return [undefined, new ShipmentMessageWhatsAppDto( valueMessage )];
    }

}