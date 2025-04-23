import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "./ui/skeleton"

export function TableSkeleton({ columns = [], rows = 3 }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((col, i) => (
            <TableHead key={i} className={col.className || ""}>
              <Skeleton className="h-4 w-3/4" />
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(rows)].map((_, rowIdx) => (
          <TableRow key={rowIdx}>
            <TableCell colSpan={columns.length}>
              <Skeleton className="h-4 w-full" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
