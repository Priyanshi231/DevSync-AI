import { useState, useContext, useEffect} from "react";
import { UserContext } from "../context/user.context";
import axios from "../config/axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [project, setProject] = useState([]);

  const createProject = async () => {
    if (!projectName.trim()) return;

    try {
      const res = await axios.post("/projects/create", {
        name: projectName,
      });

      console.log(res.data);

      setProjectName("");
      setIsModalOpen(false);
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  useEffect(() => {
    axios.get("/projects/all")
      .then(res => {
        setProject(res.data.projects);
      })
      .catch(err => {
        console.log("Error fetching projects:", err.response?.data || err.message);
  });
  }, []);


  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-950 via-slate-950 to-indigo-950 text-white">

      {/* ================= Navbar ================= */}

      <nav className="sticky top-0 z-50 border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">

          <div>
            <h1 className="bg-linear-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-3xl font-bold text-transparent">
              DevSync AI
            </h1>

            <p className="mt-1 text-sm text-zinc-400">
              AI Powered Collaboration Platform
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-lg">

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-linear-to-r from-blue-500 to-cyan-500 text-lg font-bold">
              {user?.email?.charAt(0).toUpperCase()}
            </div>

            <div>
              <p className="text-sm font-medium">
                {user?.email}
              </p>

              <p className="text-xs text-zinc-400">
                Developer
              </p>
            </div>

          </div>

        </div>
      </nav>

      {/* ================= Hero ================= */}

      <section className="mx-auto flex max-w-7xl flex-col justify-between gap-8 px-8 py-16 lg:flex-row lg:items-center">

        <div>

          <h2 className="text-5xl font-bold leading-tight">

            Welcome Back 👋

          </h2>

          <p className="mt-5 max-w-2xl text-lg text-zinc-400">

            Build intelligent software faster with your team.
            Create projects, invite collaborators and let AI help
            throughout your development workflow.

          </p>

          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-8 rounded-xl bg-linear-to-r from-cyan-500 to-blue-600 px-7 py-3 font-semibold shadow-lg shadow-cyan-500/20 transition duration-300 hover:scale-105"
          >
            + Create New Project
          </button>

        </div>

        {/* Hero Card */}

        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

          <h3 className="text-2xl font-semibold">
            Your Workspace
          </h3>

          <p className="mt-3 text-zinc-400">
            Start collaborating with teammates, build amazing
            AI powered products and manage everything from one place.
          </p>

          <div className="mt-8 space-y-4">

            <div className="rounded-xl bg-white/5 p-4">
              <p className="text-zinc-400 text-sm">
                Projects
              </p>

              <h4 className="mt-1 text-3xl font-bold">
                {project.length}
              </h4>
            </div>

            <div className="rounded-xl bg-white/5 p-4">
              <p className="text-zinc-400 text-sm">
                Collaborators
              </p>

              <h4 className="mt-1 text-3xl font-bold">
                0
              </h4>
            </div>

          </div>

        </div>

      </section>

      {/* ================= Projects ================= */}

      <section className="mx-auto max-w-7xl px-8 pb-16">

        <div className="mb-8 flex items-center justify-between">

          <div>

            <h2 className="text-3xl font-bold">
              Recent Projects
            </h2>
  
          </div>

        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

          {/* Project Card */}

          <button
            onClick={() => setIsModalOpen(true)}
            className="group flex h-72 flex-col items-center justify-center rounded-3xl border border-dashed border-cyan-500/40 bg-white/5 backdrop-blur-xl transition-all duration-300 hover:scale-[1.03] hover:border-cyan-400 hover:bg-cyan-500/10"
          >

            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-cyan-500/10 text-6xl text-cyan-400 transition duration-500 group-hover:rotate-90">
              +
            </div>

            <h3 className="mt-8 text-2xl font-semibold">
              Create Project
            </h3>
          </button>
          

            {project.map((project) => (

              <button
                onClick={() => navigate("/project", { state: { project } })}
                className="group flex h-72 flex-col items-center justify-center rounded-3xl border border-dashed border-cyan-500/40 bg-white/5 backdrop-blur-xl transition-all duration-300 hover:scale-[1.03] hover:border-cyan-400 hover:bg-cyan-500/10"
              >
                
              <div key={project._id} className="rounded-xl bg-white/5 p-4">
                <h2 className="text-xl font-semibold">{project.name}</h2>

                <div className="mt-2 flex items-center gap-2">
                  <p><i className ="ri-user-3-fill"></i> <small>Collaborators: </small></p>
                   {project.users.length}
                </div>
              </div>

          </button>
                
            ))}
 
        </div>

      </section>

      {/* ================= Modal ================= */}

      {isModalOpen && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">

          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-zinc-900/95 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.45)]">

            <h2 className="text-3xl font-bold">

              Create Project

            </h2>

            <p className="mt-2 text-zinc-400">

              Give your new project a meaningful name.

            </p>

            <input
              type="text"
              placeholder="Awesome AI Project"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  createProject();
                }
              }}
              className="mt-6 w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
            />

            <div className="mt-8 flex justify-end gap-3">

              <button
                onClick={() => {
                  setProjectName("");
                  setIsModalOpen(false);
                }}
                className="rounded-xl border border-zinc-700 px-5 py-2 transition hover:bg-zinc-800"
              >
                Cancel
              </button>

              <button
                onClick={createProject}
                className="rounded-xl bg-linear-to-r from-cyan-500 to-blue-600 px-6 py-2 font-semibold transition hover:scale-105"
              >
                Create
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default Home;