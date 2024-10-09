import { FC, ReactNode } from 'react';
import { useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl, Connection } from '@solana/web3.js';
require('@solana/wallet-adapter-react-ui/styles.css');

const WalletContextProvider = ({ children }: { children: ReactNode }) => {
  const endpoint = useMemo(() => clusterApiUrl('devnet'), []);

  const wallets = useMemo(() => [], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default WalletContextProvider; 
