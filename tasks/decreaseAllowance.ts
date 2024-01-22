import { task } from 'hardhat/config'
import { BigNumber, ContractTransaction, ContractReceipt } from "ethers";
import { Address } from 'cluster';

task('decreaseallowance', 'Decrease the allowance granted by the owner to a spender')
    .addParam('spender', 'Spender address')
    .addParam('subtractedvalue', 'Amount to decrease allowance')
    .setAction(async ({ spender, subtractedvalue }, { ethers }) => {
        const myToken = await ethers.getContractFactory('MyToken')
        const contract = myToken.attach(process.env.CONTRACT_ADDRESS!);

        const contractTx: ContractTransaction = await contract.decreaseAllowance(spender, subtractedvalue);
        const contractReceipt: ContractReceipt = await contractTx.wait();
        const event = contractReceipt.events?.find(event => event.event === 'Approval');
        const evOwner: Address = event?.args!['owner'];
        const eSpender: Address = event?.args!['spender'];
        const eAmount: BigNumber = event?.args!['value'];
        console.log(`Initiator: ${evOwner}`);
        console.log(`Spender: ${eSpender}`);
        console.log(`Amount: ${eAmount}`);
    })
