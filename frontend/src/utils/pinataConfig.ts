import { PinataSDK } from "pinata-web3"
import {PINATA_GATEWAY, PINATA_API_JWT} from "./constants.js";

export const pinata = new PinataSDK({
  pinataJwt: PINATA_API_JWT,
  pinataGateway: PINATA_GATEWAY,
})
