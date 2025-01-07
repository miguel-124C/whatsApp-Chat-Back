
export interface ReciveValueMessageWhatsApp {
    messaging_product: string;
    metadata:          Metadata;
    contacts:          ContactMessageWhatsApp[];
    messages:          MessageWhatsApp[];
}

export interface ContactMessageWhatsApp {
    profile: Profile;
    wa_id:   string;
}

interface Profile {
    name: string;
}

export interface MessageWhatsApp {
    from:      string;
    id:        string;
    timestamp: string;
    text:      Text;
    type:      string;
}

interface Text {
    body: string;
}

export interface Metadata {
    display_phone_number: string;
    phone_number_id:      string;
}
