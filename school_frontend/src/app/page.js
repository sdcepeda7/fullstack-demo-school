"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { CreateStudentDialog } from "@/components/CreateStudentDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const API_BASE_URL = "http://localhost:8000";

export default function Home() {
  const [students, setStudents] = useState([]);
  const [pagination, setPagination] = useState({
    next: null,
    previous: null,
    count: 0,
  });

  const loadStudents = async (url = `${API_BASE_URL}/students/`) => {
    try {
      const res = await fetch(url);
      const data = await res.json();
      // DRF PageNumberPagination devuelve: { count, next, previous, results }
      setStudents(data.results);
      setPagination({
        next: data.next,
        previous: data.previous,
        count: data.count,
      });
    } catch (error) {
      console.error("Error cargando estudiantes", error);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Estudiantes</h1>
        {/* Botón que abre el Modal */}
        <CreateStudentDialog onStudentCreated={() => loadStudents()} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado ({pagination.count} total)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.code}</TableCell>
                  <TableCell>{student.full_name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell className="text-right">
                    <Link href={`/students/${student.id}`}>
                      <Button variant="outline" size="sm">
                        Ver detalles
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
              {students.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-24">
                    No hay estudiantes encontrados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Paginación Shadcn */}
          <div className="mt-4 flex justify-end">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => pagination.previous && loadStudents(pagination.previous)}
                    className={
                      !pagination.previous
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    onClick={() => pagination.next && loadStudents(pagination.next)}
                    className={
                      !pagination.next
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}