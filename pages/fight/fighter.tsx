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

const Fighter = ({fighter, user}) => {
  const [outcome, setOutcome] = useState();
  const { address } = useAccount()
  const {data: stats} = useContractRead({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    abi: abi,
    functionName: 'getFighterStats',
    args: [ethers.BigNumber.from(fighter.token_id ?? 0)],
  })


  console.log(fighter.minter_address, address);
  const {data} = useContractRead({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    abi: abi,
    functionName: 'fight',
    args: [user.token_id, fighter.token_id],
  })

  const fight = () => {
    const winner = data.toNumber();
    console.log(winner, user.token_id, fighter.token_id);
    setOutcome(winner == user.token_id ? "WON" : "LOST");
    setTimeout( () => {
      setOutcome()
    }, 5000)
  }

  return ( 
    <div className={css.card}>
      <img src={fighter.token_uri} className={css.image}/>
      <div className={css.stats}>
        <Typography align="center" variant="h5"> STRENGTH <b>{stats?.strength}</b></Typography>
        <Typography align="center" variant="h5"> STAMINA <b>{stats?.stamina}</b></Typography>
        <Typography align="center" variant="h5"> TECHNIQUE <b>{stats?.technique}</b></Typography>
        <hr/>
        <Typography align="center" variant="h5"> VICTORIES <b>{stats?.victories}</b></Typography>
        <br/>
      </div>

      <div style={{justifyContent: 'center', display: "flex"}}>
        <Button 
          variant="contained"
          disabled={address?.toLowerCase() === fighter.minter_address?.toLowerCase()}
          onClick={fight}
        >
          Fight
        </Button>

      </div>
      <div>
          { outcome && 
          
            <Typography>{outcome}</Typography>
          }

        </div>

    </div>
  );
};

export default Fighter;
