import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { signInWithGoogle, signInWithGoogleRedirect, handleGoogleRedirect } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

export default function LoginScreen() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Enhanced authentication with user creation and role sync
  useEffect(() => {
    handleGoogleRedirect()
      .then(async (result) => {
        if (result) {
          toast({ title: "Google sign-in successful!" });
          
          // Check if user exists and get role, create if doesn't exist
          try {
            let response = await fetch(`/api/users/by-username/${result.user.email}`);
            let userRole = 'student';
            let userId = result.user.uid;
            
            if (response.ok) {
              const userData = await response.json();
              userRole = userData.role;
              userId = userData.id;
            } else if (response.status === 404) {
              // User doesn't exist, create new user
              
              // Determine role based on email for special accounts
              if (result.user.email === 'kitcanteen1@gmail.com') {
                userRole = 'super_admin';
              } else if (result.user.email === 'kitcanteenowner@gmail.com') {
                userRole = 'canteen_owner';
              }
              
              const createResponse = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  username: result.user.email,
                  password: 'oauth_user', // Placeholder for OAuth users
                  role: userRole
                })
              });
              
              if (createResponse.ok) {
                const newUser = await createResponse.json();
                userId = newUser.id;
              }
            }
            
            // Store user data with actual role from database
            localStorage.setItem('user', JSON.stringify({
              id: userId,
              name: result.user.displayName,
              email: result.user.email,
              role: userRole
            }));
            
            // Redirect based on role with enhanced messaging
            if (userRole === 'super_admin') {
              toast({ title: "Welcome Super Admin!", description: "Access to all system controls" });
              setLocation('/admin');
            } else if (userRole === 'canteen_owner') {
              toast({ title: "Welcome Canteen Owner!", description: "Manage your canteen operations" });
              setLocation('/canteen-owner-dashboard');
            } else {
              toast({ title: "Welcome Student!", description: "Explore delicious menu options" });
              setLocation('/home');
            }
          } catch (error) {
            console.error("Error in authentication flow:", error);
            // Default to student role if API fails
            localStorage.setItem('user', JSON.stringify({
              id: result.user.uid,
              name: result.user.displayName,
              email: result.user.email,
              role: 'student'
            }));
            setLocation('/home');
          }
        }
      })
      .catch((error) => {
        toast({ 
          title: "Google sign-in failed", 
          description: error.errorMessage || "Authentication failed",
          variant: "destructive" 
        });
      });
  }, []);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      console.log("Starting Google sign-in...");
      const result = await signInWithGoogle();
      
      if (result.user) {
        toast({ title: "Successfully signed in!" });
        
        // Enhanced user authentication and role management (same as above)
        try {
          let response = await fetch(`/api/users/by-username/${result.user.email}`);
          let userRole = 'student';
          let userId = result.user.uid;
          
          if (response.ok) {
            const userData = await response.json();
            userRole = userData.role;
            userId = userData.id;
          } else if (response.status === 404) {
            // User doesn't exist, create new user
            console.log("Creating new user account...");
            
            // Determine role based on email for special accounts
            if (result.user.email === 'kitcanteen1@gmail.com') {
              userRole = 'super_admin';
            } else if (result.user.email === 'kitcanteenowner@gmail.com') {
              userRole = 'canteen_owner';
            }
            
            const createResponse = await fetch('/api/users', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                username: result.user.email,
                password: 'oauth_user',
                role: userRole
              })
            });
            
            if (createResponse.ok) {
              const newUser = await createResponse.json();
              userId = newUser.id;
            }
          }
          
          // Store user data with actual role from database
          localStorage.setItem('user', JSON.stringify({
            id: userId,
            name: result.user.displayName,
            email: result.user.email,
            role: userRole
          }));
          
          // Redirect based on role
          if (userRole === 'super_admin') {
            toast({ title: "Welcome Super Admin!", description: "Access to all system controls" });
            setLocation("/admin");
          } else if (userRole === 'canteen_owner') {
            toast({ title: "Welcome Canteen Owner!", description: "Manage your canteen operations" });
            setLocation("/canteen-owner-dashboard");
          } else {
            toast({ title: "Welcome Student!", description: "Explore delicious menu options" });
            setLocation("/home");
          }
        } catch (error) {
          console.error("Error in authentication flow:", error);
          // Default to student role if API fails
          localStorage.setItem('user', JSON.stringify({
            id: result.user.uid,
            name: result.user.displayName,
            email: result.user.email,
            role: 'student'
          }));
          setLocation("/home");
        }
      }
    } catch (error: any) {
      console.error("Google sign-in error:", error);
      
      if (error.code === 'auth/unauthorized-domain') {
        toast({ 
          title: "Domain Authorization Required", 
          description: "Please add this domain to Firebase Console authorized domains",
          variant: "destructive" 
        });
      } else if (error.code === 'auth/popup-blocked') {
        toast({ 
          title: "Popup blocked", 
          description: "Redirecting to Google sign-in page...",
        });
        try {
          await signInWithGoogleRedirect();
        } catch (redirectError) {
          console.error("Redirect error:", redirectError);
          toast({ 
            title: "Authentication failed", 
            description: "Unable to sign in with Google",
            variant: "destructive" 
          });
        }
      } else if (error.code === 'auth/popup-closed-by-user') {
        toast({ 
          title: "Sign-in cancelled", 
          description: "You closed the sign-in window",
        });
      } else {
        toast({ 
          title: "Sign-in failed", 
          description: error.message || "Unable to sign in with Google",
          variant: "destructive" 
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex justify-center items-center p-4">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
          <span className="text-primary text-lg font-bold">KIT</span>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 px-6 py-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Welcome to KIT-Canteen
          </h1>
          <p className="text-muted-foreground mb-8">
            Sign in to order your favorite food
          </p>

          {/* Email login */}
          <Card className="shadow-card">
            <CardContent className="p-6">
              <Button
                onClick={handleGoogleSignIn}
                variant="food"
                size="mobile"
                className="w-full"
                disabled={isLoading}
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
{isLoading ? "Signing in..." : "Continue with College Email"}
              </Button>
            </CardContent>
          </Card>


        </div>
      </div>

      {/* Footer */}
      <div className="p-6 text-center">
        <p className="text-xs text-muted-foreground">
          By continuing, you agree to our{" "}
          <span className="text-primary underline">Terms of Service</span> and{" "}
          <span className="text-primary underline">Privacy Policy</span>
        </p>
      </div>
    </div>
  );
}