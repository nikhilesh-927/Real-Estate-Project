"use client";

import { Button } from "@/components/ui/button";
import { supabase } from "@/utils/supabase/client";
import { useUser } from "@clerk/nextjs";
import { Loader } from "lucide-react";
import dynamic from "next/dynamic";
import React, { useState } from "react";
import { toast } from "sonner";

// Dynamically import LocationSearch and disable SSR
const LocationSearch = dynamic(() => import("@/app/_components/LocationSearch"), {
  ssr: false,
});

function AddNewListing() {
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [coordinates, setCoordinates] = useState(null);
  const { user } = useUser();
  const [loader, setLoader] = useState(false);

  const nextHandler = async () => {
    setLoader(true);

    const { data, error } = await supabase
      .from("listing")
      .insert([
        {
          address: selectedAddress?.label,  // Use optional chaining
          coordinates: coordinates,
          createdBy: user?.primaryEmailAddress.emailAddress,
        },
      ])
      .select();

    if (data) {
      setLoader(false);
      toast("New Address added for listing");
    } else {
      setLoader(false);
      toast("Server side error");
    }
  };

  return (
    <div className="mt-10 px-4 md:px-10 lg:px-20">
      <div className="p-6 flex flex-col gap-5 items-center justify-center">
        <h2 className="text-xl md:text-2xl font-bold text-center">Add New Listing</h2>
        <div className="p-6 w-full max-w-lg rounded-lg border shadow-md flex flex-col gap-5 items-center">
          <h2 className="text-gray-500 text-center">Enter the address you want to list</h2>
          <LocationSearch
            selectedAddress={setSelectedAddress}
            setCoordinates={setCoordinates}
          />
      
          
          <Button
            className="w-full text-lg py-3"
            onClick={nextHandler}
            disabled={!selectedAddress || !coordinates || loader}
          >
            {loader ? <Loader className="animate-spin" /> : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AddNewListing;
