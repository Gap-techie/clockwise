import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";

interface LoginFormProps {
  onLogin?: (userData: { id: string; name: string; role: string }) => void;
}

const LoginForm = ({ onLogin = () => {} }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // For demo account, use hardcoded credentials
      if (email === "admin@biteon.com" && password === "password123") {
        console.log("Using demo account");

        // Simplified demo login flow to avoid potential issues
        const demoUser = {
          id: "demo-admin",
          name: "Admin User",
          role: "admin",
          email: "admin@biteon.com",
        };

        onLogin(demoUser);
        navigate("/");
        toast({
          title: "Welcome back",
          description: "You are now logged in as Admin User (Demo Mode)",
        });
        return;
      }

      // Regular sign in with email and password using Supabase Auth
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (signInError) {
        console.error("Sign in error:", signInError);
        throw signInError;
      }

      if (data?.user) {
        // Get user data from our users table
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("id", data.user.id)
          .single();

        if (userError) {
          console.error("User data fetch error:", userError);
          throw userError;
        }

        if (userData) {
          onLogin(userData);
          navigate("/");
          toast({
            title: "Welcome back",
            description: `You are now logged in as ${userData.name}`,
          });
        }
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleIdLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Special case for demo account - simplified to avoid potential issues
      if (employeeId === "EMP001" && password === "password123") {
        const demoUser = {
          id: "demo-employee",
          name: "Demo Employee",
          role: "employee",
          employee_id: "EMP001",
          email: "employee@biteon.com",
        };

        onLogin(demoUser);
        navigate("/");
        toast({
          title: "Welcome back",
          description: "You are now logged in as Demo Employee (Demo Mode)",
        });
        return;
      }

      // First, find the user with this employee ID
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("employee_id", employeeId)
        .single();

      if (userError) {
        console.error("Employee ID lookup error:", userError);
        throw new Error("Employee ID not found");
      }

      if (userData) {
        // Now sign in with the email and password
        const { data, error: signInError } =
          await supabase.auth.signInWithPassword({
            email: userData.email || "",
            password,
          });

        if (signInError) {
          console.error("Sign in error:", signInError);
          throw signInError;
        }

        if (data?.user) {
          onLogin(userData);
          navigate("/");
          toast({
            title: "Welcome back",
            description: `You are now logged in as ${userData.name}`,
          });
        }
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-center gap-2 text-2xl font-bold">
          <Clock className="h-6 w-6 text-primary" />
          <span>ClockWise Login</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="email" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="employeeId">Employee ID</TabsTrigger>
          </TabsList>

          <TabsContent value="email">
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@biteon.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="employeeId">
            <form onSubmit={handleIdLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="employeeId">Employee ID</Label>
                <Input
                  id="employeeId"
                  placeholder="EMP001"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="idPassword">Password</Label>
                <Input
                  id="idPassword"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="mt-4 text-center text-sm text-gray-500">
          <p>Demo Account:</p>
          <p>Email: admin@biteon.com / Password: password123</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
