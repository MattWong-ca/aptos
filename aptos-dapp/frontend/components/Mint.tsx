import { useWallet } from '@aptos-labs/wallet-adapter-react';
import React, { FormEvent, useState } from 'react';
import { Card, CardContent } from './ui/card';
import { useGetCollectionData } from '@/hooks/useGetCollectionData';
import { aptosClient } from "@/utils/aptosClient";
import { useQueryClient } from '@tanstack/react-query';
import { InputTransactionData } from "@aptos-labs/wallet-adapter-react";
import { MODULE_MINT_ADDRESS } from "@/constants";
import HoverCard from './HoverCard';
import { Button } from './ui/button';

const Mint: React.FC = () => {
    const [nftCount, setNftCount] = useState(1);
    const [minted, setMinted] = useState(false);
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
        const confirmed = await aptosClient().waitForTransaction({ transactionHash: response.hash });
        setMinted(confirmed.success);
        queryClient.invalidateQueries();
        setNftCount(1);
    };

    return (
        <div className="flex items-center justify-center flex-col h-full mt-10">
            {connected ? (
                <Card style={{ width: '500px', height: '620px', padding: '28px', paddingLeft: '50px', paddingRight: '50px', paddingTop: '40px' }}>
                    <CardContent className="flex flex-col pt-4">
                        <div className="flex flex-col" >
                            <h1 className="text-3xl font-bold mb-6">Mint your NFT!</h1>

                            <div className="flex flex-col justify-center items-center">
                            <div style={{width: '100%' }}>
                                <HoverCard/>
                            </div>
                            {minted ? <Button disabled style={{ width: '100%' }} className="mx-4 mt-8">Minted</Button> : <Button onClick={mintNft} style={{ width: '100%' }} className="mx-4 mt-8">Mint</Button>}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Card style={{ width: '500px', height: '550px', padding: '28px', paddingLeft: '50px', paddingRight: '50px', paddingTop: '40px' }}>
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