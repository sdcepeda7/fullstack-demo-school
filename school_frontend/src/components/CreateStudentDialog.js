"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const API_BASE_URL = "http://localhost:8000";

export function CreateStudentDialog({ onStudentCreated }) {
  const [open, setOpen] = useState(false);
  const [groups, setGroups] = useState([]);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    code: "",
    group: "",
  });

  // Cargar grupos para el select
  useEffect(() => {
    if (open) {
      fetch(`${API_BASE_URL}/student-groups/`)
        .then((res) => res.json())
        .then((data) => {
          // Soporta si la respuesta de grupos viene paginada o en lista plana
          setGroups(data.results ? data.results : data);
        });
    }
  }, [open]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/students/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setOpen(false);
        setFormData({ full_name: "", email: "", code: "", group: "" });
        if (onStudentCreated) onStudentCreated(); // Refrescar lista padre
      } else {
        alert("Error al crear el estudiante");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Crear Estudiante</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] text-black bg-white dark:bg-black dark:text-white">
        <DialogHeader>
          <DialogTitle>Crear Estudiante</DialogTitle>
          <DialogDescription>
            Ingresa los detalles del nuevo estudiante.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="full_name" className="text-right">Nombre</Label>
            <Input
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="code" className="text-right">Código</Label>
            <Input
              id="code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="group" className="text-right">Grupo</Label>
            <select
              id="group"
              name="group"
              value={formData.group}
              onChange={handleChange}
              className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              required
            >
              <option value="">Seleccionar...</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>
          <DialogFooter>
            <Button type="submit">Guardar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}