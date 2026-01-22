import LogoBrandDark from "@/assets/logo/loge_brand_dark.svg";
import CustomInput from "@/components/CustomInput/CustomInput";
import CustomButton from "@/components/CustomButton/CustomButton";
import CustomLink from "@/components/CustomLink/CustomLink";

export default function Login() {
  return (
    <div className="flex h-screen">
      <div className="flex m-auto h-256 w-360 bg-[url('/images/LogIn.png')] bg-contain bg-center">
        <main className="flex items-center justify-center w-2/5 h-256 flex-col px-35 py-13.75 gap-50.5 relative z-10 bg-gray-50">
          <LogoBrandDark />
          <div className="flex flex-col gap-7.5  justify-center items-center">
            <h1 className="text-brand-dark">Connexion</h1>
            <form className="flex flex-col gap-7.25 items-center">
              <div className="flex flex-col gap-7.25">
                <CustomInput
                  label="Email"
                  type="email"
                  inputID="mail"
                />
                <CustomInput
                  label="Mot de passe"
                  type="password"
                  inputID="mail"
                />
              </div>
              <div className="flex w-249/282">
                <CustomButton
                  label='Se connecter'
                  pending={false}
                  disabled={false}
                  buttonType= "submit"
                />
              </div>
            </form>
            <CustomLink
              label="Mot de passe oublié ?"
              link="#contact"
            />
          </div>
          <div className="flex whitespace-nowrap gap-2.5 justify-center items-center">
            <p className="body-s">Pas encore de compte ?</p>
            <CustomLink
              label="Créer un compte"
              link="/signin"
            />
          </div>
        </main>
      </div>
    </div>
  );
}