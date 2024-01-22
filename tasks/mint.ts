import { task } from 'hardhat/config'
import { BigNumber, ContractTransaction, ContractReceipt } from "ethers";
import { Address } from 'cluster';

task('mint', 'Mint tokens')
    .addParam('user', 'Recipient user address')
    .addParam('amount', 'Amount')
    .setAction(async ({ user, amount }, { ethers }) => {
        const myToken = await ethers.getContractFactory('MyToken')
        const contract = myToken.attach(process.env.CONTRACT_ADDRESS!);

        const contractTx: ContractTransaction = await contract.mint(user, amount);
        const contractReceipt: ContractReceipt = await contractTx.wait();
        const event = contractReceipt.events?.find(event => event.event === 'Transfer');
        const eFrom: Address = event?.args!['from'];
        const eTo: Address = event?.args!['to'];
        const eAmount: BigNumber = event?.args!['value'];
        console.log(`Transfer from: ${eFrom}`)
        console.log(`Transfer to: ${eTo}`)
        console.log(`Amount: ${eAmount}`)
    })
