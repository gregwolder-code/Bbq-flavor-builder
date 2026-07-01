"use client";

import { useState } from "react";
import { MessageSquare, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function FeedbackForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message, email }),
      });

      if (response.ok) {
        toast.success("Feedback sent! Thank you for your gift.");
        setMessage("");
        setEmail("");
        setIsOpen(false);
      } else {
        throw new Error("Failed to send feedback");
      }
    } catch (error) {
      console.error("Feedback error:", error);
      toast.error("Could not send feedback. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        render={
          <Button
            variant="default"
            size="icon"
            className={cn(
              "fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-xl hover:scale-110 transition-all duration-300 z-40 border-2 border-primary-foreground/20",
              "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            <MessageSquare className="h-6 w-6" />
            <span className="sr-only">Feedback</span>
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-primary">Feedback is a Gift</DialogTitle>
            <DialogDescription className="text-base">
              Tell us what you think! We're always looking to improve the BBQ Flavor Builder experience.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-6">
            <div className="grid gap-2">
              <Label htmlFor="message" className="font-semibold">Message</Label>
              <Textarea
                id="message"
                placeholder="What's on your mind? Suggestions, bugs, or just some BBQ love..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[120px] resize-none focus:ring-primary"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email" className="font-semibold">Email (Optional)</Label>
              <Input
                id="email"
                type="email"
                placeholder="pitmaster@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="focus:ring-primary"
              />
              <p className="text-[10px] text-muted-foreground">
                We'll only use your email if we need to follow up on your feedback.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className="w-full sm:w-auto font-bold px-8"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Feedback"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
