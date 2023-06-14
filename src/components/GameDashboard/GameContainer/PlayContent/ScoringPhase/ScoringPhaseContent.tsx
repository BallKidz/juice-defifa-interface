import Container from "components/layout/Container";
import { useState } from "react";
import { twJoin } from "tailwind-merge";
import { CustomScorecardContent } from "./CustomScorecardContent/CustomScorecardContent";
import { ScorecardsContent } from "./ScorecardsContent/ScorecardsContent";
import { RefundPicksContent } from "../MintPhase/RefundPicksContent";

export function ScoringPhaseContent() {
  const [selectedTab, setSelectedTab] = useState<
    "scorecards" | "customscorecard" | "mypicks"
  >("scorecards");

  return (
    <div>
      <Container>
        <ul className="flex gap-2 mb-6 text-sm">
          <li>
            <a
              className={twJoin(
                selectedTab === "scorecards"
                  ? "bg-neutral-800 text-neutral-50 rounded-md"
                  : "text-neutral-400",
                "cursor-pointer hover:text-neutral-300 px-4 py-2"
              )}
              onClick={() => setSelectedTab("scorecards")}
            >
              Scorecards
            </a>
          </li>
          <li>
            <a
              className={twJoin(
                selectedTab === "customscorecard"
                  ? "bg-neutral-800 text-neutral-50 rounded-md"
                  : "text-neutral-400",
                "cursor-pointer hover:text-neutral-300 px-4 py-2"
              )}
              onClick={() => setSelectedTab("customscorecard")}
            >
              Submit scorecard
            </a>
          </li>
          <li>
            <a
              className={twJoin(
                selectedTab === "mypicks"
                  ? "bg-neutral-800 text-neutral-50 rounded-md"
                  : "text-neutral-400",
                "cursor-pointer hover:text-neutral-300 px-4 py-2"
              )}
              onClick={() => setSelectedTab("mypicks")}
            >
              My picks
            </a>
          </li>
        </ul>
      </Container>
      {selectedTab === "scorecards" ? (
        <ScorecardsContent />
      ) : selectedTab === "customscorecard" ? (
        <CustomScorecardContent />
      ) : (
        <RefundPicksContent disabled />
      )}
    </div>
  );
}
