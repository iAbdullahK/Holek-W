import { NextResponse } from '../../../../../node_modules/next/server';
import { auth } from '@clerk/nextjs/server';
import { serverTimestamp, getDoc, doc, addDoc, collection, updateDoc, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '../../../../../lib/firebase';
import { Billboards } from '../../../../../types-db';


export const PATCH = async (req : Request,
    {params} : {params : {storeId : string, billboardId : string}}
    ) => {
        try {
        
            const { userId } = auth();
            const body = await req.json();
    
            if (!userId) {
                return new NextResponse("Un-Authorized!!", { status: 405 });
            }

            const { label, imageUrl } = body;
    
            if (!label) {
                return new NextResponse("Billboard name is missing!", { status: 400 });
            }

            if (!imageUrl) {
                return new NextResponse("Billboard image is missing!", { status: 401 });
            }

            if (!params.storeId) {
                return new NextResponse("Store ID is missing!", { status: 402 });
            }
            if (!params.billboardId) {
                return new NextResponse("billboard ID is missing!", { status: 402 });
            }

            const store = await getDoc(doc(db, "stores", params.storeId))

            if(store.exists()){
                let storeData = store.data()
                if(storeData?.userId !== userId) {
                    return new NextResponse("Un-Authorized Access!", {status: 500})
                }
            }

            const billboardRef = await getDoc(
                doc(db, "stores", params.storeId, "billboards", params.billboardId)
            )

            if(billboardRef.exists()){
                await updateDoc(
                    doc(db, "stores", params.storeId, "billboards", params.billboardId), {
                        ...billboardRef.data(),
                        label,
                        imageUrl,
                        updatedAt: serverTimestamp(),
                    }
                )
            }else{
                return new NextResponse("Billboard Not Found", {status : 400})
            }

            const billboard = (
                await getDoc(
                    doc(db, "stores", params.storeId, "billboards", params.billboardId)
                )
            ).data() as Billboards
            return NextResponse.json(billboard)
        } catch (error) {
            console.error(`Error processing PATCH request: ${error}`);
            return new NextResponse("Internal Server Error", { status: 500 });
        }
    };

    export const DELETE = async (req : Request,
        {params} : {params : {storeId : string, billboardId : string}}
        ) => {
            try {
            
                const { userId } = auth();
        
                if (!userId) {
                    return new NextResponse("Un-Authorized!!", { status: 405 });
                }

                if (!params.storeId) {
                    return new NextResponse("Store ID is missing!", { status: 402 });
                }
                if (!params.billboardId) {
                    return new NextResponse("billboard ID is missing!", { status: 402 });
                }
    
                const store = await getDoc(doc(db, "stores", params.storeId))
    
                if(store.exists()){
                    let storeData = store.data()
                    if(storeData?.userId !== userId) {
                        return new NextResponse("Un-Authorized Access!", {status: 500})
                    }
                }
    
                const billboardRef = await doc(db, "stores", params.storeId, "billboards", params.billboardId)
    
                await deleteDoc(billboardRef)

                
                return NextResponse.json({msg: "Billboard Deleted" });
            } catch (error) {
                console.error(`Error processing PATCH request: ${error}`);
                return new NextResponse("Internal Server Error", { status: 500 });
            }
        };
    