import { GameRow } from "components/Arcade/Game/Game";
import { AllGamesContext } from "hooks/gamesContext";
import { useAllGames } from "hooks/useAllGames";
import styles from "./TurnOn.module.css";

const AllGames = () => {
  const { isError, isLoading, games, error } = useAllGames();
  // TODO: Fix table headings, add more game stats

  if (!isError && !isLoading && (!games || games.length === 0)) {
    return <div>No games found.</div>;
  }

  return (
    <AllGamesContext.Provider value={games}>
      {isError && <div className={styles.error}>{error}</div>}
      {isLoading && <div className="text-center">Loading...</div>}
      {!isLoading && !isError && (
        <table className="mx-auto">
          <tbody>
            {games
              ?.sort((a, b) => a.gameId - b.gameId) // Sort the games array by game.id
              .reverse() // Reverse the order of the games array
              .map((game) => (
                <GameRow game={game} key={game.gameId} />
              ))}
          </tbody>
        </table>
      )}
    </AllGamesContext.Provider>
  );
};

export default AllGames;
