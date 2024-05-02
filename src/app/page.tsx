"use client"
import React, { useState, useEffect } from "react";
import "../app/globals.css"

// Icons
import { FaBitcoin } from "react-icons/fa6";
import { CiSearch } from "react-icons/ci";
import { MdOutlineArrowDropUp } from "react-icons/md";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { FaRegTrashCan } from "react-icons/fa6";
import { MdDoneOutline } from "react-icons/md";
import { MdError } from "react-icons/md";

// External Components
import { toast } from "sonner"
import Stack from '@mui/material/Stack';
import LinearProgress from '@mui/material/LinearProgress';
import TooltipCustom from "./components/tooltip";

const MainApp = ({ setIsLoading }: any) => {

  // State
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [InitialValue, setInitialValue] = useState<any>();
  const [cryptoPrice, setCryptoPrice] = useState<any>();
  const [sellPrice, setSellPrice] = useState<any>()
  const [investFeePercentage, setInvestFeePercentage] = useState<any>();
  const [exitFeePercentage, setExitFeePercentage] = useState<any>();
  const [maxOutput, setMaxoutput] = useState<any>();
  const [totalProfit, setTotalProfit] = useState<any>();
  const [profitPercentage, setProfitPercentage] = useState<any>();
  const [isGain, setIsGain] = useState<boolean>(true)
  const [data, setData] = useState<any>()

  // Calculations
  function Calculate() {
    let amount = (InitialValue || 0) / ((cryptoPrice && data) || 0);
    let output = (amount * (sellPrice || 0)) * (1 - (investFeePercentage || 0) / 100) * (1 - (exitFeePercentage || 0) / 100);
    let profit = output - (InitialValue || 0);
    let profitPercentage = (profit / (InitialValue || 0)) * 100

    if (!cryptoPrice || !sellPrice) {
      setMaxoutput("");
      setProfitPercentage("");
      setTotalProfit("")
      setIsGain(true)
      return;
    }
    setProfitPercentage(profitPercentage);
    setTotalProfit(profit);
    setMaxoutput(output);

    if (output < (InitialValue || 0)) {
      setIsGain(false)
    } else if (output > (InitialValue || 0)) {
      setIsGain(true)
    } else {
      setIsGain(false)
    }
  }

  // Clear User Inputs
  function ClearInputs() {
    setSearchQuery("");
    setCryptoPrice("");
    setExitFeePercentage("");
    setInitialValue("");
    setInvestFeePercentage("");
    setIsGain(true)
    setMaxoutput("");
    setProfitPercentage("");
    setTotalProfit("")
    setSellPrice("")
    setData("")
  }

  // Execute Calculate Function While The Input Value Change
  useEffect(() => {
    Calculate();
  }, [InitialValue, cryptoPrice, sellPrice, investFeePercentage, exitFeePercentage])

  // Fetching The Buy Price From CoinGeko API
  function fetchData() {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${searchQuery}&vs_currencies=usd&supported_vs_currencies`;
    const options = {
      method: 'GET',
      headers: { accept: 'application/json', 'x-cg-demo-api-key': 'CG-2nAunhg98kHZ1zBYTPGRNx9j' }
    };
    // If The Search Input Is Empty then return nothing
    if (!searchQuery) {
      toast("Search Input Is Empty", {
        icon: <MdError className=" text-red-600" size={20} />,
        duration: 2500
      })
      return;
    } else {
      setIsLoading(true)
      fetch(url, options)
        .then(res => res.json())
        .then(datas => {
          const response = JSON.stringify(datas); // Assuming data is your JSON object
          // Define a regular expression to match the "usd" value
          const regex = /"usd":(\d+(\.\d+)?)/;

          // Use match to extract the usd value
          const match = response.match(regex);

          // If match is found, extract the value, otherwise, set it to undefined
          const usdValue = match ? Number(match[1]) : undefined;
          if (!usdValue) {
            setIsLoading(false)
            toast("Wrong Coin Name try another name", {
              icon: <MdError className=" text-red-600" size={20} />,
              duration: 2500
            })
          } else if (usdValue) {
            setIsLoading(false)
            setData(usdValue);
            setCryptoPrice(usdValue);
            toast("Coin Price Has been Added", {
              icon: <MdDoneOutline className=" text-green-500" size={15} />,
              duration: 2500
            })
          }
        })
        .catch(err => {
          setIsLoading(false)
          toast("Someting Went Wrong try later", {
            icon: <MdError className=" text-red-600" size={20} />,
            duration: 2500
          })
        });
    }
  }

  return (
    <div className=" w-full sm:w-[700px] flex flex-col py-4 px-5 gap-5 items-center justify-center">
      <span className=" flex items-center justify-start w-full pb-2 gap-3">
        <FaBitcoin size={45} className=" text-orange-500" />
        <h2 className=" text-sm sm:text-xl text-black font-bold">Crypto Profit Calculator APP</h2>
      </span>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
        <div className="flex h-24 flex-col gap-1 w-full">
          <div className="flex items-center justify-start gap-2">
            <p>Coin Name</p>
            <TooltipCustom title="You must Search only By Name not (BTC,ETH) only full name" />
          </div>
          <div className="flex gap-1  items-center w-full justify-between py-3 px-3 rounded-lg custom-border">
            <input value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value) }} className="custom-focus w-full" type="text" placeholder="Search Coin (Bitcoin,Ethereum).." />
            <span onClick={() => { fetchData() }} className="duration-300 bg-gray-200 sm:bg-transparent hover:bg-gray-200 rounded-full p-2 active:bg-gray-300">
              <CiSearch size={25} className=" duration-300  rounded-full cursor-pointer" />
            </span>
          </div>
        </div>
        <div className="flex h-24 flex-col gap-1">
          <p>Investment</p>
          <div className="flex gap-1 h-full items-center justify-center rounded-lg custom-border overflow-hidden">
            <span className=" h-full px-7 text-2xl w-4 bg-gray-100 flex items-center justify-center default-orange-color">
              $
            </span>
            <div className=" px-2 flex items-center w-full justify-between gap-1">
              <input value={InitialValue} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const newValue = parseFloat(e.target.value)
                setInitialValue(newValue);
              }} className="custom-focus w-full py-4" type="number" placeholder="0" />
            </div>
          </div>
        </div>
        <div className="flex h-24 flex-col gap-1">
          <p>Buy Price</p>
          <div className="flex gap-1 h-full items-center justify-center rounded-lg custom-border overflow-hidden">
            <span className=" h-full px-7 text-2xl w-4 bg-gray-100 flex items-center justify-center default-orange-color">
              $
            </span>
            <div className=" px-2 flex items-center w-full justify-between gap-1">
              <input value={data && cryptoPrice} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const newValue = parseFloat(e.target.value)
                setCryptoPrice(newValue);
                setData(newValue)
              }} className="custom-focus w-full py-4" type="number" placeholder="0" />
            </div>
          </div>
        </div>
        <div className="flex h-24 flex-col gap-1">
          <p>Sell Price</p>
          <div className="flex gap-1 h-full items-center justify-center rounded-lg custom-border overflow-hidden">
            <span className=" h-full px-7 text-2xl w-4 bg-gray-100 flex items-center justify-center default-orange-color">
              $
            </span>
            <div className=" px-2 flex items-center w-full justify-between gap-1">
              <input value={sellPrice} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const newValue = parseFloat(e.target.value)
                setSellPrice(newValue);
              }} className="custom-focus w-full py-4" type="number" placeholder="0" />
            </div>
          </div>
        </div>
        <div className="flex h-24 flex-col gap-1">
          <p>Exit Fee</p>
          <div className="flex gap-1 h-full items-center justify-center rounded-lg custom-border overflow-hidden">
            <span className=" h-full px-7 text-2xl w-4 bg-gray-100 flex items-center justify-center default-orange-color">
              %
            </span>
            <div className="px-2 flex items-center w-full justify-between gap-1">
              <input value={exitFeePercentage} minLength={1} maxLength={100} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const newValue = parseFloat(e.target.value)
                setExitFeePercentage(newValue);
              }} className="custom-focus w-full py-4" type="number" placeholder="0" />
            </div>
          </div>
        </div>
        <div className="flex h-24 flex-col gap-1">
          <p>Investment Fee</p>
          <div className="flex gap-1 h-full items-center justify-center rounded-lg custom-border overflow-hidden">
            <span className=" h-full px-7 text-2xl w-4 bg-gray-100 flex items-center justify-center default-orange-color">
              %
            </span>
            <div className=" px-2 flex items-center w-full justify-between gap-1">
              <input value={investFeePercentage}  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const newValue = parseFloat(e.target.value)
                setInvestFeePercentage(newValue);
              }} className="custom-focus w-full py-4" type="number" placeholder="0" />
            </div>
          </div>
        </div>
      </div>
      <div className=" w-full h-auto custom-border rounded-lg p-3 overflow-hidden">
        <div className="flex items-center justify-between">
          <h1 className="text-base sm:text-2xl font-bold">Investment Resault :</h1>
          <div onClick={() => { ClearInputs() }} className="flex items-center gap-1 cursor-pointer bg-orange-400 p-1 sm:p-2 rounded-lg">
            <FaRegTrashCan className="text-white" />
            <p className="text-white text-sm sm:text-base">Clear</p>
          </div>
        </div>
        <div className="py-5 flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <p className=" text-gray-500">Profit/Loss</p>
            <div className={isGain !== true ? "p-2 bg-red-200 w-min text-center rounded-lg flex items-center" : "p-2 bg-green-200 w-min text-center rounded-lg flex items-center"}>
              {isGain !== true ? <MdOutlineArrowDropDown className=" text-red-700 font-bold" /> : <MdOutlineArrowDropUp className=" text-green-700 font-bold" />}
              <span className="text-green-500 font-bold">{(Math.abs((totalProfit || 0)).toFixed(2)) || 0}$</span>
              <span className="text-red-500 font-bold">({((profitPercentage || 0).toFixed(2)) || 0}%)</span>
            </div>
          </div>
          <div className=" flex items-center justify-start w-full gap-7">
            <div className="flex flex-col gap-1">
              <p className=" text-gray-500">Investment Amount</p>
              <div className="p-2 bg-green-200 w-min text-center rounded-lg flex items-center">
                <span className="text-green-500 font-bold">{(InitialValue || 0).toLocaleString()}$</span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <h1 className=" text-gray-500">Total</h1>
              <div className="p-2 bg-green-200 w-min text-center rounded-lg flex items-center">
                <span className="text-green-500 font-bold">{(maxOutput || 0).toLocaleString()}$</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  // Checking Progress
  const [isLoading, setIsLoading] = useState<boolean>()
  return (
    <div className="w-full flex flex-col justify-center items-center">
      {isLoading && <Stack sx={{ width: '100%', color: 'grey.500' }} spacing={2}>
        <LinearProgress color="secondary" />
      </Stack>}
      <MainApp setIsLoading={setIsLoading} isLoading={isLoading} />
    </div>
  );
}
