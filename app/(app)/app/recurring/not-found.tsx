import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/app/page-header"

export default function RecurringNotFound() {
  return (
    <>
      <PageHeader
        title="Recurring Rule Not Found"
        breadcrumbs={[
          { label: "Dashboard", href: "/app" },
          { label: "Recurring", href: "/app/recurring" },
          { label: "Not Found" },
        ]}
      />
      <div className="flex flex-col items-center justify-center p-12 space-y-4">
        <h2 className="text-2xl font-semibold">Recurring Rule Not Found</h2>
        <p className="text-muted-foreground">
          The recurring rule you're looking for doesn't exist or has been deleted.
        </p>
        <Link href="/app/recurring">
          <Button>Back to Recurring Rules</Button>
        </Link>
      </div>
    </>
  )
}
