"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  FileText, 
  Settings, 
  Plus, 
  Search, 
  MoreVertical,
  Flame,
  Utensils,
  Palette,
  Loader2
} from "lucide-react";

export default function AdminPage() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("/api/admin/stats");
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Error fetching admin stats:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  const counts = stats?.counts || {
    users: 0,
    proteins: 0,
    methods: 0,
    flavors: 0,
    templates: 0,
    savedRecipes: 0
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your BBQ Flavor Builder data and users.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Export Data</Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> New Template
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{counts.users}</div>
            <p className="text-xs text-muted-foreground">Registered accounts</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Templates</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{counts.templates}</div>
            <p className="text-xs text-muted-foreground">Across all types</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Saved Recipes</CardTitle>
            <Flame className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{counts.savedRecipes}</div>
            <p className="text-xs text-muted-foreground">User collections</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Core Entities</CardTitle>
            <Utensils className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{counts.proteins + counts.methods + counts.flavors}</div>
            <p className="text-xs text-muted-foreground">Proteins, Methods, Flavors</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="proteins" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="proteins" className="flex items-center gap-2">
            <Utensils className="h-4 w-4" /> Proteins
          </TabsTrigger>
          <TabsTrigger value="flavors" className="flex items-center gap-2">
            <Palette className="h-4 w-4" /> Flavors
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <FileText className="h-4 w-4" /> Templates
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" /> Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="proteins">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Manage Proteins</CardTitle>
                  <CardDescription>Add or edit proteins available in the builder.</CardDescription>
                </div>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input className="pl-10" placeholder="Search proteins..." />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 border-b">
                    <tr>
                      <th className="text-left p-4 font-medium">Name</th>
                      <th className="text-left p-4 font-medium">Slug</th>
                      <th className="text-left p-4 font-medium">Icon</th>
                      <th className="text-left p-4 font-medium">Status</th>
                      <th className="text-right p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {[
                      { name: "Brisket", slug: "brisket", icon: "🥩", status: "Active" },
                      { name: "Pork Butt", slug: "pork-butt", icon: "🐷", status: "Active" },
                      { name: "Chicken", slug: "chicken", icon: "🍗", status: "Active" },
                      { name: "Ribs", slug: "ribs", icon: "🥓", status: "Active" },
                      { name: "Salmon", slug: "salmon", icon: "🐟", status: "Draft" },
                    ].map((p) => (
                      <tr key={p.slug}>
                        <td className="p-4 font-medium">{p.name}</td>
                        <td className="p-4 text-muted-foreground">{p.slug}</td>
                        <td className="p-4">{p.icon}</td>
                        <td className="p-4">
                          <Badge variant={p.status === 'Active' ? 'default' : 'secondary'}>{p.status}</Badge>
                        </td>
                        <td className="p-4 text-right">
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="flavors">
           <div className="py-20 text-center border-2 border-dashed rounded-xl">
             <Palette className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
             <h3 className="font-bold">Flavor Management</h3>
             <p className="text-muted-foreground">Flavor profiles will be listed here.</p>
           </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
