import { useEffect, useState } from "react";
import api from "../../utils/axios";

export default function PoojaTemples({ poojaId }) {
    const [linked, setLinked] = useState([]);
    const [temples, setTemples] = useState([]);
    const [selected, setSelected] = useState("");

    const load = async () => {
        const [t1, t2] = await Promise.all([
            api.get(`/admin/poojas/${poojaId}/temples`),
            api.get(`/admin/temples`),
        ]);

        setLinked(t1.data.data);
        setTemples(t2.data.data);
    };

    useEffect(() => {
        if (poojaId) load();
    }, [poojaId]);

    const add = async () => {
        await api.post(`/admin/poojas/${poojaId}/temples`, {
            temple_id: selected,
        });
        setSelected("");
        load();
    };

    const remove = async (mapId) => {
        await api.delete(`/admin/poojas/temples/${mapId}`);
        load();
    };

    return (
        <div className="mt-10">
            <h2 className="text-xl font-semibold mb-4">
                Linked Temples
            </h2>

            <div className="flex gap-3 mb-6">
                <select
                    value={selected}
                    onChange={(e) => setSelected(e.target.value)}
                    className="border p-2 rounded w-full"
                >
                    <option value="">Select Temple</option>
                    {temples.map((t) => (
                        <option key={t.id} value={t.id}>
                            {t.title}
                        </option>
                    ))}
                </select>

                <button
                    onClick={add}
                    className="bg-orange-600 text-white px-4 py-2 rounded"
                >
                    Link
                </button>
            </div>

            <ul className="space-y-2">
                {linked.map((t) => (
                    <li
                        key={t.mapId}
                        className="flex justify-between bg-white p-3 rounded shadow"
                    >
                        <span>{t.title}</span>
                        <button
                            onClick={() => remove(t.mapId)}
                            className="text-red-600"
                        >
                            Remove
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
