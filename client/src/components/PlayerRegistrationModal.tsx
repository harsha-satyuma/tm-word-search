import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export interface PlayerInfo {
  id: number;
  employeeId: string;
  name: string;
  department: string;
}

interface PlayerRegistrationModalProps {
  isOpen: boolean;
  onRegister: (playerInfo: PlayerInfo) => void;
}

const DEPARTMENTS = [
  "Quality Drives",
  "Quality UPCS",
  "Quality UPS",
  "Testing Drives",
  "Testing UPCS",
  "Testing UPS",
  "IGI",
  "Methods",
  "Design",
  "Production Drives",
  "Production UPCS",
  "Production UPS",
  "PPC",
  "Stores",
  "PMD",
  "HR & ADMIN",
  "Finance",
  "IT",
  "SCM",
  "Logistics",
  "Others",
];

export default function PlayerRegistrationModal({
  isOpen,
  onRegister,
}: PlayerRegistrationModalProps) {
  const [name, setName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [department, setDepartment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !employeeId.trim() || !department) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/players/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          employeeId: employeeId.trim(),
          department: department,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.alreadyCompleted) {
          toast({
            title: "Already Completed",
            description: data.error,
            variant: "destructive",
          });
        } else {
          throw new Error(data.error || "Failed to register");
        }
        return;
      }

      toast({
        title: "Registration Successful",
        description: "You can now start the game!",
      });

      onRegister(data.player);
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to register player",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Welcome to Quality - Word Search</DialogTitle>
            <DialogDescription>
              Please enter your details to start the game.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
                autoFocus
                data-testid="input-player-name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="employeeId">Employee ID</Label>
              <Input
                id="employeeId"
                placeholder="Enter your employee ID"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                disabled={isSubmitting}
                data-testid="input-employee-id"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="department">Department</Label>
              <Select value={department} onValueChange={setDepartment} disabled={isSubmitting}>
                <SelectTrigger id="department" data-testid="select-department">
                  <SelectValue placeholder="Select your department" />
                </SelectTrigger>
                <SelectContent>
                  {DEPARTMENTS.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full"
              data-testid="button-register"
            >
              {isSubmitting ? "Registering..." : "Start Game"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
