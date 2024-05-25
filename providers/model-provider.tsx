"use client"

import { StoreModel } from "../components/model/store-model"
import {useEffect, useState} from "react"
import React from "react"

export const ModelProvider = () => {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if(!isMounted){
        return null
    }

    return(
        <>
         <StoreModel />
        </>
    )
}