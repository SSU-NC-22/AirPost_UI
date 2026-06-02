import { Pencil, Trash2, Plus } from "lucide-react";
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

interface CrudTableProps<T extends { id: string }> {
  title: string;
  addLabel: string;
  columns: Column<T>[];
  rows: T[];
}

export function CrudTable<T extends { id: string }>({
  title,
  addLabel,
  columns,
  rows,
}: CrudTableProps<T>) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>{title}</CardTitle>
        <Button size="sm" onClick={() => alert(`${addLabel} (mock — not wired)`)}>
          <Plus className="h-4 w-4" /> {addLabel}
        </Button>
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
              <TableRow key={row.id}>
                {columns.map((c) => (
                  <TableCell key={String(c.key)}>
                    {c.key === "actions" ? (
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" aria-label="Edit">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" aria-label="Delete">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ) : c.render ? (
                      c.render(row)
                    ) : (
                      String(row[c.key as keyof T])
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
