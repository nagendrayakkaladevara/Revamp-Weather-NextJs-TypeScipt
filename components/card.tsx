"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../utlis/utils";
import { DirectionAwareHover } from "../components/direction-aware-hover";
import { ExpandableCardDemo } from "./MoredeatilsPopUp";

export function DirectionAwareHoverDemo({ data }: any) {

    function kelvinToCelsius(kelvin: number | string, decimalPlaces: number = 2): string {

        const kelvinValue = typeof kelvin === 'string' ? parseFloat(kelvin) : kelvin;

        if (isNaN(kelvinValue)) {
            console.error('Invalid input: Kelvin value must be a number');
        }

        const celsiusValue = kelvinValue - 273.15;

        return celsiusValue.toFixed(decimalPlaces);
    }

    console.log("🚀 ~ DirectionAwareHoverDemo ~ data:", data)
    const imageUrl =
        "https://images.unsplash.com/photo-1663765970236-f2acfde22237?q=80&w=3542&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

    return (
        <div className="h-[40rem] relative  flex items-center justify-center">
            <DirectionAwareHover imageUrl={imageUrl}>
                <p className="font-bold text-xl">{data?.name}</p>
                <p className="font-normal text-sm">{kelvinToCelsius(data?.main?.temp)}°C | {data?.weather[0]?.main}</p>
            </DirectionAwareHover>
            {/* <ExpandableCardDemo /> */}
        </div>
    );
}
