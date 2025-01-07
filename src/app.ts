import express from "express";
import { Envs } from "./config/envs";
import * as bodyParser from "body-parser";
import { AppRoutes } from "./presentation/router";
import { createServer } from "http";
import { WssService } from "./presentation/services/wss.service";
import cors from "cors";

(()=>{
    main();
})();

function main(){

    const app = express();

    app.use( express.json() );

    app.use(bodyParser.json());
    app.use(express.json());

    
    app.use( cors() )
    
    const httpServer = createServer( app );

    WssService.initWss({server: httpServer});
    
    app.use( AppRoutes.routes )

    httpServer.listen( Envs.PORT, ()=>{
        console.log('App running on port '+ Envs.PORT)
    })

}