import {sepolia} from "viem/chains";
import { createPublicClient, http } from "viem";

export const publicClient = createPublicClient({
  chain: sepolia,   
  transport: http(),
});