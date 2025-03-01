"use client"

import { useState, useEffect } from "react"
import Navbar from "./components/Navbar"
import CandidateList from "./components/CandidateList"
import ConfirmationModal from "./components/ConfirmationModal"
import LoadingAnimation from "./components/LoadingAnimation"
import ThankYouModal from "./components/ThankYouModal"
import { Button } from "@/components/ui/button"
import { signIn, signOut, useSession } from "next-auth/react"
import { toast } from "sonner"

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [email, setEmail] = useState("")
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showThankYou, setShowThankYou] = useState(false)
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate>({ $id: "abstain", name: "Abstain from Voting", rollNumber: "" })
  
  const { data: session } = useSession()

  useEffect(() => {
    if (session?.user?.email) {
      setEmail(session.user.email);      
    };

    async function checkVote(email: string){
      const response = await fetch("/api/check-vote", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json();
      setIsLoggedIn(data);
      if (!data) {
        toast.error("You have already submitted your vote! ❌");
      }
    }

    checkVote(session?.user?.email!);

  }, [session])

  const handleSignIn = () => {
    signIn("google")
  }

  const handleVoteSubmit = () => {
    if (selectedCandidate) {
      setShowConfirmation(true)
    }
  }

  const handleConfirmVote = async () => {
    setShowConfirmation(false)
    setIsLoading(true)
    const response = await fetch("/api/vote-complete", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ selectedCandidate , email}),
    })
    
    setIsLoading(false)
    setShowThankYou(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {!isLoggedIn ? (
          <div className="flex justify-center items-center h-[calc(100vh-100px)]">
            <Button
              onClick={handleSignIn}
              className="bg-black hover:bg-gray-800 text-white rounded-full px-8 py-6 text-lg font-medium transition-colors"
            >
              Sign In With Google
            </Button>
          </div>
        ) : (
          <CandidateList
            email={email}
            selectedCandidate={selectedCandidate}
            onSelectCandidate={setSelectedCandidate}
            onSubmitVote={handleVoteSubmit}
          />
        )}
      </main>

      {showConfirmation && (
        <ConfirmationModal
          candidate={selectedCandidate}
          onConfirm={handleConfirmVote}
          onCancel={() => setShowConfirmation(false)}
        />
      )}

      {isLoading && <LoadingAnimation />}

      {showThankYou && <ThankYouModal onClose={() =>{setShowThankYou(false); signOut()} } />}
    </div>
  )
}
