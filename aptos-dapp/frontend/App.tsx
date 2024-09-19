import { useWallet } from "@aptos-labs/wallet-adapter-react";
// Internal Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { TransferAPT } from "@/components/TransferAPT";

function App() {
  const { connected } = useWallet();

  return (
    <div className="h-screen overflow-hidden bg-cover bg-center bg-fixed" style={{backgroundImage: "url('quiztime.png')"}}>
      <Header />
      <div className="flex items-center justify-center flex-col h-full">
        {connected ? (
          <Card>
            <CardContent className="flex flex-col gap-10 pt-6">
              <TransferAPT />
            </CardContent>
          </Card>
        ) : (
          <CardHeader>
            <CardTitle>To get started Connect a wallet</CardTitle>
          </CardHeader>
        )}
      </div>
    </div>
  );
}

export default App;
