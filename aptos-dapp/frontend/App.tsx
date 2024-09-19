import { useState } from 'react';
import { useWallet } from "@aptos-labs/wallet-adapter-react";
// Internal Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TransferAPT } from "@/components/TransferAPT";
import Navbar from "@/components/Navbar"; // New import

function App() {
  const { connected } = useWallet();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="h-screen overflow-hidden bg-cover bg-center bg-fixed" style={{backgroundImage: "url('/path/to/your/image.jpg')"}}>
      <Navbar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="pt-16"> {/* Add padding-top to account for fixed navbar */}
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
    </div>
  );
}

export default App;
