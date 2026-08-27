"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"
import { listTermsTemplates, saveTermsTemplate, type TermsTemplate } from "@/app/actions/terms-templates"

interface TermsDetailFieldProps {
  value: string
  onChange: (value: string) => void
}

export function TermsDetailField({ value, onChange }: TermsDetailFieldProps) {
  const [templates, setTemplates] = useState<TermsTemplate[]>([])
  const [isSaveOpen, setIsSaveOpen] = useState(false)
  const [templateName, setTemplateName] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    listTermsTemplates().then(setTemplates)
  }, [])

  const handleSelectTemplate = (id: string) => {
    const template = templates.find((t) => t.id === id)
    if (template) onChange(template.content)
  }

  const handleSaveAsTemplate = async () => {
    setIsSaving(true)
    const result = await saveTermsTemplate({ name: templateName, content: value })
    setIsSaving(false)
    if (!result.success) {
      toast.error(result.error || "Failed to save template.")
      return
    }
    toast.success("Terms & Conditions template saved.")
    setIsSaveOpen(false)
    setTemplateName("")
    listTermsTemplates().then(setTemplates)
  }

  return (
    <div className="space-y-3">
      {templates.length > 0 && (
        <div className="flex items-center gap-2">
          <Label className="whitespace-nowrap text-sm text-muted-foreground">Load saved template</Label>
          <Select onValueChange={handleSelectTemplate}>
            <SelectTrigger className="max-w-xs">
              <SelectValue placeholder="Choose a saved template..." />
            </SelectTrigger>
            <SelectContent>
              {templates.map((template) => (
                <SelectItem key={template.id} value={template.id}>
                  {template.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <Textarea
        placeholder="Write your full terms and conditions here. This will appear on its own page at the end of the invoice PDF."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={8}
      />

      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={!value.trim()}
        onClick={() => {
          setTemplateName("")
          setIsSaveOpen(true)
        }}
      >
        Save as template
      </Button>

      <Dialog open={isSaveOpen} onOpenChange={setIsSaveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Terms & Conditions template</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="terms-template-name">Template name</Label>
            <Input
              id="terms-template-name"
              placeholder="e.g. Standard Terms"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsSaveOpen(false)}>
              Cancel
            </Button>
            <Button type="button" disabled={!templateName.trim() || isSaving} onClick={handleSaveAsTemplate}>
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
