"use client"
import React, { useState, useEffect } from "react";
import "../app/globals.css"

import { FaBitcoin } from "react-icons/fa6";
import { CiSearch } from "react-icons/ci";
import { MdOutlineArrowDropUp } from "react-icons/md";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { FaRegTrashCan } from "react-icons/fa6";

const MainApp = () => {

  // State
  const [search, setSearch] = useState<string>("");
  const [InitialValue, setInitialValue] = useState<any>();
  const [cryptoPrice, setCryptoPrice] = useState<any>();
  const [sellPrice, setSellPrice] = useState<any>()
  const [investFeePercentage, setInvestFeePercentage] = useState<any>();
  const [exitFeePercentage, setExitFeePercentage] = useState<any>();
  const [maxOutput, setMaxoutput] = useState<any>();
  const [totalProfit, setTotalProfit] = useState<any>();
  const [profitPercentage, setProfitPercentage] = useState<any>();
  const [isGain, setIsGain] = useState<boolean>(true)

  // Calculations
  function Calculate() {
    let amount = (InitialValue || 0) / (cryptoPrice || 0);
    let output = (amount * (sellPrice || 0)) * (1 - (investFeePercentage || 0) / 100) * (1 - (exitFeePercentage || 0) / 100);
    let profit = output - (InitialValue || 0);
    let profitPercentage = (profit / (InitialValue || 0)) * 100;
    setProfitPercentage(profitPercentage);
    setTotalProfit(profit);
    setMaxoutput(output);
    if (output < (InitialValue || 0)) {
      setIsGain(false)
    } else if (output > (InitialValue || 0)) {
      setIsGain(true)
    }
  }

  function ClearInputs() {
    setSearch("");
    setCryptoPrice("");
    setExitFeePercentage("");
    setInitialValue("");
    setInvestFeePercentage("");
    setIsGain(true)
    setMaxoutput("");
    setProfitPercentage("");
    setSellPrice("")
    setTotalProfit("")
  }

  useEffect(() => {
    Calculate();
  }, [InitialValue, cryptoPrice, sellPrice, investFeePercentage, exitFeePercentage])

  return (
    <div className=" w-full sm:w-[700px] flex flex-col py-4 px-5 gap-5 items-center justify-center">
      <span className=" flex items-center justify-start w-full pb-2 gap-3">
        <FaBitcoin size={45} className=" text-orange-500" />
        <h2 className=" text-sm sm:text-xl text-black font-bold">Crypto Profit Calculator APP</h2>
      </span>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
        <div className="flex h-24 flex-col gap-1 w-full">
          <p>Coin</p>
          <div className="flex gap-1  items-center w-full justify-between py-3 px-3 rounded-lg custom-border">
            <input value={search} onChange={(e) => { setSearch(e.target.value) }} className="custom-focus w-full" type="text" placeholder="Search Coin" />
            <span className="duration-300 bg-gray-200 sm:bg-transparent hover:bg-gray-200 rounded-full p-2 active:bg-gray-300">
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
              <input value={cryptoPrice} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const newValue = parseFloat(e.target.value)
                setCryptoPrice(newValue);
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
              <input value={exitFeePercentage} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
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
              <input value={investFeePercentage} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const newValue = parseFloat(e.target.value)
                setInvestFeePercentage(newValue);
              }} className="custom-focus w-full py-4" type="number" placeholder="0" />
            </div>
          </div>
        </div>
      </div>
      <div className=" w-full h-auto custom-border rounded-lg p-3">
        <div className="flex items-center justify-between">
          <h1 className="text-base sm:text-2xl font-bold">Investment Resault :</h1>
          <div onClick={() => {ClearInputs()}} className="flex items-center gap-1 cursor-pointer bg-orange-400 p-1 sm:p-2 rounded-lg">
            <FaRegTrashCan className="text-white" />
            <p className="text-white text-sm sm:text-base">Clear</p>
          </div>
        </div>
        <div className="py-5 flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <p className=" text-gray-500">Profit/Loss</p>
            <div className={isGain !== true ? "p-2 bg-red-200 w-min text-center rounded-lg flex items-center" : "p-2 bg-green-200 w-min text-center rounded-lg flex items-center"}>
              {isGain !== true ? <MdOutlineArrowDropDown className=" text-red-700 font-bold" /> : <MdOutlineArrowDropUp className=" text-green-700 font-bold" />}
              <span className="text-green-500 font-bold"> {(Math.abs((totalProfit || 0)).toFixed(2)) || 0}$</span>
              <span className="text-red-500 font-bold"> ({((profitPercentage || 0).toFixed(2)) || 0}%)</span>
            </div>
          </div>
          <div className=" flex items-center justify-start w-full gap-7">
            <div className="flex flex-col gap-1">
              <p className=" text-gray-500">Investment Amount</p>
              <div className="p-2 bg-green-200 w-min text-center rounded-lg flex items-center">
                <span className="text-green-500 font-bold"> {(InitialValue || 0).toLocaleString()}$</span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <h1 className=" text-gray-500">Total</h1>
              <div className="p-2 bg-green-200 w-min text-center rounded-lg flex items-center">
                <span className="text-green-500 font-bold"> {(maxOutput || 0).toLocaleString()}$</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <div className="w-full flex flex-col justify-center items-center">
      <MainApp />
    </div>
  );
}
