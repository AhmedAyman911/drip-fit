import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TablePagerProps {
  page: number
  totalPages: number
  totalCount: number
  noun: string
  onPageChange: (page: number) => void
}

export default function TablePager({ page, totalPages, totalCount, noun, onPageChange }: TablePagerProps) {
  return (
    <div className="flex items-center justify-between gap-4 pt-4">
      <p className="text-sm text-muted-foreground tabular-nums">
        {totalCount.toLocaleString()} {noun}
        {totalCount === 1 ? "" : "s"}
        {totalPages > 1 && `, page ${page} of ${totalPages}`}
      </p>
      {totalPages > 1 && (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
            <ChevronLeft aria-hidden />
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
            Next
            <ChevronRight aria-hidden />
          </Button>
        </div>
      )}
    </div>
  )
}
