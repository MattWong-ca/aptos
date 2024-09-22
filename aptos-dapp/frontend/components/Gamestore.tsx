import { useWallet } from '@aptos-labs/wallet-adapter-react';
import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { useQueryClient } from "@tanstack/react-query";
import { toast } from './ui/use-toast';
import { aptosClient } from '@/utils/aptosClient';
import { transferAPT } from '@/entry-functions/transferAPT';

interface GameItem {
    id: number;
    image: string;
    title: string;
    subtitle: string;
    price: number;
}

const gameItems: GameItem[] = [
    { id: 1, image: '/streakfreeze.webp', title: 'Streak Freeze', subtitle: 'Protect your streak with a 1-day freeze', price: 5 },
    { id: 2, image: '/ads.webp', title: 'Ad Removal', subtitle: 'Enjoy ad-free gaming for the next 30 days', price: 8 },
    { id: 3, image: '/double.webp', title: 'Double Points', subtitle: 'Get double points for the next 7 days', price: 10 }
];

const Gamestore: React.FC = () => {
    const { connected, account, signAndSubmitTransaction } = useWallet();
    const [transferAmount, setTransferAmount] = useState<number>();
    const queryClient = useQueryClient();

    const onClickButton = async (price: number) => {
        setTransferAmount(price);
        if (!account || !transferAmount) {
          return;
        }
    
        try {
          const committedTransaction = await signAndSubmitTransaction(
            transferAPT({
              to: "0x8ab10f7c9d5ffefd13e48a6ca3408cc82956b355434141b054461ba1222cb23f",
              // APT is 8 decimal places
              amount: Math.pow(10, 8) * transferAmount,
            }),
          );
          const executedTransaction = await aptosClient().waitForTransaction({
            transactionHash: committedTransaction.hash,
          });
          queryClient.invalidateQueries();
          toast({
            title: "Success",
            description: `Transaction succeeded, hash: ${executedTransaction.hash}`,
          });
    
        } catch (error) {
          console.error(error);
        }
      };

    return (
        <div className="flex items-center justify-center flex-col h-full mt-20">
            {connected ? (
                <Card style={{ width: '950px', height: '550px', padding: '28px', paddingLeft: '50px', paddingRight: '50px', paddingTop: '40px' }}>
                    <CardContent className="flex flex-col pt-4">
                        <div className="flex flex-col mb-6" >
                            <h1 className="text-3xl font-bold">Game Store</h1>
                            <h4 className="text-md font-medium" style={{ marginTop: '5px' }}>Buy in-game items like streak freezes, ad removal, & more!</h4>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            {gameItems.map((item) => (
                                <Card key={item.id} className="flex flex-col transition-all duration-300 ease-in-out  hover:scale-105 " style={{ height: '340px' }}>
                                    <img src={item.image} alt={item.title} className="h-42 object-cover mb-4 rounded-t-md"/>
                                    <div className="pl-4 pr-4">
                                    <h3 className="text-lg font-semibold">{item.title}</h3>
                                    <p className="text-sm text-gray-600 mb-2">{item.subtitle}</p>
                                    <p className="text-md font-bold mb-4">{item.price} APT</p>
                                    </div>
                                    <Button onClick={() => onClickButton(item.price)} value={item.price} className="mx-4">Purchase</Button>
                                </Card>
                            ))}
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

export default Gamestore;