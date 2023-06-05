import { BigNumber, ethers } from "ethers";

export const MINT_PRICE = ethers.utils.parseEther("0.01");
export const TOTAL_REDEMPTION_WEIGHT =
  BigNumber.from(1_000_000_000_000_000).mul(1000); // mul, to avoid overflow error
export const BALLKIDZ_MULTISIG_ADDRESS =
  "0x11834239698c7336EF232C00a2A9926d3375DF9D";
