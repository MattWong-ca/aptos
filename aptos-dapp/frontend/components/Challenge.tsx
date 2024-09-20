import { useWallet } from '@aptos-labs/wallet-adapter-react';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { TransferAPT } from './TransferAPT';

const Challenge: React.FC = () => {
    const { connected } = useWallet();

    return (
        <div className="flex items-center justify-center flex-col h-full mt-20">
            {connected ? (
                <Card style={{ width: '500px', height: '550px' }}>
                    <CardContent className="flex flex-col gap-10 pt-6 items-center">
                        <TransferAPT />
                    </CardContent>
                </Card>
            ) : (
                <CardHeader>
                    <CardTitle>To get started Connect a wallet</CardTitle>
                </CardHeader>
            )}
        </div>
    );
};

export default Challenge;