"use client"

import { useEffect, useState } from "react"
import { PageHeader } from "@/components/app/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Pencil, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import {
  deleteTermsTemplate,
  listTermsTemplates,
  saveTermsTemplate,
  type TermsTemplate,
} from "@/app/actions/terms-templates"

export default function TermsSettingsPage() {
  const [templates, setTemplates] = useState<TermsTemplate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [content, setContent] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  const refresh = () => {
    listTermsTemplates().then((data) => {
      setTemplates(data)
      setIsLoading(false)
    })
  }

  useEffect(() => {
    refresh()
  }, [])

  const startNew = () => {
    setEditingId(null)
    setName("")
    setContent("")
  }

  const startEdit = (template: TermsTemplate) => {
    setEditingId(template.id)
    setName(template.name)
    setContent(template.content)
  }

  const handleSave = async () => {
    setIsSaving(true)
    const result = await saveTermsTemplate({ id: editingId || undefined, name, content })
    setIsSaving(false)
    if (!result.success) {
      toast.error(result.error || "Failed to save template.")
      return
    }
    toast.success("Terms & Conditions template saved.")
    startNew()
    refresh()
  }

  const handleDelete = async (id: string) => {
    const result = await deleteTermsTemplate(id)
    if (!result.success) {
      toast.error(result.error || "Failed to delete template.")
      return
    }
    if (editingId === id) startNew()
    toast.success("Template deleted.")
    refresh()
  }

  return (
    <>
      <PageHeader
        title="Terms & Conditions"
        breadcrumbs={[
          { label: "Dashboard", href: "/app" },
          { label: "Settings", href: "/app/settings" },
          { label: "Terms & Conditions" },
        ]}
      />
      <div className="flex-1 space-y-6 p-4 md:p-6">
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-base">Saved templates</CardTitle>
                <CardDescription>Pick one when creating an invoice.</CardDescription>
              </div>
              <Button type="button" size="icon" variant="outline" onClick={startNew}>
                <Plus className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {isLoading && <p className="text-sm text-muted-foreground">Loading...</p>}
              {!isLoading && templates.length === 0 && (
                <p className="text-sm text-muted-foreground">No saved templates yet.</p>
              )}
              {templates.map((template) => (
                <div
                  key={template.id}
                  className={`flex items-center justify-between rounded-md border p-3 text-sm ${
                    editingId === template.id ? "border-primary bg-muted/50" : "border-border"
                  }`}
                >
                  <button type="button" className="flex-1 text-left font-medium" onClick={() => startEdit(template)}>
                    {template.name}
                  </button>
                  <div className="flex items-center gap-1">
                    <Button type="button" size="icon" variant="ghost" onClick={() => startEdit(template)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button type="button" size="icon" variant="ghost" onClick={() => handleDelete(template.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">{editingId ? "Edit template" : "New template"}</CardTitle>
              <CardDescription>
                The full text here is what appears on its own page at the end of the invoice PDF.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="template-name">Template name</Label>
                <Input
                  id="template-name"
                  placeholder="e.g. Standard Terms"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="template-content">Terms & Conditions</Label>
                <Textarea
                  id="template-content"
                  placeholder="Write the full terms and conditions text here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={14}
                />
              </div>
              <div className="flex justify-end gap-2">
                {editingId && (
                  <Button type="button" variant="outline" onClick={startNew}>
                    Cancel
                  </Button>
                )}
                <Button type="button" disabled={!name.trim() || isSaving} onClick={handleSave}>
                  {isSaving ? "Saving..." : editingId ? "Update template" : "Save template"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
