import request, { gql } from "graphql-request";
import { useQuery } from "react-query";
import { useChainData } from "./useChainData";

const allGamesQuery = gql`
  query myTeamsQuery {
    contracts {
      name
      address
      gameId
      tokenUriResolver
      mintedTokens {
        id
        metadata {
          description
          name
        }
      }
    }
  }
`;

export interface Game {
  gameId: number;
  name: string;
  address: string;
}

export function useAllGames() {
  const { chainData } = useChainData();
  const graphUrl = chainData.subgraph;

  return useQuery("allGames", async () => {
    const res = await request<{ contracts: Game[] }>(graphUrl, allGamesQuery);
    return res.contracts;
  });
}
