import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, LogIn, LogOut, UserPlus } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface UserData {
  id: string;
  email: string;
  name: string;
}

interface UserAuthProps {
  onUserChange?: (user: UserData | null) => void;
}

const UserAuth = ({ onUserChange = () => {} }: UserAuthProps) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check for existing user session
    const savedUser = localStorage.getItem("proftwo_user");
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      onUserChange(userData);
    }
  }, [onUserChange]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login API call
    setTimeout(() => {
      const userData: UserData = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name: email.split("@")[0],
      };

      localStorage.setItem("proftwo_user", JSON.stringify(userData));
      setUser(userData);
      onUserChange(userData);
      setIsAuthOpen(false);
      setIsLoading(false);
      setEmail("");
      setPassword("");
    }, 1000);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate signup API call
    setTimeout(() => {
      const userData: UserData = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name,
      };

      localStorage.setItem("proftwo_user", JSON.stringify(userData));
      setUser(userData);
      onUserChange(userData);
      setIsAuthOpen(false);
      setIsLoading(false);
      setEmail("");
      setPassword("");
      setName("");
    }, 1000);
  };

  const handleLogout = () => {
    localStorage.removeItem("proftwo_user");
    localStorage.removeItem("proftwo_lectures");
    setUser(null);
    onUserChange(null);
  };

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <span>Welcome, {user.name}</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="bg-white/30 backdrop-blur-sm border-white/30 hover:bg-white/50"
        >
          <LogOut className="w-4 h-4 mr-1" />
          Logout
        </Button>
      </div>
    );
  }

  return (
    <>
      <Button
        onClick={() => setIsAuthOpen(true)}
        className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
      >
        <User className="w-4 h-4 mr-2" />
        Sign In
      </Button>

      {isAuthOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md"
          >
            <Card className="bg-white/90 backdrop-blur-lg border-white/30 shadow-xl">
              <CardHeader>
                <CardTitle className="text-center text-gray-800">
                  Welcome to ProfTwo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Sign In</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                  </TabsList>

                  <TabsContent value="login">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="bg-white/50"
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
                          className="bg-white/50"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                        >
                          {isLoading ? "Signing In..." : "Sign In"}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsAuthOpen(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </TabsContent>

                  <TabsContent value="signup">
                    <form onSubmit={handleSignup} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-name">Name</Label>
                        <Input
                          id="signup-name"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          className="bg-white/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-email">Email</Label>
                        <Input
                          id="signup-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="bg-white/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-password">Password</Label>
                        <Input
                          id="signup-password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="bg-white/50"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                        >
                          {isLoading ? "Creating Account..." : "Sign Up"}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsAuthOpen(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default UserAuth;
