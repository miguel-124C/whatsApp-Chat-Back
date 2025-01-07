import { Request, Response } from 'express';
import { MessageWhatsAppUtil } from '../utils/message-whatsapp.util';
import { ReciveMessageWhatsAppDto } from '../../domain/dtos/recive-message-whatsapp.dto';
import { ShipmentMessageWhatsAppDto } from '../../domain/dtos/shipment-message-whatsapp.dto';
import { WhatsAppCloudApi } from '../services/whatsapp-cloud-api.service';


export class WhatsAppController {

  constructor(
    private readonly whatsAppService: WhatsAppCloudApi,
  ){}

  messages = async (req: Request, res: Response) => {
    if(!req.body.object) return res.status(400).json({error: 'Missing Object in Body'});

    switch (MessageWhatsAppUtil.VerifyTypeMessage(req.body)) {
      case 'SHIPMENT':{
        const [ error, shipmentMessageWhatsAppDto ] = ShipmentMessageWhatsAppDto.create( req.body );
        if(error) return res.sendStatus(404);

        console.log(shipmentMessageWhatsAppDto?.shipmentStatus.status)
        res.sendStatus(200);
        break;
      }
      case 'RECIVE':{
        const [ error, reciveMessageWhatsAppDto ] = ReciveMessageWhatsAppDto.create( req.body );
        if(error) return res.sendStatus(404);

        this.whatsAppService.reciveMessage(reciveMessageWhatsAppDto!)
          .then(()=> res.sendStatus(200))
          .catch(()=> res.sendStatus(400))
        break;
      }
      default:
        res.sendStatus(404);
        break;
    }
  }

  listContact = (req: Request, res: Response) =>{
    const contacts = this.whatsAppService.getListContacts() || null;
    res.status(200).json(contacts);
  }

  listChat = (req: Request, res: Response) =>{
    const { phonenumber } = req.params;

    const chat = this.whatsAppService.getChatByPhoneNumber(phonenumber);

    res.status(200).json(chat);
  }

  sendMessage = (req: Request, res: Response) =>{
    const { to, message  } = req.body;

    this.whatsAppService.sendMessage(to, message)
      .then(()=> res.sendStatus(200))
      .catch(()=> res.sendStatus(400));
  }

  verifyToken = (req: Request, res: Response) => {
    console.log('Llego a verifyToken')
    const verify_token = process.env.VERIFY_TOKEN;
    // Parse params from the webhook verification request
    let mode = req.query["hub.mode"] as string;
    let token = req.query["hub.verify_token"] as string;
    let challenge = req.query["hub.challenge"] as string;

    this.whatsAppService.validateToken(mode, token, verify_token!)
      .then(()=> res.status(200).send(challenge))
      .catch(()=> res.sendStatus(400))
  }

}