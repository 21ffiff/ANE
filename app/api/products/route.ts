//import prisma from "@/lib/prisma";
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
    try{
        const {data, error} = await supabase
        .from("Products")
        .select("*");
        
        if (error) throw error;

        return NextResponse.json(data, {
            headers: {
                "Cache-Control": "no-store", 
            },
        });
    }catch (error: unknown){
        const errorMessage = error instanceof Error ? error.message: "An unknown Error occured";
        return NextResponse.json(
            {error: errorMessage}, 
            {
                status:500,
                headers: {
                    "Cache-Control": "no-store"
                }
            }
        );
    }

}

// API menggunakan prisma:
// export async function GET() {
//     try {
//         const products = await prisma.products.findMany();
//         return NextResponse.json(products);
//     } catch (error: unknown) {
//         const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
//         return NextResponse.json({ error: errorMessage }, { status: 500 });
//     }
// }
