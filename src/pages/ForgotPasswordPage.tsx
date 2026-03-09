import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Activity, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setSent(true);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center grid-bg p-4">
      <div className="glass-card rounded-xl p-8 w-full max-w-sm border border-border/50">
        <div className="flex items-center gap-3 justify-center mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <Activity className="w-6 h-6 text-primary" />
          </div>
          <span className="font-bold text-xl text-glow">NetMonitor</span>
        </div>

        {sent ? (
          <div className="text-center">
            <h2 className="text-lg font-semibold mb-2">Check your email</h2>
            <p className="text-sm text-muted-foreground mb-4">
              We sent a password reset link to <span className="text-foreground font-medium">{email}</span>
            </p>
            <Link to="/auth" className="text-sm text-primary hover:underline">Back to sign in</Link>
          </div>
        ) : (
          <>
            <h2 className="text-lg font-semibold text-center mb-1">Forgot password?</h2>
            <p className="text-sm text-muted-foreground text-center mb-6">Enter your email to receive a reset link</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full px-3 py-2.5 rounded-lg bg-secondary/50 border border-border/50 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="admin@example.com"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
            <div className="text-center mt-4">
              <Link to="/auth" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
                <ArrowLeft className="w-3 h-3" /> Back to sign in
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
