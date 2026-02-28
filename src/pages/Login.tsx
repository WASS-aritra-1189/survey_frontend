import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { FileText, Mail, Lock, Shield, RefreshCw, ArrowLeft, CheckCircle, XCircle, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";
import { UserRole } from "@/types/auth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Login() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [step, setStep] = useState<"credentials" | "otp" | "reset-request" | "reset-verify" | "reset-password">("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>(UserRole.USER);
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [captcha, setCaptcha] = useState("");
  const [captchaAnswer] = useState({ num1: 7, num2: 5, answer: 12 });
  const [isLoading, setIsLoading] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetOtp, setResetOtp] = useState(["", "", "", "", "", ""]);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  // Validation states
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    
    if (!email) newErrors.email = "Email is required";
    else if (!validateEmail(email)) newErrors.email = "Please enter a valid email address";
    
    if (!password) newErrors.password = "Password is required";
    else if (!validatePassword(password)) newErrors.password = "Password must be at least 8 characters";
    
    if (!captcha) newErrors.captcha = "Please solve the security check";
    else if (parseInt(captcha) !== captchaAnswer.answer) newErrors.captcha = "Incorrect answer, please try again";
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fix the errors before continuing");
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.login({
        loginId: email,
        password,
        role,
      });

      if (response.success) {
        setAuth(response.data.account, response.data.tokens);
        toast.success("Login successful!", {
          description: "Welcome back to SurveyPro Admin"
        });
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error("Login failed", {
        description: "Invalid credentials or server error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleResetOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...resetOtp];
    newOtp[index] = value;
    setResetOtp(newOtp);
    
    if (value && index < 5) {
      const nextInput = document.getElementById(`reset-otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      toast.error("Please enter the complete 6-digit OTP");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Login successful!", {
        description: "Welcome back to SurveyPro Admin"
      });
      navigate("/dashboard");
    }, 1500);
  };

  const handleResetRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail || !validateEmail(resetEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep("reset-verify");
      toast.success("Reset code sent!", {
        description: `A verification code has been sent to ${resetEmail}`
      });
    }, 1500);
  };

  const handleResetVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = resetOtp.join("");
    if (otpValue.length !== 6) {
      toast.error("Please enter the complete 6-digit code");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep("reset-password");
      toast.success("Code verified!", {
        description: "Please set your new password"
      });
    }, 1500);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    
    if (!newPassword) newErrors.newPassword = "New password is required";
    else if (newPassword.length < 8) newErrors.newPassword = "Password must be at least 8 characters";
    else if (!/[A-Z]/.test(newPassword)) newErrors.newPassword = "Password must contain an uppercase letter";
    else if (!/[0-9]/.test(newPassword)) newErrors.newPassword = "Password must contain a number";
    
    if (!confirmPassword) newErrors.confirmPassword = "Please confirm your password";
    else if (newPassword !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fix the errors");
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowSuccessDialog(true);
    }, 1500);
  };

  const handleSuccessClose = () => {
    setShowSuccessDialog(false);
    setStep("credentials");
    setResetEmail("");
    setResetOtp(["", "", "", "", "", ""]);
    setNewPassword("");
    setConfirmPassword("");
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(newPassword);
  const strengthColors = ["bg-destructive", "bg-destructive", "bg-warning", "bg-warning", "bg-success", "bg-success"];
  const strengthLabels = ["", "Weak", "Fair", "Good", "Strong", "Very Strong"];

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/10 blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <Card className="w-full max-w-md relative z-10 shadow-2xl border-0 backdrop-blur-sm bg-card/95">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center shadow-glow animate-bounce">
            <FileText className="h-8 w-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            SurveyPro Admin
          </CardTitle>
          <CardDescription>
            {step === "credentials" && "Sign in to access your admin dashboard"}
            {step === "otp" && "Enter the OTP sent to your email"}
            {step === "reset-request" && "Enter your email to reset password"}
            {step === "reset-verify" && "Enter the verification code"}
            {step === "reset-password" && "Create your new password"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === "credentials" && (
            <form onSubmit={handleCredentialsSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@survey.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`pl-10 ${errors.email ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <XCircle className="h-3 w-3" /> {errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`pl-10 pr-10 ${errors.password ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <XCircle className="h-3 w-3" /> {errors.password}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={UserRole.ROOT}>Root</SelectItem>
                    <SelectItem value={UserRole.ROOT_STAFF}>Root Staff</SelectItem>
                    <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                    <SelectItem value={UserRole.STAFF}>Staff</SelectItem>
                    <SelectItem value={UserRole.USER}>User</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Captcha */}
              <div className="space-y-2">
                <Label>Security Check</Label>
                <div className="flex items-center gap-3">
                  <div className="flex-1 flex items-center gap-2 rounded-lg bg-muted p-3">
                    <Shield className="h-4 w-4 text-primary" />
                    <span className="font-mono font-bold text-lg">
                      {captchaAnswer.num1} + {captchaAnswer.num2} = ?
                    </span>
                  </div>
                  <Input
                    type="number"
                    placeholder="?"
                    value={captcha}
                    onChange={(e) => setCaptcha(e.target.value)}
                    className={`w-20 text-center font-mono ${errors.captcha ? 'border-destructive' : ''}`}
                  />
                </div>
                {errors.captcha && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <XCircle className="h-3 w-3" /> {errors.captcha}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full gradient-primary" size="lg" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Continue"
                )}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Forgot password?{" "}
                <button
                  type="button"
                  onClick={() => setStep("reset-request")}
                  className="text-primary hover:underline font-medium"
                >
                  Reset here
                </button>
              </p>
            </form>
          )}

          {step === "otp" && (
            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <div className="space-y-4">
                <Label className="text-center block">Enter 6-digit OTP</Label>
                <div className="flex justify-center gap-2">
                  {otp.map((digit, index) => (
                    <Input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      className="w-12 h-12 text-center text-xl font-bold"
                    />
                  ))}
                </div>
                <div className="text-center space-y-1">
                  <p className="text-sm text-muted-foreground">
                    OTP sent to <span className="font-medium text-foreground">{email}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Code expires in 5 minutes
                  </p>
                </div>
              </div>

              <Button type="submit" className="w-full gradient-primary" size="lg" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify & Login"
                )}
              </Button>

              <div className="flex items-center justify-between text-sm">
                <button
                  type="button"
                  onClick={() => setStep("credentials")}
                  className="text-muted-foreground hover:text-foreground flex items-center gap-1"
                >
                  <ArrowLeft className="h-4 w-4" /> Back to login
                </button>
                <button
                  type="button"
                  className="text-primary hover:underline"
                  onClick={() => toast.info("OTP resent!", { description: "Check your email for the new code" })}
                >
                  Resend OTP
                </button>
              </div>
            </form>
          )}

          {step === "reset-request" && (
            <form onSubmit={handleResetRequest} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="reset-email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="Enter your email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  We'll send you a verification code to reset your password
                </p>
              </div>

              <Button type="submit" className="w-full gradient-primary" size="lg" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Reset Code"
                )}
              </Button>

              <button
                type="button"
                onClick={() => setStep("credentials")}
                className="w-full text-center text-sm text-muted-foreground hover:text-foreground flex items-center justify-center gap-1"
              >
                <ArrowLeft className="h-4 w-4" /> Back to login
              </button>
            </form>
          )}

          {step === "reset-verify" && (
            <form onSubmit={handleResetVerify} className="space-y-6">
              <div className="space-y-4">
                <Label className="text-center block">Enter Verification Code</Label>
                <div className="flex justify-center gap-2">
                  {resetOtp.map((digit, index) => (
                    <Input
                      key={index}
                      id={`reset-otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleResetOtpChange(index, e.target.value)}
                      className="w-12 h-12 text-center text-xl font-bold"
                    />
                  ))}
                </div>
                <p className="text-center text-sm text-muted-foreground">
                  Code sent to <span className="font-medium text-foreground">{resetEmail}</span>
                </p>
              </div>

              <Button type="submit" className="w-full gradient-primary" size="lg" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Code"
                )}
              </Button>

              <button
                type="button"
                onClick={() => setStep("reset-request")}
                className="w-full text-center text-sm text-muted-foreground hover:text-foreground flex items-center justify-center gap-1"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
            </form>
          )}

          {step === "reset-password" && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={`pl-10 pr-10 ${errors.newPassword ? 'border-destructive' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <XCircle className="h-3 w-3" /> {errors.newPassword}
                  </p>
                )}
                
                {/* Password strength indicator */}
                {newPassword && (
                  <div className="space-y-1">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded ${
                            level <= passwordStrength ? strengthColors[passwordStrength] : 'bg-muted'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Strength: {strengthLabels[passwordStrength]}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`pl-10 ${errors.confirmPassword ? 'border-destructive' : ''}`}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <XCircle className="h-3 w-3" /> {errors.confirmPassword}
                  </p>
                )}
                {confirmPassword && newPassword === confirmPassword && (
                  <p className="text-xs text-success flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" /> Passwords match
                  </p>
                )}
              </div>

              <div className="rounded-lg bg-muted/50 p-3 space-y-1">
                <p className="text-xs font-medium">Password requirements:</p>
                <ul className="text-xs text-muted-foreground space-y-0.5">
                  <li className={newPassword.length >= 8 ? 'text-success' : ''}>
                    {newPassword.length >= 8 ? '✓' : '○'} At least 8 characters
                  </li>
                  <li className={/[A-Z]/.test(newPassword) ? 'text-success' : ''}>
                    {/[A-Z]/.test(newPassword) ? '✓' : '○'} One uppercase letter
                  </li>
                  <li className={/[0-9]/.test(newPassword) ? 'text-success' : ''}>
                    {/[0-9]/.test(newPassword) ? '✓' : '○'} One number
                  </li>
                </ul>
              </div>

              <Button type="submit" className="w-full gradient-primary" size="lg" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </form>
          )}
        </CardContent>

        {/* Footer */}
        <div className="pb-6 px-6 text-center">
          <p className="text-xs text-muted-foreground">
            © 2026 Hitesh & Webapps Software Solutions. All rights reserved.
          </p>
          <a 
            href="https://webappssoft.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-primary hover:underline"
          >
            webappssoft.com
          </a>
        </div>
      </Card>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader>
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-success/10 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
            <DialogTitle className="text-center">Password Reset Successful!</DialogTitle>
            <DialogDescription className="text-center">
              Your password has been reset successfully. You can now login with your new password.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="justify-center">
            <Button onClick={handleSuccessClose} className="gradient-primary">
              Back to Login
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
