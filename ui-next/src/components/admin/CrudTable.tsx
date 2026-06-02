import { Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface Column<T> {
  key: keyof T | "actions";
  header: string;
  render?: (row: T) => React.ReactNode;
}

interface CrudTableProps<T extends { id: string | number }> {
  title: string;
  addLabel: string;
  columns: Column<T>[];
  rows: T[];
  // When supplied, the Add button and a per-row Delete button are wired to these.
  onAdd?: () => void;
  onDelete?: (row: T) => void;
}

export function CrudTable<T extends { id: string | number }>({
  title,
  addLabel,
  columns,
  rows,
  onAdd,
  onDelete,
}: CrudTableProps<T>) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>{title}</CardTitle>
        {onAdd && (
          <Button size="sm" onClick={onAdd}>
            <Plus className="h-4 w-4" /> {addLabel}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((c) => (
                <TableHead key={String(c.key)}>{c.header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={String(row.id)}>
                {columns.map((c) => (
                  <TableCell key={String(c.key)}>
                    {c.key === "actions" ? (
                      onDelete && (
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Delete"
                          onClick={() => onDelete(row)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )
                    ) : c.render ? (
                      c.render(row)
                    ) : (
                      String(row[c.key as keyof T])
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="py-6 text-center text-sm text-muted-foreground"
                >
                  No entries
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
