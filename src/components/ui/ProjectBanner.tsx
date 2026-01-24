import CustomButton from "./CustomButton"
import IAButtonSquare from "./IAButtonSquare";
import CustomLink from "./CustomLink";
import IconButton from "./IconButton";

interface ProjectBannerProps {
  title: string;
  description: string;
}

export default function ProjectBanner (props: ProjectBannerProps){


  return (
    <section className="flex justify-between" aria-label="Banniere">
      <div className="flex gap-4">
        <IconButton button="MoveLeft"/>
        <div className="flex flex-col gap-3.5 justify-center">
          <div className="flex justify-between w-57.75 items-center">
            <h4>{props.title}</h4>
            <CustomLink label='Modifier' link="#edit"/>
          </div>
          <p>{props.description}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <CustomButton
          label="Créer une tâche"
          pending={false}
          disabled={false}
          buttonType="button"
        />
        <IAButtonSquare />
      </div>
    </section>
  )
}