import { useWallet } from '@aptos-labs/wallet-adapter-react';
import React from 'react';
import { Card, CardContent } from './ui/card';

const leaderboardData = [
    { rank: 1, address: '0xe1c69a86eeacdc66e7badfd48b56013ee5f88ac69538a6f2609a53fe65895372', points: 500 },
    { rank: 2, address: '0x65a4136bf70a6a2acab0caefd9bfafe4e12c80b1be6d6d6abf9e69eafa88fafe', points: 200 },
    { rank: 3, address: '0xe8c9beade1a43be0b80eacd22a6f630ffdcaf8a17ffd750cd6e9f3a7fa6cd62f', points: 100 },
];

const Leaderboard: React.FC = () => {
    const { connected } = useWallet();

    return (
        <div className="flex items-center justify-center flex-col h-full mt-20">
            {connected ? (
                <Card style={{ width: '950px', height: '550px', padding: '28px', paddingLeft: '50px', paddingRight: '50px', paddingTop: '40px' }}>
                    <CardContent className="flex flex-col pt-4">
                        <div className="flex flex-col mb-6" >
                            <h1 className="text-2xl font-bold">Leaderboard</h1>
                            <h4 className="text-md font-medium" style={{ marginTop: '5px' }}>Weekly points leaders</h4>
                        </div>
                        <table className="w-full">
                            <thead>
                                <tr className="border-b-2 border-black">
                                    <th className="py-2 text-left font-bold">Rank</th>
                                    <th className="py-2 pl-8 text-left font-bold">Address</th>
                                    <th className="py-2 text-left font-bold">Points</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaderboardData.map((entry, index) => (
                                    <tr key={index} className="border-b border-gray-200">
                                        <td className="py-2 text-center">{entry.rank}</td>
                                        <td className="py-2 pl-8">{entry.address}</td>
                                        <td className="py-2 text-center">{entry.points}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
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

export default Leaderboard;