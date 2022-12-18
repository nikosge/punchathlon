import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { NextPage } from 'next';
import { useAccount, useContractWrite, usePrepareContractWrite } from 'wagmi'
import {Button, TextField, MenuItem, Typography} from '@mui/material';
import { Configuration, ImagesResponseDataInner, OpenAIApi } from "openai";
import abi from "../../config/abi.json";
import css from "../../styles/mint.module.css";
import { ethers } from 'ethers';
import Moralis from 'moralis';
import { EvmChain } from '@moralisweb3/common-evm-utils';

const Rooms: NextPage = () => {
  const [rooms, setRooms] = useState([]);
  const { address } = useAccount()

  useEffect( () => {
    fetchRooms();
  },[address]);

  const fetchRooms = async () => {
    try {
        await Moralis.start({
          apiKey: process.env.NEXT_PUBLIC_MORALIS_API_KEY
        }); 
    } catch (error) {
        console.warn(error);
    }

    const chain = EvmChain.MUMBAI;

    const response = await Moralis.EvmApi.nft.getWalletNFTs({
      address,
      chain,
    });
    
    const res = response.toJSON();
    setRooms(res.result)
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
        <Typography>Rooms</Typography>
        { rooms.map ( fighter => {
          return (
            <div className={css.card}>
              <img src={fighter.token_uri} className={css.image}/>
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default Rooms;
