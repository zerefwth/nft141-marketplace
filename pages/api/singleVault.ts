import React, { useState } from 'react';
import { ethers } from 'ethers'
import axios from 'axios'
import { getPairContract, getNFTContract } from '../../libraries/blockchain/near/utils';
import Big from 'big.js';

const BOATLOAD_OF_GAS = Big(3).times(10 ** 13).toFixed();

type Contract = {
  [key: string]: any
}

export const getSingleVault = async (i: string) => {
    const factoryContract = window.factoryContract
    const address = await factoryContract.getPairAddressByIndex({ "index": parseInt(i) });
    let vaultContract = await getPairContract(address);
    /*
    *  map over items returned from smart contract and format
    *  them as well as fetch their token metadata
    */
    return vaultContract
}

export const loadVaultNfts = async (vaultContract: any) => {
    let address = await vaultContract.get_nft_contract_address();
    const nftContract: Contract = await getNFTContract(address);
    const data = await nftContract.nft_tokens_for_owner({account_id: vaultContract.contractId});

    const items = await Promise.all(data.map(async (i: any) => {
        const meta = i.metadata
        let item = {
          tokenId: i.token_id,
          owner: i.owner_id,
          image: meta.media,
          name: meta.title,
          description: meta.description,
        }
        return item
      }))
    return items
}

export const loadYourNfts = async (vaultContract: any) => {
  let address = await vaultContract.get_nft_contract_address();
  const nftContract: Contract = await getNFTContract(address);
  const data = await nftContract.nft_tokens_for_owner({account_id: window.accountId});

  const items = await Promise.all(data.map(async (i: any) => {
      const meta = i.metadata
      let item = {
        tokenId: i.token_id,
        owner: i.owner_id,
        image: meta.media,
        name: meta.title,
        description: meta.description,
        approveIds: i.approved_account_ids
      }
      return item
    }))
  return items
}

export const loadYourBalance = async (vaultContract: any) => {
  const balance = await vaultContract.ft_balance_of(
    { account_id: window.accountId }
  );
  return Big(balance).div(10**24).toFixed()
}

export const submitVault = async (name: string, symbol: string, nftOrigin: string, fileUrl: string | null) => {
  await window.factoryContract.nft141Pair(
    {name: name, nft_symbol: symbol, nft_origin: nftOrigin, feature_media: fileUrl},
    Big(3).times(10 ** 14).toFixed(),
    Big(1).times(10 ** 23).toFixed()
  )
}

export const approveNft = async (vaultContract: any, tokenId: string) => {
  let address = await vaultContract.get_nft_contract_address();
  const nftContract: Contract = await getNFTContract(address);
  await nftContract.nft_approve(
    {token_id: tokenId, account_id: vaultContract.contractId},     
    BOATLOAD_OF_GAS,
    Big(1).times(10 ** 23).toFixed()
  );
}

export const depositNft = async (vaultContract: any, tokenId: string) => {
  await vaultContract.multi_nft_deposits(
    { _ids: [tokenId] },
    BOATLOAD_OF_GAS,
    Big(1).times(10 ** 22).toFixed()
  )
}

export const withdrawNft = async (vaultContract: any, tokenId: string) => {
  await vaultContract.withdraw(
    { _id: tokenId },
    BOATLOAD_OF_GAS,
    Big(1).times(10 ** 23).toFixed()
  )
}
