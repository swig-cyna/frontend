import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function TableSkeleton({ columns = [], rows = 3 }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((col, i) => (
            <TableHead key={i} className={col.className || ""}>
              <div className="h-4 w-3/4 animate-pulse rounded bg-gray-900" />
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(rows)].map((_, rowIdx) => (
          <TableRow key={rowIdx}>
            <TableCell colSpan={columns.length}>
              <div className="h-4 w-full animate-pulse rounded bg-gray-800" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
