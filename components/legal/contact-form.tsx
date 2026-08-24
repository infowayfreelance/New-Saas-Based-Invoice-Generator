"use client"

import { useRef, useState, useTransition } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { submitContactForm } from "@/app/actions/contact"
import { CONTACT_CATEGORIES } from "@/lib/contact-categories"

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<{ success: boolean; error?: string } | null>(null)
  const [category, setCategory] = useState("")
  const [consent, setConsent] = useState(false)

  const handleSubmit = (formData: FormData) => {
    setResult(null)
    startTransition(async () => {
      const res = await submitContactForm(formData)
      setResult(res)
      if (res.success) {
        formRef.current?.reset()
        setCategory("")
        setConsent(false)
      }
    })
  }

  if (result?.success) {
    return (
      <Alert className="border-green-500/30 bg-green-500/10">
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <AlertTitle>Message sent</AlertTitle>
        <AlertDescription>
          Thanks - we've received your message and will get back to you as soon as we can.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-5">
      {/* Honeypot field - hidden from real users via CSS, left blank by them.
          Bots that fill every field will trip this and be silently dropped. */}
      <div className="hidden" aria-hidden="true">
        <Label htmlFor="website">Leave this field blank</Label>
        <Input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Never send your password, full payment card details, secret keys or confidential client information
          through this form.
        </AlertDescription>
      </Alert>

      {result?.error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{result.error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full name</Label>
          <Input id="fullName" name="fullName" required maxLength={200} autoComplete="name" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input id="email" name="email" type="email" required maxLength={320} autoComplete="email" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select value={category} onValueChange={setCategory} name="category" required>
          <SelectTrigger id="category">
            <SelectValue placeholder="Choose a category" />
          </SelectTrigger>
          <SelectContent>
            {CONTACT_CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {/* Select's value isn't a native form field by default - mirror it into a hidden input so FormData picks it up. */}
        <input type="hidden" name="category" value={category} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Input id="subject" name="subject" required maxLength={200} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" name="message" required minLength={10} maxLength={5000} rows={6} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="accountEmail">Account email (optional)</Label>
          <Input id="accountEmail" name="accountEmail" type="email" maxLength={320} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="reference">Invoice or transaction reference (optional)</Label>
          <Input id="reference" name="reference" maxLength={200} />
        </div>
      </div>

      <div className="flex items-start gap-2.5">
        <Checkbox
          id="consent"
          checked={consent}
          onCheckedChange={(checked) => setConsent(checked === true)}
          required
        />
        <input type="hidden" name="consent" value={consent ? "on" : ""} />
        <Label htmlFor="consent" className="text-sm font-normal leading-relaxed text-muted-foreground">
          I've read the <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link> and
          agree to MakeInvo processing my message to respond to this request.
        </Label>
      </div>

      <Button type="submit" size="lg" disabled={isPending || !consent}>
        {isPending ? "Sending..." : "Send message"}
      </Button>
    </form>
  )
}
