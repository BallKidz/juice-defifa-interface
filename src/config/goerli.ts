import DefifaDeployment from "@ballkidz/defifa-collection-deployer/broadcast/Deploy.s.sol/5/run-latest.json";
import DefifaDelegate from "@ballkidz/defifa-collection-deployer/out/DefifaDelegate.sol/DefifaDelegate.json";
import DefifaDeployer from "@ballkidz/defifa-collection-deployer/out/DefifaDeployer.sol/DefifaDeployer.json";
import DefifaGovernor from "@ballkidz/defifa-collection-deployer/out/DefifaGovernor.sol/DefifaGovernor.json";
import Juice721DelegateDeployment from "@jbx-protocol/juice-721-delegate/broadcast/Deploy.s.sol/5/run-latest.json";
import IJBTiered721DelegateStore from "@jbx-protocol/juice-721-delegate/out/IJBTiered721DelegateStore.sol/IJBTiered721DelegateStore.json";
import JBController from "@jbx-protocol/juice-contracts-v3/deployments/goerli/JBController3_1.json";
import JBETHPaymentTerminal from "@jbx-protocol/juice-contracts-v3/deployments/goerli/JBETHPaymentTerminal3_1.json";
import JBProjects from "@jbx-protocol/juice-contracts-v3/deployments/goerli/JBProjects.json";
import JBSingleTokenPaymentTerminalStore from "@jbx-protocol/juice-contracts-v3/deployments/goerli/JBSingleTokenPaymentTerminalStore.json";
import { DEFIFA_HOMEPAGE_PROJECT_ID_GOERLI } from "constants/constants";
import { addressFor, ForgeDeploy } from "forge-run-parser";
import { chain } from "wagmi";
import { DefifaConfig } from "./types";

export const DEFIFA_CONFIG_GOERLI: DefifaConfig = {
  homepageProjectId: DEFIFA_HOMEPAGE_PROJECT_ID_GOERLI,
  chainId: chain.goerli.id,

  JBProjects: {
    address: JBProjects.address as `0x${string}`,
    interface: JBProjects.abi,
  },

  JBController: {
    address: JBController.address as `0x${string}`,
    interface: JBController.abi,
  },
  JBSingleTokenPaymentTerminalStore: {
    interface: JBSingleTokenPaymentTerminalStore.abi,
  },
  JBETHPaymentTerminal: {
    address: JBETHPaymentTerminal.address as `0x${string}`,
    interface: JBETHPaymentTerminal.abi,
  },
  JBTiered721DelegateStore: {
    address: addressFor(
      "JBTiered721DelegateStore",
      Juice721DelegateDeployment as ForgeDeploy
    ) as `0x${string}`,
    interface: IJBTiered721DelegateStore.abi,
  },
  DefifaDelegate: {
    address: addressFor(
      "DefifaDelegate",
      DefifaDeployment as ForgeDeploy
    ) as `0x${string}`,
    interface: DefifaDelegate.abi,
  },
  DefifaGovernor: {
    address: addressFor(
      "DefifaGovernor",
      DefifaDeployment as ForgeDeploy
    ) as `0x${string}`,
    interface: DefifaGovernor.abi,
  },
  DefifaDeployer: {
    address: addressFor(
      "DefifaDeployer",
      DefifaDeployment as ForgeDeploy
    ) as `0x${string}`,
    interface: DefifaDeployer.abi,
  },
  subgraph:
    "https://api.studio.thegraph.com/query/36773/defifa-aeolian/version/latest",
  governorSubgraph:
    "https://api.studio.thegraph.com/query/36773/defifa-aeolian/version/latest",
};

console.info("goerli chain data::", DEFIFA_CONFIG_GOERLI);
