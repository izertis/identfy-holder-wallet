export const credentialsAbi = [
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'uint8',
				name: 'version',
				type: 'uint8',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'from',
				type: 'address',
			},
		],
		name: 'ContractHealth',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'uint8',
				name: 'version',
				type: 'uint8',
			},
		],
		name: 'Initialized',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'bytes32',
				name: 'hash',
				type: 'bytes32',
			},
			{
				indexed: false,
				internalType: 'string',
				name: 'status',
				type: 'string',
			},
		],
		name: 'ObjectUpdated',
		type: 'event',
	},
	{
		inputs: [
			{
				internalType: 'bytes32',
				name: 'hash',
				type: 'bytes32',
			},
			{
				internalType: 'address',
				name: 'owner',
				type: 'address',
			},
		],
		name: 'getObjectStatus',
		outputs: [
			{
				internalType: 'string',
				name: 'status',
				type: 'string',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'initialize',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'readHealth',
		outputs: [
			{
				internalType: 'uint8',
				name: 'version',
				type: 'uint8',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'bytes32',
				name: 'hash',
				type: 'bytes32',
			},
			{
				internalType: 'enum Status',
				name: 'status',
				type: 'uint8',
			},
		],
		name: 'setObjectStatus',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'writeHealth',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
]
