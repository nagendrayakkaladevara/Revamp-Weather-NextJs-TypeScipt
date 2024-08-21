"use client";
import React, { useState } from "react";
import { MultiStepLoader as Loader } from "../components/multi-step-loader";
import { IconSquareRoundedX } from "@tabler/icons-react";



export function MultiStepLoaderDemo({ loading, handleButtonClick, selectedCity }: any) {
    
    const loadingStates = [
        {
            text: "Getting your current location from your device.",
        },
        {
            text: "Fetched latitude and longitude coordinates.",
        },
        {
            text: "Coordinates are passed to the GoogleMaps API to retrieve city",
        },
        {
            text: `Obtaining the current weather information ${selectedCity}.`,
        },
        {
            text: "Done",
        },
        // {
        //     text: "Start a fight",
        // },
        // {
        //     text: "We like it",
        // },
        // {
        //     text: "Welcome to F**** C***",
        // },
    ];

    return (
        <div className="w-full h-[20vh] flex items-center justify-center">

            <Loader loadingStates={loadingStates} loading={loading} duration={2000} />

            <button
                onClick={handleButtonClick}
                className="bg-[#39C3EF] hover:bg-[#39C3EF]/90 text-black mx-auto text-sm md:text-base transition font-medium duration-200 h-10 rounded-lg px-8 flex items-center justify-center"
                style={{
                    boxShadow:
                        "0px -1px 0px 0px #ffffff40 inset, 0px 1px 0px 0px #ffffff40 inset",
                }}
            >
                Get Weather
            </button>

            {/* {loading && (
                <button
                    className="fixed top-4 right-4 text-black dark:text-white z-[120]"
                    onClick={handleLoaderStart}
                >
                    <IconSquareRoundedX className="h-10 w-10" />
                </button>
            )} */}
        </div>
    );
}
