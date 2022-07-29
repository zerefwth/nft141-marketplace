import React, { useState } from 'react';
import axios from 'axios'
// import { any } from 'hardhat/internal/core/params/argumentTypes';


export const loadVaults = async () => {
    
    const factoryContract = window.factoryContract
    const data = await factoryContract.getAllPairsInfo();

    /*
    *  map over items returned from smart contract and format
    *  them as well as fetch their token metadata
    */
    const items = await Promise.all(data.map(async (i: any) => {
      let item = {
        name: i.name,
        symbol: i.symbol,
        supply: i.supply,
        image: i.media,
      }
      return item
    }))
    return items
  }
