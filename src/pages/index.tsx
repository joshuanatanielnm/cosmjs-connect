import { Inter } from "next/font/google";
import { useEffect } from "react";
import { getKeplrFromWindow } from "@/utils/getKeplrFromWindow";
import { SigningStargateClient } from "@cosmjs/stargate";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  useEffect(() => {
    init();
  }, []);
  const init = async () => {
    const keplr = await getKeplrFromWindow();
    const chainId = "cosmoshub-4";
    if (keplr) {
      try {
        await window.keplr.enable(chainId);
        const offlineSigner = window.keplr.getOfflineSigner(chainId);
        const accounts = await offlineSigner.getAccounts();
        const cosmJS = await SigningStargateClient.connectWithSigner(
          "https://cosmos-rpc.polkachu.com/",
          accounts[0].address,
          offlineSigner
        );
        console.log(cosmJS, "cosmJS");
      } catch (e) {
        if (e instanceof Error) {
          console.log(e.message);
        }
      }
    }
  };
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    ></main>
  );
}
