import { useWallet } from '@aptos-labs/wallet-adapter-react';
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from './ui/card';
import { aptosClient } from '@/utils/aptosClient';

const Dashboard: React.FC = () => {
    const { connected } = useWallet();

    const [imageUrls, setImageUrls] = useState<string[]>([]);

    const fetchNFTs = async () => {
        try {
            const client = await aptosClient().getAccountOwnedTokens({
                accountAddress: "0xe1c69a86eeacdc66e7badfd48b56013ee5f88ac69538a6f2609a53fe65895372"
            });
            console.log(client);

            const urls = await Promise.all(client.map(async (token) => {
                console.log("URI", token.current_token_data?.token_uri);
                if (token.current_token_data?.token_uri) {
                    const jsonUrl = token.current_token_data.token_uri;
                    const response = await fetch(jsonUrl);
                    if (response.ok) {
                        const jsonData = await response.json();

                        return jsonData.image;
                    } else {
                        return "";
                    }
                }
                return null;
            }));

            setImageUrls(urls.filter(url => url !== null));
        } catch (error) {
            console.error("Error fetching token data:", error);
        }
    };

    useEffect(() => {
        fetchNFTs();
    }, []);

    return (
        <div className="flex items-center justify-center flex-col h-full mt-20">
            {connected ? (
                <Card style={{ width: '950px', height: '550px', padding: '28px', paddingLeft: '50px', paddingRight: '50px', paddingTop: '40px' }}>
                    <CardContent className="flex flex-col pt-4">
                        <div className="flex flex-col" >
                            <h1 className="text-3xl font-bold">My NFTs</h1>

                            <h4 className="text-md font-medium" style={{ marginTop: '5px' }}>A digital collection of your streaks, milestones, and in-game purchases!</h4>
                            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: '20px' }}>
                                {imageUrls.map((url, index) => (
                                    <div key={index} style={{ width: '190px', height: '190px' }} className="transition-all duration-300 ease-in-out hover:scale-105 "
                                    >
                                        <img
                                            src={url}
                                            alt={`Token ${index}`}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                borderRadius: '10px',
                                                border: '1px solid black'
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
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

export default Dashboard;