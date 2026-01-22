import IAButton from "@/components/IAButton/IAButton";
import Chips from "@/components/Chips/Chips";
import Tags from "@/components/Tags/Tags";
import CardProject from "@/components/Card/CardPoject";
import UserIcon from "@/components/UserIcon/UserIcon";
import MenuItems from "@/components/MenuItems/MenuItems";
import IconButton from "@/components/IconButton/IconButton";
import CustomLink from "@/components/CustomLink/CustomLink";
import CustomButton from "@/components/CustomButton/CustomButton";
import CustomInput from "@/components/CustomInput/CustomInput";
import Menu from "@/components/Menu/Menu";
import Footer from "@/components/Footer/Footer";
import Comment from "@/components/Comment/Comment";
import TaskThumbnail from "@/components/Tasks/TaskThumbnail";
import TaskKanban from "@/components/Tasks/TaskKanban";
import TaskProject from "@/components/Tasks/TaskProject/TaskProject";
import TaskAI from "@/components/Tasks/TaskAi";


export default function Home() {
  return (
    <div className="flex">
      <main className="flex flex-col">
        <Menu />
        <div className="flex gap-20 border-2 px-4 py-4 flex-wrap">
          <div className="flex flex-col">
            <h2>IA Button</h2>
            <IAButton />
          </div>
          <div className="flex flex-col bg-blue-300 px-4 gap-4">
            <h2>Chips</h2>
            <Chips type="task" />
            <Chips type="task" isActive={true}/>
            <Chips type="kanban" />
            <Chips type="kanban" isActive={true}/>
            <Chips type="project" />
            <Chips type="project" isActive={true}/>
          </div>
          <div className="flex flex-col gap-4 bg-purple-300 px-1">
            <h2>Tags</h2>
            <div className="flex flex-col gap-2">
              <Tags label="Test" color="info" />
              <Tags label="Test" color="success" />
              <Tags label="Test" color="gray" />
              <Tags label="Test" color="orange" />
              <Tags label="Test" color="error" />
            </div>
          </div>
          <div>
            <h2>CardProject</h2>
            <CardProject
              name='Nom du projet'
              description="Développement de la nouvelle version de l'API REST avec authentification JWT"
              todo={4}
              completed={1}
              team={3}
              creator="AD"
              assigned={['BD','CV']}
            />
          </div>
          <div>
            <h2>User Icon</h2>
            <UserIcon user={'AD'} />
          </div>
          <div className="flex flex-col bg-purple-300 px-4 gap-4 py-4">
            <h2>Menu Items</h2>
            <MenuItems />
          </div>
          <div className="flex flex-col bg-purple-300 px-4 gap-4 py-4">
            <h2>Icon Button</h2>
            <IconButton button="MoveLeft" />
            <IconButton button="Ellipsis" />
          </div>
          <div className="flex flex-col bg-purple-300 px-4 gap-4 py-4">
            <h2>Link Custom</h2>
              <CustomLink label="Link" link="/" />
          </div>
          <div className="flex flex-col bg-purple-300 px-4 gap-4 py-4">
            <h2>Button Custom</h2>
              <CustomButton label="Label" pending={false} buttonType="button" disabled={false} />
              <CustomButton label="Label" pending={true} buttonType="button" disabled={false} />
              <CustomButton label="Label" pending={false} buttonType="button" disabled={true} />
          </div>
          <div className="flex flex-col bg-gray-200 px-4 gap-4 py-4">
            <h2>Input Custom</h2>
              <CustomInput label="Label" inputID="Input-test" type="text"/>
              <CustomInput label="Label" inputID="Input-test" type="DatePicker"/>
              <CustomInput label="Label" inputID="Input-test" type="ComboBox"/>
          </div>
          <div className="flex flex-col bg-gray-200 px-4 gap-4 py-4">
            <h2>Comment</h2>
              <Comment />
          </div>
          <div className="flex flex-col bg-gray-200 px-4 gap-4 py-4">
            <h2>Tasks</h2>
            <div className="w-255.5">
              <h3>Thumnail</h3>
                <TaskThumbnail />
              </div>
            <div className="w-92.75">
              <h3>Kanban</h3>
                <TaskKanban />
            </div>
            <div className="w-92.75">
              <h3>Projet</h3>
                <TaskProject
                  name="Authentification JWT"
                  description="Implémenter le système d'authentification avec tokens JWT"
                  labelProps={{label: 'À faire', color: 'error'}}
                  dueDate={new Date("2026-03-09")}
                  assignees={{assignees: [
                    {intial: 'BD',firstName: 'Bertrand', lastName: 'Dupont'},
                    {intial: 'AD',firstName: 'Anne', lastName: 'Dupont'}]}}
                  comments={1}
                />
            </div>
            <div className="w-92.75">
              <h3>Task AI</h3>
                <TaskAI />
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
}
