import path from "path";
import fs from "fs";
import { Chat, Message, ShipmentStatus, StatusMessage } from "../interfaces";


export class ChatService {

    private readonly pathMessages;

    constructor() {
        this.pathMessages = path.resolve( __dirname, '../../../messages' );

        if(!fs.existsSync(this.pathMessages)){
            fs.mkdirSync(this.pathMessages, { recursive: true });
        }
    }

    getChatByPhoneNumber( phoneNumber: string ): Chat{
        // Obtener los archivos de la carpeta
        const files = fs.readdirSync(this.pathMessages);
      
        // Filtrar los archivos JSON
        const jsonFiles = files.filter(file => path.extname(file).toLowerCase() === '.json');
      
        // Leer y parsear los archivos JSON
        const chats: Chat[] = jsonFiles.map(file => {
          const filePath = path.join(this.pathMessages, file);
          const fileContent = fs.readFileSync(filePath, 'utf-8');
          return JSON.parse(fileContent);
        });
        
        return chats.filter( chat => chat.phoneNumber == phoneNumber).at(0)!;
    }

    responderMessage( idMessage: string ){
        throw 'Metohd not implemented';
    }

    initChat( chat: Chat ){
        const path = `${this.pathMessages}/${chat.phoneNumber}.json`;

        fs.writeFile(path, JSON.stringify(chat, null, 4), (err) => {
            if (err) {
                console.error('Error al crear el archivo:', err);
            } else {
                console.log('Archivo creado exitosamente.');
            }
        });
    }

    guardarMessageInJson( phoneNumber: string, chat: Chat ){
        const filePath = path.join(this.pathMessages, `${phoneNumber}.json`);
        // Sobrescribir el archivo JSON con el nuevo contenido del chat
        fs.writeFileSync(filePath, JSON.stringify(chat, null, 4), 'utf-8');
    }

    addMessage( phoneNumber: string, message: Message ){
        const chat = this.getChatByPhoneNumber( phoneNumber );
        
        const messageExist = chat.messages.find((m)=> m.id == message.id );
        if(messageExist) return undefined;

        // Si no existe el chat, deberías manejar este caso (crear un nuevo chat, por ejemplo)
        if (!chat) {
            throw new Error(`No se encontró el chat para el número: ${phoneNumber}`);
        }

        chat.messages.push(message);
        this.guardarMessageInJson( phoneNumber, chat );

        return chat;
    }

    updateStatusMessage( shipmentStatus: ShipmentStatus ){
        const phoneNumber = shipmentStatus.recipient_id;

        const chat = this.getChatByPhoneNumber( phoneNumber );

        chat.messages.map((message)=>{
            if(message.id == shipmentStatus.id){
                message.status = shipmentStatus.status as StatusMessage;
            }

            return message;
        });

        this.guardarMessageInJson( phoneNumber, chat );

        return chat;
    }

}