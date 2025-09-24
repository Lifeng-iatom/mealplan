"use client"
import { useUser } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type ApiResponse = {
    messege:string;
    error?:string;
}

async function createProfilRequest() {
    const response = await fetch('/api/create-profile',{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        }
    })

    const data = await response.json();
    return data as ApiResponse;
}

export default function CreateProfile(){
    const { isLoaded, isSignedIn } = useUser();
    const router = useRouter();
    const {mutate, isPending} = useMutation<ApiResponse, Error>({
        mutationFn:createProfilRequest,
        onSuccess:(data) => {
            console.log(data.messege);
            router.push("/subscribe");
        },
        onError:(error) => {
            console.log(error);
        },
    });

    useEffect(() => {
        if (isLoaded && isSignedIn && !isPending) {
          // Trigger the mutation to create the profile
          mutate();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [isLoaded, isSignedIn]);
    return <div>Processing sign in ....</div>
}