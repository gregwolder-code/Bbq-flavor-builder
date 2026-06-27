"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Shield, Bell, CreditCard, LogOut } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <aside className="md:col-span-1 space-y-2">
            <Button variant="ghost" className="w-full justify-start gap-2 bg-muted/50">
              <User className="h-4 w-4" /> Profile
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <CreditCard className="h-4 w-4" /> Subscription
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Bell className="h-4 w-4" /> Notifications
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Shield className="h-4 w-4" /> Security
            </Button>
            <Separator className="my-4" />
            <Button variant="ghost" className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10">
              <LogOut className="h-4 w-4" /> Sign Out
            </Button>
          </aside>

          <div className="md:col-span-3 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Public Profile</CardTitle>
                <CardDescription>How other pitmasters see you on the platform.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="" />
                    <AvatarFallback className="text-2xl bg-primary text-primary-foreground">JD</AvatarFallback>
                  </Avatar>
                  <Button variant="outline">Change Avatar</Button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Display Name</Label>
                    <Input id="name" defaultValue="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" placeholder="e.g. Austin, TX" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <textarea 
                    id="bio" 
                    className="w-full min-h-[100px] p-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary outline-none"
                    placeholder="Tell us about your BBQ setup..."
                  />
                </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Email Address</CardTitle>
                <CardDescription>Your primary email for notifications and login.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 font-medium">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>pitmaster@example.com</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Verified 2 months ago</p>
                  </div>
                  <Button variant="outline">Change Email</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-primary">Premium Membership</CardTitle>
                <CardDescription>Unlock unlimited recipes, AI tips, and more.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4">You are currently on the <strong>Free Tier</strong>.</p>
                <ul className="space-y-2 text-sm mb-6">
                  <li className="flex items-center gap-2">✅ Unlimited saved recipes</li>
                  <li className="flex items-center gap-2">✅ AI wood pairing suggestions</li>
                  <li className="flex items-center gap-2">✅ Ad-free experience</li>
                </ul>
                <Button className="w-full sm:w-auto">Upgrade to Premium</Button>
              </CardContent>
            </Card>
          </div>
        </div>
    </div>
  );
}
