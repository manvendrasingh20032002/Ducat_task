import { useEffect, useState } from "react";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import { toast } from "react-hot-toast";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  // Load dummy + user-specific posts
  useEffect(() => {
    if (!user) return;

    const dummyPosts = [
      { _id: "1", title: "Welcome Post", content: "This is a dummy post", author: "Admin" },
      { _id: "2", title: "Another Post", content: "Hello world!", author: "Admin" },
    ];

    axios
      .get("/posts")
      .then((res) => {
        // Filter posts created by the logged-in user
        const userPosts = res.data.filter((p) => p.authorId === user._id);
        setPosts([...dummyPosts, ...userPosts]);
      })
      .catch(() => {
        setPosts(dummyPosts);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user]);

  const createPost = async () => {
    if (!title || !content) {
      toast.error("Title and Content are required!");
      return;
    }

    try {
      const res = await axios.post("/posts", {
        title,
        content,
        authorId: user._id,
        author: user.name,
      });
      setPosts([res.data, ...posts]);
      setTitle("");
      setContent("");
      toast.success("Post created!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create post!");
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-lg">Loading dashboard...</div>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Welcome, {user?.name}</h2>
      <button
        onClick={logout}
        className="bg-red-500 text-white px-4 py-2 rounded mb-6 hover:bg-red-600 transition"
      >
        Logout
      </button>

      {/* Create post */}
      <div className="mb-8 p-4 border rounded shadow-sm">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post Title"
          className="border p-2 rounded w-full mb-2"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Post Content"
          className="border p-2 rounded w-full mb-2"
        />
        <button
          onClick={createPost}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
        >
          Create Post
        </button>
      </div>

      {/* Posts list */}
      <h3 className="font-bold text-xl mb-2">Posts</h3>
      {posts.length === 0 && <p className="text-gray-500">No posts yet.</p>}
      {posts.map((post) => (
        <div key={post._id} className="mb-4 p-4 border rounded shadow-sm">
          <h4 className="font-semibold">{post.title}</h4>
          <p>{post.content}</p>
          <small className="text-gray-500">by {post.author || user.name}</small>
        </div>
      ))}
    </div>
  );
}