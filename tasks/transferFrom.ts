import { task } from 'hardhat/config'
import { BigNumber, ContractTransaction, ContractReceipt } from "ethers";
import { Address } from 'cluster';

task('transferfrom', 'Transfer tokens from one address to another')
    .addParam('from', 'From whom to transfer address')
    .addParam('to', 'Recipient user address')
    .addParam('amount', 'Token amount')
    .setAction(async ({ from, to, amount }, { ethers }) => {
        const myToken = await ethers.getContractFactory('MyToken')
        const contract = myToken.attach(process.env.CONTRACT_ADDRESS!);

        const contractTx: ContractTransaction = await contract.transferFrom(from, to, amount);
        const contractReceipt: ContractReceipt = await contractTx.wait();
        const event = contractReceipt.events?.find(event => event.event === 'Transfer');
        const eFrom: Address = event?.args!['from'];
        const eTo: Address = event?.args!['to'];
        const eAmount: BigNumber = event?.args!['value'];
        console.log(`Transfer from: ${eFrom}`)
        console.log(`Transfer to: ${eTo}`)
        console.log(`Amount: ${eAmount}`)
    })
