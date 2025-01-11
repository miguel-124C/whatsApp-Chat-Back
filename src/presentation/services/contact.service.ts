import path from "path";
import { Contact, Message } from "../interfaces";
import fs from "fs";


export class ContactService {

    private readonly pathContacts: string;

    constructor() {
        this.pathContacts = path.resolve( __dirname, '../../../contacts' );

        if(!fs.existsSync(this.pathContacts)){
            fs.mkdirSync(this.pathContacts, { recursive: true });
        }
    }

    public existsContact( wa_id: string ){
        return this.getContacts().filter( c => c.phoneNumber === wa_id ).length > 0;
    }

    createContact( contact: Contact ){
        const path = `${this.pathContacts}/${contact.phoneNumber}.json`;

        fs.writeFile(path, JSON.stringify(contact, null, 4), (err) => {
            if (err) {
              console.error('Error al crear el archivo:', err);
            } else {
              console.log('Archivo creado exitosamente.');
            }
        });
    }

    getContacts( ): Contact[] {
        // Obtener los archivos de la carpeta
        const files = fs.readdirSync(this.pathContacts);
        
        // Filtrar los archivos JSON
        const jsonFiles = files.filter(file => path.extname(file).toLowerCase() === '.json');
      
        // Leer y parsear los archivos JSON
        const jsonData: Contact[] = jsonFiles.map(file => {
          const filePath = path.join(this.pathContacts, file);
          const fileContent = fs.readFileSync(filePath, 'utf-8');
          return JSON.parse(fileContent);
        });

        return jsonData;
    }

    moveContactInFirstPosition( phoneNumber: string ){
        const CONTACTS =  this.getContacts();
        const contact = this.getCoctactByPhoneNumber(phoneNumber);
        const contactIndex = CONTACTS.findIndex( c => c.phoneNumber === phoneNumber );
        const contacts = CONTACTS.filter((c, index)=> index !== contactIndex);

        contacts.unshift(contact!);

        return contacts;
    }

    getCoctactByPhoneNumber( phoneNumber: string ): Contact{
        // Obtener los archivos de la carpeta
        const files = fs.readdirSync(this.pathContacts);
      
        // Filtrar los archivos JSON
        const jsonFiles = files.filter(file => path.extname(file).toLowerCase() === '.json');
      
        // Leer y parsear los archivos JSON
        const contacts: Contact[] = jsonFiles.map(file => {
          const filePath = path.join(this.pathContacts, file);
          const fileContent = fs.readFileSync(filePath, 'utf-8');
          return JSON.parse(fileContent);
        });
        
        return contacts.filter( contact => contact.phoneNumber == phoneNumber).at(0)!;
    }

    updateLastMessage( phoneNumber: string, message: Message ){
        const contact = this.getCoctactByPhoneNumber( phoneNumber );
        
         // Si no existe el chat, deberías manejar este caso (crear un nuevo chat, por ejemplo)
        if (!contact) {
            throw new Error(`No se encontró el chat para el número: ${phoneNumber}`);
        }

        // Agregar el mensaje al array de mensajes del chat
        contact.lastMessage = message;

        // Obtener la ruta del archivo JSON correspondiente al chat
        const filePath = path.join(this.pathContacts, `${phoneNumber}.json`);

        // Sobrescribir el archivo JSON con el nuevo contenido del chat
        fs.writeFileSync(filePath, JSON.stringify(contact, null, 4), 'utf-8');
    }

}