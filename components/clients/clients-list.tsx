"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { deleteClient } from "@/app/actions/client"

interface Client {
  id: string
  name: string
  company_name?: string | null
  email?: string | null
  phone?: string | null
}

interface ClientsListProps {
  clients: Client[]
  invoiceCountMap: Record<string, number>
}

export function ClientsList({ clients: initialClients, invoiceCountMap }: ClientsListProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [clients, setClients] = useState(initialClients)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function handleDelete(clientId: string, clientName: string) {
    if (!confirm(`Are you sure you want to delete "${clientName}"? This action cannot be undone.`)) {
      return
    }

    setDeletingId(clientId)

    try {
      const result = await deleteClient(clientId)

      if (result.error) {
        toast({
          title: "Failed to delete client",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: "Client deleted successfully",
        })
        // Remove the client from the local state
        setClients((prev) => prev.filter((c) => c.id !== clientId))
        router.refresh()
      }
    } catch (error: any) {
      toast({
        title: "Failed to delete client",
        description: error?.message || "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Invoices</TableHead>
            <TableHead className="w-10"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id}>
              <TableCell className="font-medium">
                <Link href={`/app/clients/${client.id}`} className="hover:text-primary hover:underline">
                  {client.name}
                </Link>
              </TableCell>
              <TableCell>{client.company_name || "—"}</TableCell>
              <TableCell>{client.email || "—"}</TableCell>
              <TableCell>{client.phone || "—"}</TableCell>
              <TableCell>{invoiceCountMap[client.id] || 0}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8" disabled={deletingId === client.id}>
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/app/clients/${client.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/app/clients/${client.id}/edit`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => handleDelete(client.id, client.name)}
                      disabled={deletingId === client.id}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      {deletingId === client.id ? "Deleting..." : "Delete"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
