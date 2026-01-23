"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, Server, CheckCircle2, XCircle, Loader2, RefreshCw } from "lucide-react"
import { toast } from "sonner"

type EmailProvider = "CPANEL" | "GMAIL" | "OUTLOOK" | "SES" | "OTHER"

type EncryptionType = "SSL" | "TLS" | "STARTTLS"

interface EmailSetupWizardProps {
  userEmail: string
}

interface SMTPConfig {
  host: string
  port: number
  encryption: EncryptionType
}

const PROVIDER_DEFAULTS: Record<EmailProvider, SMTPConfig> = {
  CPANEL: { host: "", port: 465, encryption: "SSL" },
  GMAIL: { host: "smtp.gmail.com", port: 587, encryption: "TLS" },
  OUTLOOK: { host: "smtp-mail.outlook.com", port: 587, encryption: "STARTTLS" },
  SES: { host: "", port: 587, encryption: "TLS" },
  OTHER: { host: "", port: 587, encryption: "TLS" },
}

export function EmailSetupWizard({ userEmail }: EmailSetupWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [provider, setProvider] = useState<EmailProvider>("CPANEL")
  
  // Step 2: Email Credentials
  const [fromName, setFromName] = useState("")
  const [fromEmail, setFromEmail] = useState("")
  const [smtpPassword, setSmtpPassword] = useState("")
  const [replyToEmail, setReplyToEmail] = useState("")
  
  // Step 3: SMTP Server
  const [smtpHost, setSmtpHost] = useState("")
  const [smtpPort, setSmtpPort] = useState("587")
  const [smtpEncryption, setSmtpEncryption] = useState<EncryptionType>("TLS")
  const [smtpUsername, setSmtpUsername] = useState("")
  
  // Step 4: Test & Enable
  const [testRecipient, setTestRecipient] = useState(userEmail)
  const [isTesting, setIsTesting] = useState(false)
  const [testStatus, setTestStatus] = useState<"idle" | "success" | "error">("idle")
  const [testError, setTestError] = useState("")
  const [isEnabled, setIsEnabled] = useState(false)

  const handleProviderSelect = (selectedProvider: EmailProvider) => {
    setProvider(selectedProvider)
    
    // Auto-fill SMTP settings based on provider
    const defaults = PROVIDER_DEFAULTS[selectedProvider]
    setSmtpHost(defaults.host)
    setSmtpPort(defaults.port.toString())
    setSmtpEncryption(defaults.encryption)
    
    // Set username to fromEmail if available
    if (fromEmail) {
      setSmtpUsername(fromEmail)
    }
  }

  const handleUseDefaults = () => {
    const defaults = PROVIDER_DEFAULTS[provider]
    setSmtpHost(defaults.host)
    setSmtpPort(defaults.port.toString())
    setSmtpEncryption(defaults.encryption)
    setSmtpUsername(fromEmail)
    toast.success("Reset to recommended defaults")
  }

  const handleTestEmail = async () => {
    setIsTesting(true)
    setTestStatus("idle")
    setTestError("")

    // Simulate API call with mock response
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock success/failure (80% success rate for demo)
    const mockSuccess = Math.random() > 0.2

    if (mockSuccess) {
      setTestStatus("success")
      toast.success("Test email sent successfully!")
    } else {
      setTestStatus("error")
      setTestError("Connection failed: Unable to authenticate with SMTP server. Please check your credentials.")
      toast.error("Test email failed")
    }

    setIsTesting(false)
  }

  const handleSaveSettings = () => {
    // Mock save action
    toast.success("Email settings saved successfully!")
  }

  const handleReset = () => {
    setCurrentStep(1)
    setProvider("CPANEL")
    setFromName("")
    setFromEmail("")
    setSmtpPassword("")
    setReplyToEmail("")
    setSmtpHost("")
    setSmtpPort("587")
    setSmtpEncryption("TLS")
    setSmtpUsername("")
    setTestRecipient(userEmail)
    setTestStatus("idle")
    setTestError("")
    setIsEnabled(false)
    toast.info("Form reset")
  }

  const canProceedToStep2 = provider !== ""
  const canProceedToStep3 = fromEmail !== "" && smtpPassword !== ""
  const canProceedToStep4 = smtpHost !== "" && smtpPort !== "" && smtpUsername !== ""
  const canSave = testStatus === "success"

  const steps = [
    { number: 1, title: "Provider", icon: Mail },
    { number: 2, title: "Credentials", icon: Mail },
    { number: 3, title: "SMTP Server", icon: Server },
    { number: 4, title: "Test & Enable", icon: CheckCircle2 },
  ]

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Progress Steps */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            {steps.map((step, idx) => (
              <div key={step.number} className="flex flex-1 items-center">
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      currentStep >= step.number
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <step.icon className="h-5 w-5" />
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      currentStep >= step.number ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={`mx-2 h-0.5 flex-1 ${
                      currentStep > step.number ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step 1: Choose Provider */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Choose Your Email Provider</CardTitle>
            <CardDescription>Select your email provider to get started with SMTP setup</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <RadioGroup value={provider} onValueChange={(val) => handleProviderSelect(val as EmailProvider)}>
              <div className="space-y-3">
                <label
                  htmlFor="cpanel"
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50 ${
                    provider === "CPANEL" ? "border-primary bg-muted/50" : ""
                  }`}
                >
                  <RadioGroupItem value="CPANEL" id="cpanel" />
                  <div className="flex-1">
                    <div className="font-medium">cPanel / Hosting Email</div>
                    <div className="text-sm text-muted-foreground">
                      Email accounts from your web hosting provider
                    </div>
                  </div>
                </label>

                <label
                  htmlFor="gmail"
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50 ${
                    provider === "GMAIL" ? "border-primary bg-muted/50" : ""
                  }`}
                >
                  <RadioGroupItem value="GMAIL" id="gmail" />
                  <div className="flex-1">
                    <div className="font-medium">Gmail / Google Workspace</div>
                    <div className="text-sm text-muted-foreground">Send emails using your Gmail account</div>
                  </div>
                </label>

                <label
                  htmlFor="outlook"
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50 ${
                    provider === "OUTLOOK" ? "border-primary bg-muted/50" : ""
                  }`}
                >
                  <RadioGroupItem value="OUTLOOK" id="outlook" />
                  <div className="flex-1">
                    <div className="font-medium">Outlook / Microsoft 365</div>
                    <div className="text-sm text-muted-foreground">Use your Microsoft email account</div>
                  </div>
                </label>

                <label
                  htmlFor="ses"
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50 ${
                    provider === "SES" ? "border-primary bg-muted/50" : ""
                  }`}
                >
                  <RadioGroupItem value="SES" id="ses" />
                  <div className="flex-1">
                    <div className="font-medium">Amazon SES</div>
                    <div className="text-sm text-muted-foreground">
                      Amazon Simple Email Service for high-volume sending
                    </div>
                  </div>
                </label>

                <label
                  htmlFor="other"
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50 ${
                    provider === "OTHER" ? "border-primary bg-muted/50" : ""
                  }`}
                >
                  <RadioGroupItem value="OTHER" id="other" />
                  <div className="flex-1">
                    <div className="font-medium">Other SMTP</div>
                    <div className="text-sm text-muted-foreground">Custom SMTP server configuration</div>
                  </div>
                </label>
              </div>
            </RadioGroup>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={handleReset}>
                Reset
              </Button>
              <Button onClick={() => setCurrentStep(2)} disabled={!canProceedToStep2}>
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Email Credentials */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Email Credentials</CardTitle>
            <CardDescription>Enter the email address you'll send invoices from</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fromName">From Name (Optional)</Label>
              <Input
                id="fromName"
                placeholder="e.g., Acme Billing"
                value={fromName}
                onChange={(e) => setFromName(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">This name will appear in your client's inbox</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fromEmail">
                From Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="fromEmail"
                type="email"
                placeholder="invoices@yourdomain.com"
                value={fromEmail}
                onChange={(e) => {
                  setFromEmail(e.target.value)
                  setSmtpUsername(e.target.value)
                }}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="smtpPassword">
                SMTP Password <span className="text-destructive">*</span>
              </Label>
              <Input
                id="smtpPassword"
                type="password"
                placeholder="••••••••"
                value={smtpPassword}
                onChange={(e) => setSmtpPassword(e.target.value)}
                required
              />
              <p className="text-sm text-muted-foreground">
                Your email account password or app-specific password
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="replyToEmail">Reply-To Email (Optional)</Label>
              <Input
                id="replyToEmail"
                type="email"
                placeholder="support@yourdomain.com"
                value={replyToEmail}
                onChange={(e) => setReplyToEmail(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Where client replies will be sent (defaults to From Email)
              </p>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setCurrentStep(1)}>
                Back
              </Button>
              <Button onClick={() => setCurrentStep(3)} disabled={!canProceedToStep3}>
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: SMTP Server */}
      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>SMTP Server Configuration</CardTitle>
                <CardDescription>Auto-filled based on your provider, but fully editable</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={handleUseDefaults}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Use Defaults
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Server className="h-4 w-4" />
              <AlertDescription>
                We've pre-filled these settings for <strong>{provider}</strong>. You can edit any field if needed.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="smtpHost">
                SMTP Host <span className="text-destructive">*</span>
              </Label>
              <Input
                id="smtpHost"
                placeholder="smtp.example.com"
                value={smtpHost}
                onChange={(e) => setSmtpHost(e.target.value)}
                required
              />
              <p className="text-sm text-muted-foreground">Your email server's SMTP hostname</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="smtpPort">
                  SMTP Port <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="smtpPort"
                  type="number"
                  placeholder="587"
                  value={smtpPort}
                  onChange={(e) => setSmtpPort(e.target.value)}
                  required
                />
                <p className="text-sm text-muted-foreground">Common: 465 (SSL) or 587 (TLS)</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="smtpEncryption">
                  Encryption <span className="text-destructive">*</span>
                </Label>
                <Select value={smtpEncryption} onValueChange={(val) => setSmtpEncryption(val as EncryptionType)}>
                  <SelectTrigger id="smtpEncryption">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SSL">SSL</SelectItem>
                    <SelectItem value="TLS">TLS</SelectItem>
                    <SelectItem value="STARTTLS">STARTTLS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="smtpUsername">
                SMTP Username <span className="text-destructive">*</span>
              </Label>
              <Input
                id="smtpUsername"
                placeholder="username"
                value={smtpUsername}
                onChange={(e) => setSmtpUsername(e.target.value)}
                required
              />
              <p className="text-sm text-muted-foreground">Usually the same as your email address</p>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setCurrentStep(2)}>
                Back
              </Button>
              <Button onClick={() => setCurrentStep(4)} disabled={!canProceedToStep4}>
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Test & Enable */}
      {currentStep === 4 && (
        <Card>
          <CardHeader>
            <CardTitle>Test & Enable</CardTitle>
            <CardDescription>Send a test email to verify your SMTP configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Configuration Summary */}
            <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
              <h4 className="font-medium">Configuration Summary</h4>
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Provider:</span>
                  <span className="font-medium">{provider}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">From Email:</span>
                  <span className="font-medium">{fromEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">SMTP Server:</span>
                  <span className="font-medium">
                    {smtpHost}:{smtpPort}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Encryption:</span>
                  <span className="font-medium">{smtpEncryption}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="testRecipient">Test Recipient Email</Label>
              <Input
                id="testRecipient"
                type="email"
                value={testRecipient}
                onChange={(e) => setTestRecipient(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">We'll send a test email to this address</p>
            </div>

            <div className="space-y-4">
              <Button onClick={handleTestEmail} disabled={isTesting || !testRecipient} className="w-full">
                {isTesting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending Test Email...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Send Test Email
                  </>
                )}
              </Button>

              {testStatus === "success" && (
                <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
                  <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <AlertDescription className="text-green-800 dark:text-green-200">
                    Test email sent successfully! Check {testRecipient} for the test message.
                  </AlertDescription>
                </Alert>
              )}

              {testStatus === "error" && (
                <Alert className="border-destructive bg-destructive/10">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Test Failed:</strong> {testError}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {testStatus === "success" && (
              <div className="space-y-4 rounded-lg border bg-muted/50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Enable Email Sending</h4>
                    <p className="text-sm text-muted-foreground">
                      Start sending invoice emails with this configuration
                    </p>
                  </div>
                  <Button
                    variant={isEnabled ? "default" : "outline"}
                    onClick={() => setIsEnabled(!isEnabled)}
                  >
                    {isEnabled ? "Enabled" : "Disabled"}
                  </Button>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setCurrentStep(3)}>
                Back
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleReset}>
                  Reset All
                </Button>
                <Button onClick={handleSaveSettings} disabled={!canSave}>
                  {canSave ? "Save Settings" : "Test Required"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Helper Notes */}
      <Card className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950">
        <CardContent className="pt-6">
          <div className="space-y-2 text-sm">
            <p className="font-medium text-blue-900 dark:text-blue-100">Note: This is a UI preview</p>
            <p className="text-blue-800 dark:text-blue-200">
              The test email functionality is currently mocked. Database integration and actual SMTP email sending will
              be implemented in the next step.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
