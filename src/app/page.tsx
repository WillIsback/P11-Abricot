import IAButton from "@/components/IAButton/IAButton";
import Chips from "@/components/Chips/Chips";
import Tags from "@/components/Tags/Tags";
import CardProject from "@/components/Card/CardPoject";
import UserIcon from "@/components/UserIcon/UserIcon";
import MenuItems from "@/components/MenuItems/MenuItems";
import IconButton from "@/components/IconButton/IconButton";
export default function Home() {
  return (
    <div className="flex">
      <main className="flex">
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
        </div>
      </main>
    </div>
  );
}
