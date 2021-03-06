import { ethers } from 'ethers'
import GetFarms from '../artifacts/contracts/GetFarms.sol/GetFarms.json'

const {BigNumber} = require("bignumber.js");
const Addresses = require('./Addresses.json');
const GetFarms_Address = Addresses['GetFarms'];

async function getFarms() {
    // check if browser has metamask
    if (typeof window.ethereum !== 'undefined') {
        let data;
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner()
        const Address = signer.getAddress()

        // create contract with address from deployer script and abi from artifacts folder
        const contract = new ethers.Contract(GetFarms_Address, GetFarms.abi, provider)

            let farms = []
            let newFarms = []
            let newSymbols = [];
            let i=0
            let length = await contract.getLength()
            console.log(length)
            // the contract takes batches of 10 so we iterate i by 10 
            while(i<length){
            
            newFarms = await contract.getBatchFarms(Address, i)
            console.log(newFarms)
            newSymbols = await contract.getSymbols(i)
            console.log(newSymbols)
            for(let j=0;j<10;j++){
                farms.push({id:i+j,name:newSymbols[j][0] +'/' + newSymbols[j][1], amount: parseFloat(ethers.utils.formatUnits(newFarms[j][0], 18)).toFixed(2), rewards: parseFloat(ethers.utils.formatUnits(newFarms[j][1]), 18).toFixed(2) })
            }
                i += 10
            }
        console.log(farms)
        return farms
      }
    

}
export default getFarms;
