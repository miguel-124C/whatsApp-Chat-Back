
export interface ShipmentStatus {
    id:           string;
    status:       string;
    timestamp:    string;
    recipient_id: string;
    conversation: Conversation;
    pricing:      Pricing;
}

export interface Conversation {
    id:                   string;
    expiration_timestamp: string;
    origin:               Origin;
}

export interface Origin {
    type: string;
}

export interface Pricing {
    billable:      boolean;
    pricing_model: string;
    category:      string;
}
