import { useWallet } from '@aptos-labs/wallet-adapter-react';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { TransferAPT } from './TransferAPT';

const Dashboard: React.FC = () => {
    const { connected } = useWallet();

    return (
        <div className="flex items-center justify-center flex-col h-full">
            gmgm
        </div>
    );
};

export default Dashboard;