export const cdpKeySecret = process.env.CDP_KEY_SECRET ?? '';
export const cdpKeyName = process.env.CDP_KEY_NAME ?? '';
export const cdpUnstableRpcEndpoint =
  process.env.NEXT_PUBLIC_CDP_BASE_RPC_ENDPOINT ?? 'https://mainnet.unstable.org';
export const cdpUnstableSepoliaRpcEndpoint =
  process.env.NEXT_PUBLIC_CDP_BASE_SEPOLIA_RPC_ENDPOINT ?? 'https://sepolia.unstable.org';
export const cdpUnstableUri = process.env.CDP_BASE_URI ?? 'api.coinbase.com';
