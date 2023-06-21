import { EthAmount } from "components/UI/EthAmount";
import { EthLogo } from "components/UI/EthLogo";
import Wallet from "components/layout/Navbar/Wallet";
import { useGameContext } from "contexts/GameContext";
import { formatEther } from "ethers/lib/utils";
import { DefifaGamePhase } from "hooks/read/useCurrentGamePhase";
import { usePaymentTerminalBalance } from "hooks/read/usePaymentTerminalBalance";

function GameStats() {
  const {
    nfts: { totalSupply },
    currentPhase,
  } = useGameContext();
  const { gameId } = useGameContext();
  const { data: treasuryAmount, isLoading: isTerminalLoading } =
    usePaymentTerminalBalance(gameId);

  const mintText = totalSupply?.toNumber() === 1 ? "mint" : "mints";

  if (isTerminalLoading || !totalSupply)
    return <div className="text-center">...</div>;

  if (currentPhase === DefifaGamePhase.COUNTDOWN) return null;

  return (
    <div className="flex gap-6 items-center">
      <div className="border-4 border-lime-600 border-dotted rounded-2xl px-4 py-3">
        <div className="font-medium flex items-baseline gap-3 text-lime-400">
          {treasuryAmount ? (
            <EthAmount
              amountWei={treasuryAmount}
              className="text-4xl leading-none"
              iconClassName="h-7 w-7"
            />
          ) : null}
          <span className="uppercase text-xs leading-none">in pot</span>
        </div>
      </div>
      {/* <div className="flex gap-1 flex-col items-end">
        <span className="uppercase text-sm">Mints</span>
        <span className="font-medium flex items-center gap-1 text-2xl">
          {totalSupply?.toNumber()}
        </span>
      </div> */}
      {/* <div>
        <span className="font-bold">6</span> players
      </div> */}
    </div>
  );
}

export function Header() {
  const {
    metadata,
    loading: { metadataLoading },
  } = useGameContext();

  if (metadataLoading) return <div className="text-center">...</div>;

  return (
    <header className="flex justify-between items-center pt-4 pb-2 flex-wrap gap-6">
      <div className="flex gap-6 items-center">
        <div className="text-5xl border border-gray-900 p-4 rounded-lg bg-gray-950 font-sans">
          🕹️
        </div>
        <div>
          <h1 className="text-2xl font-medium mb-3 [text-shadow:_0_5px_20px_rgb(250_250_250_/_10%)] max-w-prose">
            {metadata?.name}
          </h1>
          <div className="text-sm text-neutral-300 mt-2 max-w-3xl hidden md:block">
            {metadata?.description}
          </div>
        </div>
      </div>

      <GameStats />
    </header>
  );
}
