import React, { useEffect, useRef, useState } from 'react';
import type { NextPage } from 'next';
import { useContractWrite, usePrepareContractWrite } from 'wagmi'
import {Button, TextField, MenuItem, Typography} from '@mui/material';
import { Configuration, ImagesResponseDataInner, OpenAIApi } from "openai";
import abi from "../../config/abi.json";
import css from "../../styles/mint.module.css";
import { ethers } from 'ethers';


const Mint: NextPage = () => {
  
  const [formData, setFormData] = useState({
    gender: "Male",
    martialArt: "KickBoxing",
    skin: "Caucasian",
    hairStyle: "Short",
    hairColor: "Black",
    weightClass: "Middleweight"
  });
  const [images, setImages] = useState<ImagesResponseDataInner[]>([])

  const oai = useRef(new OpenAIApi(new Configuration({
    // organization: "org-QSeiWUv21jjZOahwJ8IjepUA",
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  })))

  const { config } = usePrepareContractWrite({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    abi: abi,
    functionName: 'mint',
    args: ["Judo", "https://oaidalleapiprodscus.blob.core.windows.net/private/org-VRpf7xj3xFII0I4O9QQxdLnz/user-29wJJuLmNEdwAEb6pby27pKy/img-py8KqrOJlUzHBwIY6KRFmwiZ.png?st=2022-12-18T13%3A17%3A09Z&se=2022-12-18T15%3A17%3A09Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2022-12-18T05%3A26%3A23Z&ske=2022-12-19T05%3A26%3A23Z&sks=b&skv=2021-08-06&sig=YZQ/ZNbRBRbRVWnApzKpRMQsV9266%2Bx7WK6m/qvgT9M%3D"],
    overrides: {
      value: ethers.utils.parseEther('0.01'),
    },
  });

  const { data, isLoading, isSuccess, write } = useContractWrite(config)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData( prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }
  
  const create = async () => {
    try {
      const text = `
        Character Avatar picture of a card based fighting game. 
        Character fighting style is ${formData["martialArt"]}. 
        External characteristics:
        ${formData["gender"]}
        ${formData["skin"]} skin
        ${formData["hairStyle"]} hair style
        ${formData["hairColor"]} hair color
        ${formData["weightClass"]} weight class
        [white] background
        Art style: digital art
      `
      const {data} = await oai.current.createImage({
        prompt: text,
        n: 1,
        size: "256x256",
      });
      setImages(data.data)
      write?.({
        recklesslySetUnpreparedArgs: [
          formData["martialArt"],
          data.data[0].url
        ]
      })
    } catch (error) {
      console.error(error);
    }

  }

  return ( 
    <div className={css.root}>
      <div className={css.container}>
        <TextField
          select
          label="Gender"
          name="gender"
          value={formData["gender"]}
          onChange={handleChange}
        >
          <MenuItem value={"Male"}>Male</MenuItem>
          <MenuItem value={"Female"}>Female</MenuItem>
        </TextField>
        <br/>
        <TextField
          select
          name="martialArt"
          label="Martial Art"
          value={formData["martialArt"]}
          onChange={handleChange}
        >
          <MenuItem value={"Wrestling"}>Wrestling</MenuItem>
          <MenuItem value={"KickBoxing"}>Kick-Boxing</MenuItem>
          <MenuItem value={"Judo"}>Judo</MenuItem>
          <MenuItem value={"JiuJitsu"}>Jiu Jitsu</MenuItem>
          <MenuItem value={"MuaiThai"}>Muai Thai</MenuItem>
        </TextField>
        <br/>
        <TextField
          // variant="standard"
          select
          name="skin"
          label="Skin"
          value={formData["skin"]}
          onChange={handleChange}
        >
          <MenuItem value={"Caucasian"}>Caucasian</MenuItem>
          <MenuItem value={"DarkSkinned"}>Dark-Skinned</MenuItem>
          <MenuItem value={"Asian"}>Asian</MenuItem>
        </TextField>
        <br/>
        <TextField
          // variant="standard"
          select
          name="hairStyle"
          label="Hair Style"
          value={formData["hairStyle"]}
          onChange={handleChange}
        >
          <MenuItem value={"Bald"}>Bald</MenuItem>
          <MenuItem value={"Short"}>Short</MenuItem>
          <MenuItem value={"Long"}>Long</MenuItem>
        </TextField>
        <br/>
        <TextField
          // variant="standard"
          select
          label="Hair Color"
          name="hairColor"
          value={formData["hairColor"]}
          onChange={handleChange}
        >
          <MenuItem value={"Black"}>Black</MenuItem>
          <MenuItem value={"Blonde"}>Blonde</MenuItem>
          <MenuItem value={"Brown"}>Brown</MenuItem>
          <MenuItem value={"Ginger"}>Ginger</MenuItem>
        </TextField>
        <br/>
        <TextField
          // variant="standard"
          select
          label="Weight Class"
          name="weightClass"
          value={formData["weightClass"]}
          onChange={handleChange}
        >
          <MenuItem value={"Lightweight"}>Lightweight</MenuItem>
          <MenuItem value={"Middleweight"}>Middleweight</MenuItem>
          <MenuItem value={"Heavyweight"}>Heavyweight</MenuItem>
        </TextField>
        <br/>
      </div>
      <br/>
      <Button
          disabled={!write}
          onClick={create}
          variant="contained"
        >
          Mint
      </Button>

      {/* <div className={css.imageContainer}>

        { images.length > 0 && 
          images.map( (img: any) => 
            <img key={img.url} className={css.image} src={img.url}/>  
          )

        }
      </div> */}

      {isLoading && <div>Check Wallet</div>}
      {isSuccess && 
        <div>
          <br/>
          <Typography> Your fighter is being minted </Typography>
          <Typography>  Transaction:  <a style={{color: "#4ba9af"}} href={`https://mumbai.polygonscan.com/tx/${data.hash}`}>
              {data.hash}
            </a>
          </Typography>
        </div>
      }
    </div>
  );
};

export default Mint;
