import "dotenv/config";
import { get } from "env-var";

export const Envs = {

    PORT: get('PORT').required().asPortNumber(),
    VERIFY_TOKEN: get('VERIFY_TOKEN').required().asString(),
    WHATSAPP_TOKEN: get('WHATSAPP_TOKEN').required().asString(),
    WHATSAPP_BUSINESS_PHONE_NUMBER_ID: get('WHATSAPP_BUSINESS_PHONE_NUMBER_ID').required().asString(),

    CLOUD_API_BASE_URL: get('CLOUD_API_BASE_URL').required().asString(),
    CLOUD_API_VERSION: get('CLOUD_API_VERSION').required().asString(),
}