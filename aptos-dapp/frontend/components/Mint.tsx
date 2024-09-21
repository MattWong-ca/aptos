import { useWallet } from '@aptos-labs/wallet-adapter-react';
import React, { FormEvent, useState } from 'react';
import { Card, CardContent } from './ui/card';
import { useGetCollectionData } from '@/hooks/useGetCollectionData';
import { aptosClient } from "@/utils/aptosClient";
import { useQueryClient } from '@tanstack/react-query';
import { InputTransactionData } from "@aptos-labs/wallet-adapter-react";
import { MODULE_MINT_ADDRESS } from "@/constants";

const Mint: React.FC = () => {
    const [nftCount, setNftCount] = useState(1);
    const queryClient = useQueryClient();
    const { connected, account, signAndSubmitTransaction } = useWallet();
    const { data } = useGetCollectionData();
    const { userMintBalance = 0, collection, totalMinted = 0, maxSupply = 1 } = data ?? {};
    console.log("userMintBalance", userMintBalance);
    console.log("collection", collection);
    console.log("totalMinted", totalMinted);
    console.log("maxSupply", maxSupply);

    const mintNft = async (e: FormEvent) => {
        e.preventDefault();
        if (!account || !data?.isMintActive) return;
        if (!collection?.collection_id) return;

        const response = await signAndSubmitTransaction(
            mintNFT({ collectionId: collection.collection_id, amount: nftCount }),
        );
        await aptosClient().waitForTransaction({ transactionHash: response.hash });
        queryClient.invalidateQueries();
        setNftCount(1);
    };

    return (
        <div className="flex items-center justify-center flex-col h-full mt-20">
            {connected ? (
                <Card style={{ width: '950px', height: '550px', padding: '28px', paddingLeft: '50px', paddingRight: '50px', paddingTop: '40px' }}>
                    <CardContent className="flex flex-col pt-4">
                        <div className="flex flex-col" >
                            <h1 className="text-2xl font-bold">Mint</h1>

                            <h4 className="text-md font-medium" style={{ marginTop: '5px' }}>A digital collection of your streaks, milestones, and in-game purchases!</h4>

                            <button onClick={mintNft}>Mint NFT</button>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Card style={{ width: '950px', height: '550px', padding: '28px', paddingLeft: '50px', paddingRight: '50px', paddingTop: '40px' }}>
                    <CardContent className="flex flex-col pt-4">
                        <div className="flex flex-col" >
                            <h1 className="text-2xl font-bold">To get started, connect a wallet!</h1>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default Mint;

type MintNftArguments = {
    collectionId: string;
    amount: number;
};

const mintNFT = (args: MintNftArguments): InputTransactionData => {
    const { collectionId, amount } = args;
    return {
        data: {
            function: `${MODULE_MINT_ADDRESS}::launchpad::mint_nft`,
            typeArguments: [],
            functionArguments: [collectionId, amount],
        },
    };
};