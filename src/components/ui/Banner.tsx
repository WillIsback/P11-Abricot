'use client';
import { usePathname } from "next/navigation";
import { useState } from "react";
import CustomButton from "./CustomButton"
import CreateProject from "../Projects/Modal/CreateProject";

interface BannerProps {
  title: string;
  name: string;
}

export default function Banner (props: BannerProps){
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const isProject = pathname.includes('projects');


  return (
    <section className="flex justify-between" aria-label="Banniere">
      <div className="flex flex-col gap-3.5 justify-center">
        <h4>{props.title}</h4>
        {isProject
          ? <p>Gérez vos projets</p>
          : <p>Bonjour {props.name}, voici un aperçu de vos projets et tâches</p>
        }
      </div>
      <div className="flex items-center w-[181px]">
        <CustomButton
          label="+ Créer un projet"
          pending={false}
          disabled={false}
          buttonType="button"
          onClick={() => setIsOpen(true)}
          className="whitespace-nowrap"
        />
      </div>
      {isOpen && (
        <CreateProject
          open={isOpen}
          onOpenChange={setIsOpen}
        />
      )}

    </section>
  )
}