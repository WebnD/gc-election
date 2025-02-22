'use client'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useEffect, useState } from "react"

// const candidates = {
//   "ECE+Meta+EP": [
//     { id: 1, name: "MM Representative No. 1", rollNumber: "22MM01001", photo: "/placeholder.svg?height=120&width=120" },
//     { id: 2, name: "MM Representative No. 2", rollNumber: "22MM01002", photo: "/placeholder.svg?height=120&width=120" },
//   ],
//   Mechanical: [
//     { id: 3, name: "ME Representative No. 1", rollNumber: "23ME01001", photo: "/placeholder.svg?height=120&width=120" },
//     { id: 4, name: "ME Representative No. 2", rollNumber: "23ME01002", photo: "/placeholder.svg?height=120&width=120" },
//   ],
// }

export default function CandidateList({ email, selectedCandidate, onSelectCandidate, onSubmitVote }: {email: string, selectedCandidate: Candidate, onSelectCandidate: (candidate: Candidate)=>void, onSubmitVote: ()=>void}) {

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const getTeam = (email: string) => {
    const match = email.match(/^(S|A)?\d{2}([A-Z]{2})(\d{2})\d{3}/i);
    if (!match) return "Unknown"; 

    const [, phdPrefix, branch, specifier] = match;
    const branchLower = branch.toLowerCase();

    if (phdPrefix || specifier === "09") return "PhD"; // S23ME09012, A24EE09010

    if (specifier === "06") return "MTech"; // 22CS06001, 22EC06001

    if (["ec", "mm", "ep"].includes(branchLower)) return "ECE+Meta+EP"; // 22EC01001, 22MM01001, 24EP01001

    if (branchLower === "ee") return "Electrical"; // 22EE01001

    if (branchLower === "me") return "Mechanical"; // 22ME01001

    if (branchLower === "ce") return "Civil"; // 22CE01001

    if (["cs"].includes(branchLower)) return "Computer Science"; // 22CS01001

    if (["hs", "cy", "ma", "ph", "cl", "gg"].includes(branchLower) && ["05", "03"].includes(specifier)) 
        return "MSc+ITEP"; // 22CY05001, 22MA05001, 23HS01001, 23CY03001

    return "Unknown";
};

  const team = getTeam(email);

  async function getCandidate(team: string){
    const response = await fetch("/api/get-candidates", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ team }),
    });

    const data = await response.json();
    setCandidates(data);
  }
  useEffect(() => {
    if (team !== "Unknown") {
      getCandidate(team);
    }
  }, [team]);
  
  if (team === "Unknown") {
    return <p>You appear to be an invalid user!</p>;
  }
  

  

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <h2 className="text-3xl font-medium text-gray-900">Vote for {team} Representative</h2>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <RadioGroup
          value={selectedCandidate.$id}
          onValueChange={(value) => {

            const candidate = [
              ...candidates,
              { $id: "abstain", name: "Abstain from Voting", rollNumber: "" },
              { $id: "nota", name: "None of the Above", rollNumber: "" },
            ].find((c) => c.$id === value) || { $id: "abstain", name: "Abstain from Voting", rollNumber: "" }
            onSelectCandidate(candidate)
          }}
        >
          <div className="space-y-4">
            {candidates.map((candidate) => (
              <div key={candidate.$id} className="flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-50">
                <RadioGroupItem
                  value={candidate.$id}
                  id={candidate.$id}
                  aria-checked={selectedCandidate.$id === candidate.$id}
                  data-state={selectedCandidate.$id === candidate.$id ? "checked" : "unchecked"}
                />
                <Image
                  src={candidate.photo || "/placeholder.svg"}
                  alt={candidate.name}
                  width={120}
                  height={120}
                  className="rounded-full"
                />
                <Label htmlFor={candidate.$id} className="flex flex-col cursor-pointer">
                  <span className="text-lg font-medium text-gray-900">{candidate.name}</span>
                  <span className="text-sm text-gray-500">Roll Number: {candidate.rollNumber}</span>
                </Label>
              </div>
            ))}

            {/* Abstain from Voting */}
            <div className="flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-50">
              <RadioGroupItem
                value="abstain"
                id="abstain"
                aria-checked={selectedCandidate.$id === "abstain"}
                data-state={selectedCandidate.$id === "abstain" ? "checked" : "unchecked"}
              />
              <Label htmlFor="abstain" className="cursor-pointer">
                <span className="text-lg font-medium text-gray-900">Abstain from Voting</span>
              </Label>
            </div>

            {/* None of the Above */}
            <div className="flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-50">
              <RadioGroupItem
                value="nota"
                id="nota"
                aria-checked={selectedCandidate.$id === "nota"}
                data-state={selectedCandidate.$id === "nota" ? "checked" : "unchecked"}
              />
              <Label htmlFor="nota" className="cursor-pointer">
                <span className="text-lg font-medium text-gray-900">None of the Above</span>
              </Label>
            </div>
          </div>
        </RadioGroup>
      </div>

      <Button
        onClick={onSubmitVote}
        disabled={!selectedCandidate}
        className="w-full bg-black hover:bg-gray-800 text-white rounded-xl py-6 text-lg font-medium transition-colors disabled:bg-gray-300"
      >
        Submit Vote
      </Button>
    </div>
  )
}

