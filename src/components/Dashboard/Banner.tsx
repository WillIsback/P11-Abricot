import CustomButton from "../CustomButton/CustomButton"

interface BannerProps {
  title: string;
  firstName: string;
  lastName: string;
}

export default function Banner (props: BannerProps){
  return (
    <section className="flex justify-between" aria-label="Banniere">
      <div className="flex flex-col gap-3.5 justify-center">
        <h4>{props.title}</h4>
        <p>Bonjour {props.firstName} {props.lastName}, voici un aperçu de vos projets et tâches</p>
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