import { DefifaGamePhase } from "components/Navbar/Info/CurrentPhase/useCurrentGamePhase";
import { useGameContext } from "contexts/GameContext";
import { MintPhaseContent } from "./MintPhaseContent";
import { RefundPhaseContent } from "./RefundPhaseContent";
import { CountdownPhaseContent } from "./CountdownPhaseContent";

const PHASE_CONTENT: { [k in DefifaGamePhase]: () => JSX.Element } = {
  [DefifaGamePhase.COUNTDOWN]: CountdownPhaseContent,
  [DefifaGamePhase.MINT]: MintPhaseContent,
  [DefifaGamePhase.REFUND]: RefundPhaseContent,
  [DefifaGamePhase.SCORING]: () => <span>scoring</span>,
  [DefifaGamePhase.NO_CONTEST]: () => <span>no contest</span>,
  [DefifaGamePhase.NO_CONTEST_INEVITABLE]: () => (
    <span>no contest inevitable</span>
  ),
};

export function PlayContent() {
  const {
    currentPhase,
    loading: { currentPhaseLoading },
  } = useGameContext();

  if (currentPhaseLoading) return <div>...</div>;

  const CurrentContent = PHASE_CONTENT[currentPhase];

  return (
    <div>
      <CurrentContent />
    </div>
  );
}
