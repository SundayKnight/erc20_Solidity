import { DeployFunction } from "hardhat-deploy/types"
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { appendFileSync, readFileSync } from "fs";

const deployFunction: DeployFunction = async function ({
  deployments,
  getNamedAccounts,
  run
}: HardhatRuntimeEnvironment) {

  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const name = "MyToken";
  const symbol = "MTK";
  log(`MyTokenContract is deploying...`)

  const myToken = await deploy("MyToken", {
    from: deployer,
    args: [name, symbol],
    waitConfirmations: process.env.VERIFY_ON_DEPLOY === "true" ? 6 : undefined,
    log: true
  });

  //Sync env file
  appendFileSync(
    `.env`,
    `\r\# Deployed at \rCONTRACT_ADDRESS="${myToken.address}"\r`
  )
  log(`MyTokenContract deployed at ${myToken.address}`)

  if (process.env.VERIFY_ON_DEPLOY === "true") {
    try {
      await run("verify:verify", {
        address: myToken!.address,
        constructorArguments: [name, symbol],
      });
    } catch (error) {
      console.error(error);
    }
  }
};

export default deployFunction;
deployFunction.tags = ['myToken'];