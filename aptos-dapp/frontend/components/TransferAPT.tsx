import { useEffect, useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
// Internal components
import { toast } from "@/components/ui/use-toast";
import { aptosClient } from "@/utils/aptosClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAccountAPTBalance } from "@/view-functions/getAccountBalance";
import { transferAPT } from "@/entry-functions/transferAPT";

export function TransferAPT() {
  const { account, signAndSubmitTransaction } = useWallet();
  const queryClient = useQueryClient();

  const [aptBalance, setAptBalance] = useState<number>(0);
  const [friendUsername, setFriendUsername] = useState<string>();
  const [transferAmount, setTransferAmount] = useState<number>();

  const { data } = useQuery({
    queryKey: ["apt-balance", account?.address],
    refetchInterval: 10_000,
    queryFn: async () => {
      try {
        if (account === null) {
          console.error("Account not available");
        }

        const balance = await getAccountAPTBalance({ accountAddress: account!.address });

        return {
          balance,
        };
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error,
        });
        return {
          balance: 0,
        };
      }
    },
  });

  const onClickButton = async () => {
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

      // Neynar bot
      // use friendUsername
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (data) {
      setAptBalance(data.balance);
    }
  }, [data]);

  return (
    <div className="flex flex-col gap-6" style={{ width: '80%' }}>
      <h1 className="text-3xl font-bold mt-8">Challenge a Friend!</h1>
      <h4 className="text-md font-medium" style={{ marginTop: '-18px' }}>Think you'll have more points then a friend? Challenge them!</h4>

      <h4 className="text-md font-medium" style={{ marginTop: '0px' }}>Your APT balance: {(aptBalance / Math.pow(10, 8)).toFixed(2)}</h4>
      <h4 className="text-md font-medium" style={{ marginTop: '2px' }}>Who are you challenging?</h4> 
      <Input style={{ marginTop: '-18px' }} disabled={!account} placeholder="0xMatt" onChange={(e) => setFriendUsername(e.target.value)} />
      <h4 className="text-md font-medium" style={{ marginTop: '1px' }}>How much?</h4> 

      <Input  style={{ marginTop: '-18px' }} disabled={!account} placeholder="100" onChange={(e) => setTransferAmount(parseFloat(e.target.value))} />
      <Button
        style={{ marginTop: '18px' }}
        disabled={!account || !transferAmount || transferAmount > aptBalance || transferAmount <= 0}
        onClick={onClickButton}
      >
        Challenge
      </Button>
    </div>
  );
}
