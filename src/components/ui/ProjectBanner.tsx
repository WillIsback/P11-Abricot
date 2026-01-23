import CustomButton from "./CustomButton"

interface ProjectBannerProps {
  title: string;
  description: string;
}

export default function ProjectBanner (props: ProjectBannerProps){


  return (
    <section className="flex justify-between" aria-label="Banniere">
      <div className="flex flex-col gap-3.5 justify-center">
        <h4>{props.title}</h4>
        <p>{props.description}</p>
      </div>
      <div className="flex items-center w-45.25">
        <CustomButton
          label="+ Créer un projet"
          pending={false}
          disabled={false}
          buttonType="button"
        />
      </div>
    </section>
  )
}