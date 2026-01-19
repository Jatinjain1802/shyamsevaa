import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../utils/axios";
const dummyPoojas = [
  {
    id: 1,
    title: "Maha Mrityunjaya Pooja",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWcGVxTbR45Wbse29M3i7P5UURlx3G5oUOyw&s",
  },
  {
    id: 2,
    title: "Rudrabhishek Pooja",
    image: "https://cdn.panditsnearme.com/uploads/2024/09/Rudrabhishek-Puja.webp",
  },
  {
    id: 3,
    title: "Navagraha Shanti Pooja",
    image: "https://www.panditg.in/wp-content/uploads/2024/03/Navgrah-2.jpeg",
  },
];

export default function TempleDetail() {
  const { id } = useParams();
  const [temple, setTemple] = useState(null);
  const [poojas, setPoojas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemple = async () => {
      try {
        const res = await api.get(`/temples/public/${id}`);
        setTemple(res.data.data);
      } catch (err) {
        console.error("Failed to load temple", err);
      } finally {
        setLoading(false);
      }
    };

    // const fetchPoojas = async () => {
    //   try {
    //     const res = await api.get(`/poojas/temple/${id}`);
    //     setPoojas(res.data.data || []);
    //   } catch (err) {
    //     console.error("Failed to load poojas", err);
    //   }
    // };

    fetchTemple();
    // fetchPoojas();
    setPoojas(dummyPoojas);
  }, [id]);


  if (loading) {
    return <div className="pt-32 text-center">Loading temple...</div>;
  }

  if (!temple) {
    return <div className="pt-32 text-center">Temple not found</div>;
  }

  return (
    <div className="pt-25 max-w-5xl mx-auto px-4">
      {/* Image */}
      <div className="w-full h-80 rounded-2xl overflow-hidden mb-8 bg-gray-100">
        {temple.image ? (
          <img
            src={temple.image}
            alt={temple.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
      </div>

      {/* Content */}
      <h1 className="text-3xl font-bold mb-4">{temple.title}</h1>
      <p className="text-gray-700 leading-relaxed">{temple.description}</p>

      {/* NEXT PHASE */}
      <div className="mt-12 mb-12">
        <h2 className="text-2xl text-center font-semibold mb-6">
          Poojas at this Temple
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {poojas.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
            >
              <div className="h-44 bg-gray-100">
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold">{p.title}</h3>

                <button className="mt-3 text-sm text-orange-600 font-medium hover:underline">
                  View Details →
                </button>
              </div>
            </div>
          ))}

          {poojas.length === 0 && (
            <p className="col-span-full text-gray-500">
              No poojas available for this temple.
            </p>
          )}
        </div>
      </div>

    </div>
  );
}
