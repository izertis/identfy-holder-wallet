export const lacchainDIDBasicConfiguration = {
	registry: process.env.LAC_REGISTRY,
	rpcUrl: process.env.LAC_RPC_URL,
	nodeAddress: process.env.LAC_NODE_ADDRESS,
	expiration: Math.floor(Date.now() / 1000) + 173639452,
	network: process.env.LAC_NETWORK,
}

export const mailboxDID =
	process.env.LAC_MAILBOX_DID || 'did:lac:openprotest:0xf33bc23691245c2d5de99d7d45e9fdd113495870'
