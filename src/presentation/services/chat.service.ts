import path from "path";
import fs from "fs";
import { Chat, Message } from "../interfaces";


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

    addMessage( phoneNumber: string, message: Message ){
        const chat = this.getChatByPhoneNumber( phoneNumber );
        
         // Si no existe el chat, deberías manejar este caso (crear un nuevo chat, por ejemplo)
        if (!chat) {
            throw new Error(`No se encontró el chat para el número: ${phoneNumber}`);
        }

        // Agregar el mensaje al array de mensajes del chat
        chat.messages.push(message);

        // Obtener la ruta del archivo JSON correspondiente al chat
        const filePath = path.join(this.pathMessages, `${phoneNumber}.json`);

        // Sobrescribir el archivo JSON con el nuevo contenido del chat
        fs.writeFileSync(filePath, JSON.stringify(chat, null, 4), 'utf-8');

        return chat;
    }

}