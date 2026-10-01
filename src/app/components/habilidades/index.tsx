"use client";

import { CSSProperties, useId, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Reveal from "../reveal";
import { useTextos } from "../../../context/tema";
import "./estilos.css";

const SKILLS = [
  "Next.JS", "React JS", "Node.js", "Nest.js",
  "TypeScript", "JavaScript", "SQL", "Mongo DB",
  "Tailwind", "Git", "GitHub", "Scrum", "Express", "Jest",
];

function SkillItem({ id, index }: { id: string; index: number }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    "--i": index,
  } as CSSProperties;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`skill-item ${isDragging ? "is-dragging" : ""}`}
    >
      {id}
    </div>
  );
}

export default function Habilidades() {
  const t = useTextos();
  const [skills, setSkills] = useState(SKILLS);
  // id estable entre servidor y cliente: evita el error de hidratación de dnd-kit
  const dndId = useId();

  // Distancia mínima y espera en táctil: sin esto, en el celular no se podía scrollear sobre las habilidades.
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleDragEnd({ active, over }: DragEndEvent) {
    if (over && active.id !== over.id) {
      setSkills((items) =>
        arrayMove(items, items.indexOf(String(active.id)), items.indexOf(String(over.id))),
      );
    }
  }

  return (
    <section id="habilidades" className="habilidades-container">
      <Reveal as="h2" className="section-title">
        {t["skills.title"]}
      </Reveal>
      <Reveal as="p" className="section-hint" delay={100}>
        {t["skills.hint"]}
      </Reveal>

      <DndContext id={dndId} sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={skills} strategy={rectSortingStrategy}>
          <Reveal className="grid skills-grid">
            {skills.map((skill) => (
              <SkillItem key={skill} id={skill} index={SKILLS.indexOf(skill)} />
            ))}
          </Reveal>
        </SortableContext>
      </DndContext>
    </section>
  );
}
