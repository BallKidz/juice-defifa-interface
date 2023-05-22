import { useAccount } from "wagmi";
import { useChainData } from "./useChainData";
import request, { gql } from "graphql-request";
import { useEffect, useState } from "react";
import { useInterval } from "./useInterval";
import {DEFIFA_PROJECT_ID_GOERLI} from "../constants/constants";
import { DEFAULT_NFT_MAX_SUPPLY } from "../../src/hooks/NftRewards";

const myTeamsQuery = gql`
  query myTeamsQuery($owner: String!, $gameId: String!) {
    contracts(where: {gameId: $gameId}) {  
      mintedTokens(where: { owner: $owner }) {
        id
        number
        metadata {
          description
          id
          identifier
          image
          name
          tags
        }
      }
    }
  }
`;

export function useMyTeams() {
  const { chainData } = useChainData();
  const { address, isConnecting, isDisconnected } = useAccount();
  const graphUrl = chainData.subgraph;
  const [teams, setTeams] = useState<TeamTier[]>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isTeamRecentlyRemoved, setIsTeamRecentlyRemoved] =
    useState<boolean>(false);
  const [errorState, setError] = useState<{
    isError: boolean;
    error: string;
  }>({ isError: false, error: "" });

  useInterval(() => {
    getTeamsAndSetTeams();
  }, 5000);

  function removeTeams(tierIds: number[] | undefined) {
    setIsTeamRecentlyRemoved(true);
    const newTeams = teams?.filter((team) => !tierIds?.includes(team?.id));
    setTeams(newTeams);
  }

  function formatSubgData(data:any) {
   // TODO: This is a bit of a hack. We might want to look to add this in sol token svg resolver then the subgraph should return the correct data.
    data.contracts[0].mintedTokens.forEach((token: { id: { split: (arg0: string) => [any, any]; }; contractAddress: any; identifier: number; }) => {
      const [contractAddress, tokenId] = token.id.split('-');
      token.contractAddress = contractAddress;
      token.identifier = parseInt(tokenId, 10); // Convert tokenId to number??
    });
  // TODO ALL IN ONE forEach? Could be more efficient. Bad kmac.
    data.contracts[0].mintedTokens.forEach((token: Token) => {
      const tierId: number = Math.floor(token.identifier/DEFAULT_NFT_MAX_SUPPLY);
      token.metadata.identifier = tierId;
      token.metadata.tags = ['Option',token.metadata.description];
    });
    console.log('this is the cleaned up data ', data);
    return data;
  }

  function getTeamsAndSetTeams() {
    if (address && graphUrl) {
      request(graphUrl, myTeamsQuery, { owner: address.toLowerCase(), gameId: DEFIFA_PROJECT_ID_GOERLI.toString() })
        .then((data) => { 
          if(data.contracts[0].mintedTokens != undefined) {
            const formattedData = formatSubgData(data);
            const userTeams = getTeamTiersFromToken(formattedData.contracts[0].mintedTokens); // just one gameId in query
            console.log('this is the user teams ', userTeams);
            if (teams?.length === userTeams.length) {
              setIsTeamRecentlyRemoved(false);
            }

            !isTeamRecentlyRemoved && setTeams(userTeams);
          } else {
            // TODO error handling ??
            console.log('subg query response is empty contracts');}
        })
        .catch((error) => {console.log('this is the error ', error);});
    }
  }

  const fetchMyTeams = async () => {
    setError({ isError: false, error: "" });
    if (!address) return;
    const variables = {
      owner: address?.toLowerCase(),
      gameId: DEFIFA_PROJECT_ID_GOERLI.toString(),
    };

    try {
      setIsLoading(true);
      const response:{
        contracts: any; data: any[] } = await  request(graphUrl, myTeamsQuery, { owner: address.toLowerCase(), gameId: DEFIFA_PROJECT_ID_GOERLI.toString() })
  
      console.log('fetchMyTeams this is subg query response ', response, response.contracts[0].mintedTokens.length);
      if(response.contracts[0].mintedTokens.length !== 0 || undefined) {
        const formattedData = formatSubgData(response);
        console.log('fetchMyTeams formattedData ', formattedData);
        const userTeams = getTeamTiersFromToken(formattedData.contracts[0].mintedTokens); // just one gameId in query
        console.log('fetchMyTeams user teams ', userTeams);
        console.log('fetchMyTeams response ', response);
        setTeams(userTeams);
        setIsLoading(false);
      }
      else {
        console.log('fetchMyTeams response is empty');
        setError({ error: "No mints found in subgraph. Waiting...", isError: true });
        setIsLoading(false);
    }
    } catch (error) {
      setError({ error: "Something went wrong", isError: true });
      setIsLoading(false);
    } 
  };
  useEffect(() => {
    if (isConnecting) {
      setIsLoading(true);
      return;
    }
    if (isDisconnected) {
      setError({ error: "Please connect your wallet", isError: true });
      setIsLoading(false);
      setTeams([]);
      return;
    }
    if (!address) return;
    fetchMyTeams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, isConnecting, isDisconnected, graphUrl]);

  return {
    teams,
    isLoading,
    isError: errorState?.isError,
    error: errorState?.error,
    removeTeams,
  };
}

export interface TeamTier {
  id: number;
  quantity: number;
  image: string;
  name: string;
  tokenIds: string[];
}

export interface Token {
  id: string;
  identifier: number;
  metadata: {
    description: string;
    identifier: number;
    image: string;
    tags: string[];
  };
}

function getTeamTiersFromToken(token: Token[]) {
  let userTiers = new Map<number, TeamTier>();
  token.forEach((t) => {
    if (userTiers.has(t.metadata.identifier)) {
      const teamTier = userTiers.get(t.metadata.identifier);
      teamTier!.quantity++;
      teamTier!.tokenIds.push(t.identifier.toString());
    } else {
      userTiers.set(t.metadata.identifier, {
        id: t.metadata.identifier,
        quantity: 1,
        image: t.metadata.image,
        name: t.metadata.tags[1],
        tokenIds: [t.identifier.toString()],
      });
    }
  });
  return Array.from(userTiers.values());
}
