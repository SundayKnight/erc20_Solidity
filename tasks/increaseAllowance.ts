import { task } from 'hardhat/config'
import { BigNumber, ContractTransaction, ContractReceipt } from "ethers";
import { Address } from 'cluster';

task('increaseallowance', 'Increase the allowance granted by the owner to a spender')
    .addParam('spender', 'Spender address')
    .addParam('addedvalue', 'The amount to increase allowance')
    .setAction(async ({ spender, addedvalue }, { ethers }) => {
        const myToken = await ethers.getContractFactory('MyToken')
        const contract = myToken.attach(process.env.CONTRACT_ADDRESS!);

        const contractTx: ContractTransaction = await contract.increaseAllowance(spender, addedvalue);
        const contractReceipt: ContractReceipt = await contractTx.wait();
        const event = contractReceipt.events?.find(event => event.event === 'Approval');
        const evOwner: Address = event?.args!['owner'];
        const eSpender: Address = event?.args!['spender'];
        const eAmount: BigNumber = event?.args!['value'];
        console.log(`Initiator: ${evOwner}`);
        console.log(`Spender: ${eSpender}`);
        console.log(`Amount: ${eAmount}`);
    })
