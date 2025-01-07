import { Router } from 'express';
import { WhatsAppRoutes } from './whatsapp/router';

export class AppRoutes {


  static get routes(): Router {

    const router = Router();
    
    // Definir las rutas
    router.use('/api/whatsapp', WhatsAppRoutes.routes );

    return router;
  }


}