import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import styled from 'styled-components'
import { useEffect, useState } from "react";

export default function Btn(){

const Btn = styled.button`
display: inline-block;
background-color: #ede135;
color: ${props => props.theme.body};
outline: none;
border: none;

font-size: ${props => props.theme.fontsm};
padding: 0.9rem 2.3rem;
border-radius: 50px;
cursor: pointer;
transition: all 0.2s ease;
position: relative;
&:hover{
    transform: scale(0.9);
}

&::after{
    content: ' ';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0);
    border: 2px solid ${props => props.theme.text};
    width: 100%;
    height: 100%;
    border-radius: 50px;
    transition: all 0.2s ease;
}

&:hover::after{
    transform: translate(-50%, -50%) scale(1);
    padding: 0.3rem;
}
`

    const [currentAccount, setCurrentAccount] = useState(null);
  
    const checkWalletIsConnected = async () => {
      const { ethereum } = window;
  
      if (!ethereum) {
        console.log("Make sure you have Metamask installed!");
        return;
      } else {
        console.log("Wallet exists! We're ready to go!");
      }
  
      const accounts = await ethereum.request({ method: "eth_accounts" });
  
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account: ", account);
        setCurrentAccount(account);
      } else {
        console.log("No authorized account found");
      }
    };
  
    const connectWalletHandler = async () => {
      const { ethereum } = window;
  
      if (!ethereum) {
        alert("Please install Metamask!");
      }
  
      try {
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        console.log("Found an account! Address: ", accounts[0]);
        setCurrentAccount(accounts[0]);
      } catch (err) {
        console.log(err);
      }
    };
  
    const connectWalletButton = () => {
      return (
        <Btn
                onClick={connectWalletHandler}
              >
                Connect Wallet
              </Btn>
      );
    };
  
    const ConnectedButton = () => {
      return (
        <Button
                size="large"
                sx={{
                  marginRight: "6%",
                  borderRadius: "15%",
                  backgroundColor: "green",
                  color: "white",
                  border: "none",
                  fontWeight: "bolder",
                  fontSize: "16px",
                  letterSpacing: "-.5px",
                  textAlign: "center",
                  textTransform: "none",
                  cursor: "pointer",
                  ":hover": {
                    backgroundColor: "green",
                    color: "white",
                  },
                }}
              >
                Connected
              </Button>
      );
    };
    
  
    useEffect(() => {
      checkWalletIsConnected();
    }, []);
  
  
    return (

            <div>{currentAccount ? ConnectedButton() : connectWalletButton()}</div>

    );
}