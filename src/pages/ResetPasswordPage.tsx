import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Activity, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check for recovery token in URL hash
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      setIsRecovery(true);
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsRecovery(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({ title: "Error", description: "Passwords don't match", variant: "destructive" });
      return;
    }
    if (password.length < 6) {
      toast({ title: "Error", description: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setSuccess(true);
      setTimeout(() => navigate("/"), 2000);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (!isRecovery && !success) {
    return (
      <div className="min-h-screen flex items-center justify-center grid-bg p-4">
        <div className="glass-card rounded-xl p-8 w-full max-w-sm border border-border/50 text-center">
          <p className="text-muted-foreground">Invalid or expired reset link.</p>
          <button onClick={() => navigate("/auth")} className="mt-4 text-sm text-primary hover:underline">
            Back to sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center grid-bg p-4">
      <div className="glass-card rounded-xl p-8 w-full max-w-sm border border-border/50">
        <div className="flex items-center gap-3 justify-center mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <Activity className="w-6 h-6 text-primary" />
          </div>
          <span className="font-bold text-xl text-glow">NetMonitor</span>
        </div>

        {success ? (
          <div className="text-center">
            <CheckCircle className="w-10 h-10 text-success mx-auto mb-3" />
            <h2 className="text-lg font-semibold mb-2">Password updated!</h2>
            <p className="text-sm text-muted-foreground">Redirecting to dashboard...</p>
          </div>
        ) : (
          <>
            <h2 className="text-lg font-semibold text-center mb-1">Set new password</h2>
            <p className="text-sm text-muted-foreground text-center mb-6">Enter your new password below</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">New Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full px-3 py-2.5 rounded-lg bg-secondary/50 border border-border/50 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Confirm Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 w-full px-3 py-2.5 rounded-lg bg-secondary/50 border border-border/50 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
