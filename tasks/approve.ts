import { task } from 'hardhat/config';
import { BigNumber, ContractTransaction, ContractReceipt } from "ethers";
import { Address } from 'cluster';

task('approve', 'Approve spender to spend tokens')
	.addParam('spender', 'Address of the spender')
	.addParam('amount', 'Amount of tokens to approve')
	.setAction(async ({ spender, amount }, { ethers }) => {
		const myToken = await ethers.getContractFactory('MyToken')
		const contract = myToken.attach(process.env.CONTRACT_ADDRESS!);

		const contractTx: ContractTransaction = await contract.approve(spender, amount);
		const contractReceipt: ContractReceipt = await contractTx.wait();
		const event = contractReceipt.events?.find(event => event.event === 'Approval');
		const evOwner: Address = event?.args!['owner'];
		const eSpender: Address = event?.args!['spender'];
		const eAmount: BigNumber = event?.args!['value'];
		console.log(`Initiator: ${evOwner}`);
		console.log(`Spender: ${eSpender}`);
		console.log(`Amount: ${eAmount}`);
	});
