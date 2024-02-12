import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import { getKeplrFromWindow } from "@/utils/getKeplrFromWindow";
import { Coin, SigningStargateClient } from "@cosmjs/stargate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cosmoshub } from "graz/chains";
import { SendTokensArgs } from "graz";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [balance, setBalance] = useState<Coin>({
    amount: "",
    denom: "",
  });
  const [address, setAddress] = useState<string>("");
  const { toast } = useToast();
  useEffect(() => {
    init();
  }, []);
  const [recipientAddress, setRecipientAddress] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const isSendDisabled = !recipientAddress || !amount;

  const init = async () => {
    const keplr = await getKeplrFromWindow();
    const chainId = cosmoshub.chainId;
    if (keplr) {
      try {
        await window.keplr.enable(chainId);
        const offlineSigner = window.keplr.getOfflineSigner(chainId);
        const accounts = await offlineSigner.getAccounts();
        const client = await SigningStargateClient.connectWithSigner(
          "https://cosmos-rpc.polkachu.com/",
          accounts[0].address,
          offlineSigner
        );
        const key = await window.keplr?.getKey(cosmoshub.chainId);
        setAddress(key.bech32Address);

        const balance = await client.getBalance(
          key.bech32Address,
          cosmoshub.currencies[0].coinMinimalDenom
        );
        setBalance(balance);

        return client;
      } catch (e) {
        if (e instanceof Error) {
          console.log(e.message);
        }
      }
    }
  };

  const getAddress = async () => {
    const key = await window.keplr?.getKey(cosmoshub.chainId);
    setAddress(key.bech32Address);

    return key;
  };
  const getBalance = async () => {
    const key = await getAddress();
    const client = await init();
    if (client) {
      const balance = await client.getBalance(
        key.bech32Address,
        cosmoshub.currencies[0].coinMinimalDenom
      );
      setBalance(balance);
    }
  };

  const sendBalance = async ({
    senderAddress,
    recipientAddress,
    amount,
    fee,
    memo,
  }: SendTokensArgs) => {
    setIsLoading(true);
    const offlineSigner = window.keplr.getOfflineSigner(cosmoshub.chainId);
    const client = await SigningStargateClient.connectWithSigner(
      "https://cosmos-rpc.polkachu.com/",
      offlineSigner
    );
    await client
      ?.sendTokens(senderAddress ?? "", recipientAddress, amount, fee, memo)
      .then((res) => {
        console.log(res, "errror disiniiii");
        setRecipientAddress("");
        setAmount("");
        toast({
          title: "Transaction Success",
          description: (
            <p>
              Check the transaction detail{" "}
              <a
                href={`https://www.mintscan.io/cosmos/tx/${res.transactionHash}`}
                className="text-blue-400"
                target="_blank"
              >
                here
              </a>
            </p>
          ),
        });
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err.message);
        toast({
          title: "Transaction Failed",
          description: err.message,
        });
        setRecipientAddress("");
        setAmount("");
        setIsLoading(false);
      });
  };
  // cosmos1ctplzcwavjk6a5srz7cd8n3xh9lu2ztv7svzzc

  return (
    <main
      className={`flex min-h-screen flex-col items-center p-12 ${inter.className} gap-10`}
    >
      <h1 className="text-4xl font-bold">cosmjs connect</h1>
      <div>
        <div className="flex flex-row gap-10">
          <div className="flex flex-col gap-4">
            <h3>account address</h3>
            <Input disabled value={address} />
            <Button onClick={getAddress} variant="secondary">
              Get cosmoshub address
            </Button>
          </div>
          <div className="flex flex-col gap-4">
            <h3>{balance.denom} amount</h3>
            <Input disabled value={balance.amount} />
            <Button onClick={getBalance} variant="secondary">
              Get amount
            </Button>
          </div>
        </div>
        <div className="flex flex-col pt-12">
          <h3 className="text-2xl font-semibold pb-6">Send {balance.denom}</h3>
          <div className="flex flex-col gap-4">
            <h3>senderAddress</h3>
            <Input disabled value={address} />
            <h3>recipientAddress</h3>
            <Input
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
            />
            <h3>amount {balance.denom}</h3>
            <Input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              type="number"
            />
            <Button
              disabled={isLoading || isSendDisabled}
              onClick={() =>
                sendBalance({
                  senderAddress: address,
                  amount: [
                    {
                      amount,
                      denom: "uatom",
                    },
                  ],
                  fee: {
                    gas: "1000000",
                    amount: [
                      {
                        amount: "1000000",
                        denom: "uatom",
                      },
                    ],
                  },
                  recipientAddress,
                })
              }
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
