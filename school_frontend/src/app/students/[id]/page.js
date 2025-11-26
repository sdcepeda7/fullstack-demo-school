"use client";
import { useState, useEffect, use } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const API_BASE_URL = "http://localhost:8000";

export default function StudentDetail({ params }) {
  // Desempaquetar params con React.use() (Next.js 15+) o directamente en v14
  const { id } = use(params);
  
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetch(`${API_BASE_URL}/students/${id}/`)
        .then((res) => res.json())
        .then((data) => {
          setStudent(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) return <div className="p-10 text-center">Cargando...</div>;
  if (!student) return <div className="p-10 text-center">Estudiante no encontrado</div>;

  return (
    <div className="container mx-auto py-10">
      <div className="mb-4">
        <Link href="/">
          <Button variant="ghost">← Volver al listado</Button>
        </Link>
      </div>
      
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">{student.full_name}</CardTitle>
          <CardDescription>Información detallada del estudiante</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 border-b pb-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Código</p>
              <p className="text-lg">{student.code}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">ID de Base de Datos</p>
              <p className="text-lg">{student.id}</p>
            </div>
          </div>
          
          <div className="border-b pb-4">
            <p className="text-sm font-medium text-muted-foreground">Correo Electrónico</p>
            <p className="text-lg">{student.email}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">Grupo (ID)</p>
            <p className="text-lg">{student.group}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}