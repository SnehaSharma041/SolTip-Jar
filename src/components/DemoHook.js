import { useState } from 'react';
import { useTipJar } from 'solana-tipjar';

const DemoHook = () => {
  const [solVal, setSolVal] = useState(0.02);
  const {
    phantomWalletExists,
    connectWallet,
    sendTransaction,
    transactionStatus,
    userWalletAddressLoaded,
    resetTipJar,
  } = useTipJar({ network: 'devnet' });

  if (!phantomWalletExists) {
    return (
      <div>
        <h2>Phantom wallet not found</h2>
        <a href="https://phantom.app/" target="_blank">
          Get here
        </a>
      </div>
    );
  }

  if (transactionStatus === 'confirmed') {
    return (
      <div>
        <h2>Success</h2>
        <button onClick={() => { setSolVal(0.02); resetTipJar(); }}>
          reset
        </button>
      </div>
    );
  }

  return (
    <div className="demohook-container">
      {!userWalletAddressLoaded && (
        <div>
          <button onClick={() => connectWallet()}>connect wallet</button>
        </div>
      )}
      {userWalletAddressLoaded && (
        <div>
          <input
            type="number"
            value={solVal}
            onChange={(e) => setSolVal(+e.target.value)}
          />
          <button
            className="demohook-tipbtn"
            onClick={() => {
              if (solVal > 0) {
                sendTransaction(solVal, 'C4rYug44LyJBcYQPgTBC7uy52rzWvoBo4tC1p2DvkNmj');
              }
            }}
          >
            Tip Me
          </button>
        </div>
      )}
    </div>
  );
};

export default DemoHook; 
