import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { NextPage } from 'next';
import { useAccount, useContractWrite, usePrepareContractWrite } from 'wagmi'
import {Button, TextField, MenuItem, Typography} from '@mui/material';
import { Configuration, ImagesResponseDataInner, OpenAIApi } from "openai";
import abi from "../../config/abi.json";
import css from "../../styles/mint.module.css";
import { ethers } from 'ethers';
import Rooms from './rooms';
import Moralis from 'moralis';
import { EvmChain } from '@moralisweb3/common-evm-utils';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Fighter from './fighter';

const Fight: NextPage = () => {
  const [fighters, setFighters] = useState([]);
  const { address: user } = useAccount()
  const router = useRouter();
  
  useEffect( () => {
    fetchFighters();
  },[user]);

  const fetchFighters = async () => {
    try {
      await Moralis.start({
        apiKey: process.env.NEXT_PUBLIC_MORALIS_API_KEY
      }); 
    } catch (error) {
      console.warn(error);
    }
    const chain = EvmChain.MUMBAI;
    const response = await Moralis.EvmApi.nft.getContractNFTs({
      address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
      chain,
    });
    
    const res = response.toJSON();
    const fighters = res.result;

    // const mine = fighters?.filter()
    setFighters(res.result)
  }

  const { config } = usePrepareContractWrite({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    abi: abi,
    functionName: 'join'
  });

  const { data, isLoading, isSuccess, write } = useContractWrite(config)

  return ( 
    <div className={css.root}>
      <div className={css.container}>
        <Typography>Fighters</Typography>
        { fighters.length > 0 
          ?
            fighters.map ( fighter =>
              <Fighter
                fighter={fighter}
              />
            )
          : 
            <div style={{display: 'flex', flex:1,  flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
              <Typography>
                No fighters found yet.
              </Typography>
              <Button onClick={() => router.push('/mint')}>
                Mint
              </Button>
            </div>
        }
      </div>
      {/* <Rooms/> */}
    </div>
  );
};

export default Fight;
