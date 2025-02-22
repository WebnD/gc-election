import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function ConfirmationModal({ candidate, onConfirm, onCancel }: {candidate: Candidate, onConfirm: ()=>void, onCancel: ()=>void}) {
  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium">Confirm Your Vote</DialogTitle>
          <DialogDescription>Please confirm your selection. This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-lg font-medium text-center">{candidate.name}</p>
          {candidate.rollNumber && (
            <p className="text-sm text-gray-500 text-center">Roll Number: {candidate.rollNumber}</p>
          )}
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onCancel} className="rounded-xl">
            Cancel
          </Button>
          <Button onClick={onConfirm} className="bg-black hover:bg-gray-800 rounded-xl">
            Confirm Vote
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

