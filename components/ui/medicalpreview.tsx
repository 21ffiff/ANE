"use client";

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShoppingCart, Package } from "lucide-react"
import Link from "next/link"
// import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase"; // Import Supabase client

interface Products {
  id: string;
  name: string;
  category: string;
  compatibility: string;
  price: number;
  stock: string;
  description: string;
  link: string;
}

// const fetchProducts = async (): Promise<Products[]> => {
//   const res = await fetch("/api/products", {
//     method: "GET",
//     cache: "no-store"
//   });
//   if (!res.ok) throw new Error("Gagal fetch data api products");
//   return await res.json();
// };


const MedicalSparePartsPreview = () => {
  // const { data: initialProducts, isLoading, isError } = useQuery<Products[]>({
  //   queryKey: ["products"],
  //   queryFn: fetchProducts,
  //   refetchOnWindowFocus: false, // Refetch when the window regains focus
  //   refetchOnMount: false,
  // });

  const [products, setProducts] = useState<Products[]>([]);

  // Fetch data awal dari Supabase
  useEffect(() => {
    const fetchInitialData = async () => {
      const { data, error } = await supabase.from("Products").select("*");
      if (error) {
        console.error("Error fetching initial data:", error);
        return;
      }
      setProducts(data || []);
    };

    fetchInitialData();
  }, []);

  // Listener untuk perubahan data di tabel Products
  useEffect(() => {
    const channel = supabase
      .channel("realtime:products")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "Products" },
        (payload) => {
          console.log("Change received!", payload);
          if (payload.eventType === "INSERT") {
            setProducts((prev) => [payload.new as Products, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setProducts((prev) =>
              prev.map((product) =>
                product.id === payload.new.id ? (payload.new as Products) : product
              )
            );
          } else if (payload.eventType === "DELETE") {
            setProducts((prev) =>
              prev.filter((product) => product.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (!products || products.length === 0) return <p>Produk tidak tersedia.</p>;

  return (
    <div className="container mx-auto px-4 py-6 ">
      <h1 className="text-2xl font-bold mb-4 text-center">Medical Equipment Spare Parts</h1>
      <p className="text-lg mb-6 text-justify">
      Telusuri pilihan suku cadang berkualitas tinggi kami untuk berbagai peralatan medis. 
      Semua suku cadang adalah komponen OEM asli atau setara yang disetujui, pastikan kompatibilitas dan kinerja dengan <span> &quot;</span> 
      <Link 
      className="text-blue-600 hover:text-purple-600 h-[2px] w-0 group-hover:w-full transition-all relative cursor-pointer ease-in-out before:transition-[width] before:ease-in-out before:duration-300 before:absolute before:bg-black before:origin-center before:h-[2px] before:w-0 hover:before:w-[50%] before:bottom-0 before:left-[50%] after:transition-[width] after:ease-in-out after:duration-300 after:absolute after:bg-black after:origin-center after:h-[2px] after:w-0 hover:after:w-[50%] after:bottom-0 after:right-[50%]" 
      href="/#contact">
        Contact Us
      </Link>
      <span>&quot;.</span>
      </p>

      <Tabs defaultValue="all" className="mb-6">
        <div className="flex mb-4">
          <TabsList className="w-full sm:max-w-sm md:max-w-lg lg:max-w-lg px-2"/* overflow-auto */>
            <TabsTrigger value="all">All Parts </TabsTrigger>
            <TabsTrigger value="imaging">Imaging</TabsTrigger>
            <TabsTrigger value="emergency">Emergency</TabsTrigger>
            <TabsTrigger value="respiratory">Respiratory</TabsTrigger>
            <TabsTrigger value="life support">life support</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="all">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
            {products?.length > 0 ? (
              products.map((product:Products) => (
                <SparePartCard key={product.id} product={product} />
              ))
            ) : (
              <p>no products detect</p>
            )}
            
          </div>
        </TabsContent>

        <TabsContent value="imaging">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.filter(product => product.category === "Imaging Equipment").map((product) => (
              <SparePartCard key={product.id} product={product} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="emergency">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.filter(product => product.category === "Emergency Equipment").map((product) => (
              <SparePartCard key={product.id} product={product} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="respiratory">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.filter(product => product.category === "Respiratory Equipment").map((product) => (
              <SparePartCard key={product.id} product={product} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="life support">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.filter(product => product.category === "Life Support").map((product) => (
              <SparePartCard key={product.id} product={product} />
            ))}
          </div>
        </TabsContent>

      </Tabs>
    </div>
  )
}

const SparePartCard = ({ product }:{ product: Products}) => {
  return (
    <Card className="p-4">
      <CardHeader>
        <CardTitle className="text-lg">{product.name}</CardTitle>
        <CardDescription className="text-sm text-gray-500">{product.category}</CardDescription>
      </CardHeader>
      <CardContent>
        <Badge variant="secondary" className="mb-2">
          {product.compatibility}
        </Badge>
        <p className="text-sm mb-4">{product.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold">Rp {product.price.toFixed(2)}</span>
          <span className="text-xs text-gray-500">
            <Package className="inline mr-1 h-4 w-4" />
            {product.stock} in stock
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" className="text-sm">
          {/* <Tool className="mr-2 h-4 w-4" /> */}
          Details
        </Button>
        <Link href={`https://wa.me/+6282256692390?text=Halo salam kenal, saya ingin membeli product ${product.name}. Tolong beri tahu saya mengenai kelengkapan produk tersebut`}>
          <Button>
            <ShoppingCart className="mr-2 h-4 w-4"/>
            Buy by WA
          </Button>
        </Link>
        
      </CardFooter>
    </Card>
  )
}

export default MedicalSparePartsPreview;
