
export enum TypeMessage {
    TEXT = "text"
}

export enum StatusMessage {
    SENT      = 'sent',
    DELIVERED = 'delivered',
    READ      = 'read',
}

export interface Message { 
    id: string,
    of: 'me' | 'to',
    text: string,
    typeText: TypeMessage,
    status: StatusMessage,
    timestamp: string
    isReaction?: boolean
    idReaction?: null | string,
    idMessageRespondido?: null | string,
}

export interface Contact {
    phoneNumber: string,
    nameContact: string,
    lastMessage: Message,
}

export interface Chat {
    phoneNumber: string,
    nameContact: string,
    messages: Message[]
}