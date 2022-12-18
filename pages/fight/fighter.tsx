import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { NextPage } from 'next';
import { useAccount, useContractRead, useContractWrite, usePrepareContractWrite } from 'wagmi'
import {Button, TextField, MenuItem, Typography} from '@mui/material';
import { Configuration, ImagesResponseDataInner, OpenAIApi } from "openai";
import abi from "../../config/abi.json";
import css from "../../styles/mint.module.css";
import { ethers } from 'ethers';
import Moralis from 'moralis';
import { EvmChain } from '@moralisweb3/common-evm-utils';

const Fighter = (fighter) => {
  const [stats, setStats] = useState([]);
  const { address } = useAccount()
  
  const contractRead = useContractRead({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    abi: abi,
    functionName: 'getFighterStats',
    args: [ethers.BigNumber.from(fighter.id ?? 0)],
  })
  console.log(ethers.BigNumber.from(fighter.id ?? 0));

  console.log(contractRead);



  const { config } = usePrepareContractWrite({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    abi: abi,
    functionName: 'fight'
  });

  const { data, isLoading, isSuccess, write } = useContractWrite(config)



  return ( 
    <div className={css.card}>
      <img src={fighter.token_uri} className={css.image}/>
    </div>
  );
};

export default Fighter;
