import { Server } from "http";
import { WebSocket, WebSocketServer } from "ws";

interface Options {
    server: Server,
    path?: string,
}

export class  WssService {

    private static _instance: WssService;
    private wss: WebSocketServer;
    private wssClient?: WebSocket;

    private constructor({server, path = '/ws'}: Options){
        this.wss = new WebSocketServer({server, path});
        this.start();
    }

    static get instance(): WssService{
        if(!WssService._instance){
            throw 'WssService is not initialized';
        }

        return WssService._instance;
    }

    static initWss(options: Options ){
        WssService._instance = new WssService(options);
    }

    public sendMessage( type: string, payload: Object ){
        this.wssClient?.send(JSON.stringify({
            type, payload
        }));
    }

    start(){
        this.wss.on('connection', (ws: WebSocket)=>{
            this.wssClient = ws;
            console.log('Client connected');
            
            ws.on('close', ()=>{
                console.log('Client disconnected');
            })
        })
    }

}