import CallToAction from "../components/CallToAction";
import PostCard from "../components/PostCard";
import ProjectCard from "../components/ProjectCard";

export default function Projects() {
const reactprojects=[
    {
        img:"./assets/busybuy.png",
        title:"BusyBuy E-Commerce App",
        technology:"React JS, Context API, Firebase",
        github:"https://github.com/Shinia-Gupta/Busybuy-I",
        live:"https://teal-baklava-4f8e44.netlify.app/",
    },
    {
        img:"./assets/contactapp.png",
        title:"Contact App",
        technology:"React JS, Redux Toolkit, Chakra UI, API Integration",
        github:"https://github.com/Shinia-Gupta/Contact-List-App",
        live:"https://master--shiniaxcontactmate.netlify.app/",
    },
    {
        img:"./assets/habittracker.png",
        title:"Habit Tracker App",
        technology:"React JS, Redux Toolkit, Chakra UI",
        github:"https://github.com/Shinia-Gupta/Habit-Tracker",
        live:"https://shiniaxhabittracker.netlify.app/",
    },
    
]

const nodeprojects=[
    {
        img:"./assets/nodeauth.png",
        title:"Node Authenticator",
        technology:"Node JS, Express JS, MongoDB, EJS",
        github:"https://github.com/Shinia-Gupta/Node-Authenticator-CN",
        live:"https://node-authenticator-cn.onrender.com/",
    },
    {
        img:"./assets/careercamp.png",
        title:"Career Camp",
        technology:"Node JS, Express JS, MongoDB, EJS",
        github:"https://github.com/Shinia-Gupta/Student-Interview-Management-App",
        live:"https://student-interview-management-app.onrender.com/",
    },
    {
        img:"https://digitalapicraft.com/wp-content/uploads/2022/11/api.jpg",
        title:"StoreFleet API",
        technology:"Node JS, Express JS, MongoDB",
        github:"https://github.com/Shinia-Gupta/Store-Fleet-API",
  
    },
    {
        img:"https://digitalapicraft.com/wp-content/uploads/2022/11/api.jpg",
        title:"PostAway Social Media API",
        technology:"Node JS, Express Js, MongoDB",
        github:"https://github.com/Shinia-Gupta/Social-Media-Application-Backend-II",
        
    },
    
]
const jsprojects=[
    {
        img:"./assets/todo.png",
        title:"To Do List App",
        technology:"Vanilla JavaScript, Bootstrap",
        github:"https://github.com/Shinia-Gupta/Todo-List_CN",
        live:"https://shinia-gupta.github.io/Todo-List_CN/",
    },
    {
        img:"./assets/superhero.png",
        title:"Superhero Hunter",
        technology:"Vanilla JavaScript, API Integration",
        github:"https://github.com/Shinia-Gupta/Superhero-Hunter_CN",
        live:"https://shinia-gupta.github.io/Superhero-Hunter_CN/",
    },
    {
        img:"./assets/stockmarket.png",
        title:"Stock Market Analysis App",
        technology:"Vanilla Javascript, API Integration",
        github:"https://github.com/Shinia-Gupta/Stock-Market-Analysis",
        live:"https://shinia-gupta.github.io/Stock-Market-Analysis/",
    },
    
]
  return (
    <div className='flex flex-col md:flex-row'>

      <div className='w-full'>
      <CallToAction/>
        <h1 className='text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5 '>
          Projects
        </h1>
        <div className='p-7 '>
            <div className="mt-5">
          <h2 className="text-xl mb-4 font-semibold uppercase">React JS</h2>
          <div className="flex gap-4 flex-wrap ">
            {reactprojects.map((project)=>(
            <ProjectCard img={project.img} github={project.github} live={project.live} title={project.title} technology={project.technology}/>
        ))}
          </div>
            </div>
            <div className="mt-5">
          <h2 className="text-xl mb-4 font-semibold uppercase">Node JS</h2>
          <div className="flex gap-4 flex-wrap ">
            {nodeprojects.map((project)=>(
            <ProjectCard img={project.img} github={project.github} live={project.live} title={project.title} technology={project.technology}/>
        ))}
          </div>
            </div> 
            <div className="mt-5">
          <h2 className="text-xl mb-4 font-semibold uppercase">javascript</h2>
          <div className="flex gap-4 flex-wrap ">
            {jsprojects.map((project)=>(
            <ProjectCard img={project.img} github={project.github} live={project.live} title={project.title} technology={project.technology}/>
        ))}
          </div>
            </div>
        </div>
      </div>
    </div>
  );
}