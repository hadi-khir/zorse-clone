import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { DialogTrigger } from "./ui/dialog";

interface ConfirmSubmissionProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    submittedPhrase: string;
}

const ConfirmSubmission = ({ isOpen, onConfirm, onCancel, submittedPhrase }: ConfirmSubmissionProps) => {
    return (
        <AlertDialog open={isOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Your Answer</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to submit this answer?:
                        <br />
                        <span className="text-lg font-bold py-5">
                            {submittedPhrase}
                        </span>
                        <br />
                        You will not be able to change it after submission.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onCancel}>Go Back</AlertDialogCancel>
                    <DialogTrigger asChild>
                        <AlertDialogAction onClick={onConfirm}>Yes, Submit Answer</AlertDialogAction>
                    </DialogTrigger>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default ConfirmSubmission;