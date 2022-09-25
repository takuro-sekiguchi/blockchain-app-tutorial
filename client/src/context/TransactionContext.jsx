import { ethers } from "ethers";
import { useState } from "react";
import { useEffect } from "react";
import { createContext } from "react";
import { contractABI, contractAddress } from "../utils/connect";

export const TransactionContext = createContext();
const { ethereum } = window;

//スマートコントラクトの取得
const getSmartContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const transactionContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );

  console.log(provider, signer, transactionContract);
  return transactionContract;
};

export const TransactionProvider = ({ children }) => {
  const [currectAccount, setCurrectAccount] = useState("");
  const [inputFormData, setInputFormData] = useState({
    addressTo: "",
    amount: "",
  });

  const handleChange = (e, name) => {
    setInputFormData((prevInputFormData) => ({
      ...prevInputFormData,
      [name]: e.target.value,
    }));
  };

  //メタマスクウォレットと連携しているのかを確認する
  const checkMetamaskWalletConnected = async () => {
    if (!ethereum) return alert("メタマスクをインストールしてください");

    //メタマスクのアカウントIDを取得
    const accounts = await ethereum.request({ method: "eth_accounts" });
    console.log(accounts);
  };

  //メタマスクウォレットと連携する
  const connectWallet = async () => {
    if (!ethereum) return alert("メタマスクをインストールしてください");

    //メタマスクを持ってればアカウントとの接続を開始する。
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    console.log(accounts[0]);
    setCurrectAccount(accounts[0]);
  };

  //実際に通貨のやり取りをする
  const sendTransaction = async () => {
    if (!ethereum) return alert("メタマスクをインストールしてください");
    console.log("sendTransacition");

    const { addressTo, amount } = inputFormData;
    const transactionContract = getSmartContract();
    const parsedAmount = ethers.utils.parseEther(amount);

    const transactionParameters = {
      gas: "0x2710",
      to: addressTo,
      from: currectAccount,
      value: parsedAmount._hex,
    };

    const txHash = await ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });

    const transactionHash = await transactionContract.addToBlockChain(
      addressTo,
      parsedAmount
    );
    console.log(`ロード中・・・${transactionHash.hash}`);
    await transactionHash.wait();
    console.log(`送金に成功しました！${transactionHash.hash}`);
  };

  useEffect(() => {
    checkMetamaskWalletConnected();
  }, []);

  return (
    <TransactionContext.Provider
      value={{ connectWallet, sendTransaction, handleChange, inputFormData }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
