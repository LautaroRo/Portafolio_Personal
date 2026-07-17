"use client";
import { useState, useEffect } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { arrayMove, SortableContext, rectSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import "./estilos.css";

// Componente individual
function SkillItem({ id }: { id: string }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = { 
    transform: CSS.Transform.toString(transform), 
    transition 
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="skill-item">
      {id}
    </div>
  );
}

export default function Habilidades() {
  // 1. Estado para saber si ya estamos en el cliente
  const [isMounted, setIsMounted] = useState(false);
  const [skills, setSkills] = useState([
    "Next.JS", "React JS", "Node.js", "Nest.js", 
    "TypeScript", "JavaScript", "SQL", "Mongo DB", 
    "Tailwind", "Git", "GitHub", "Scrum", "Express", "Jest"
  ]);

  // 2. Este efecto solo corre en el navegador (cliente)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  function handleDragEnd(event: any) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setSkills((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  // 3. Si no es cliente, devolvemos un contenedor vacío o null.
  // Esto evita que React intente comparar el render del servidor con el del cliente.
  if (!isMounted) {
    return <section id="habilidades" className="habilidades-container"><div className="grid"></div></section>;
  }

  return (
    <section id="habilidades" className="habilidades-container">
      <h2>Inventario de Habilidades</h2>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={skills} strategy={rectSortingStrategy}>
          <div className="grid">
            {skills.map((skill) => <SkillItem key={skill} id={skill} />)}
          </div>
        </SortableContext>
      </DndContext>
    </section>
  );
}