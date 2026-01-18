import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api/axios";
import { Link } from "react-router-dom";
import "./AdminDashboardStat.css";

export default function AdminUsers() {
    const qc = useQueryClient();

    const { data } = useQuery({
        queryKey: ["admin-users"],
        queryFn: async () => (await api.get("/admin/dashboard/users")).data,
    });

    const delUser = useMutation({
        mutationFn: (id) => api.delete(`/admin/dashboard/users/${id}`),
        onSuccess: () => qc.invalidateQueries(["admin-users"]),
    });

    return (
        <div className="admin-wrapper">
            <h2 className="title">All Users</h2>

            <div className="data-card">
                <div className="data-header four">
                    <span>Name</span>
                    <span>Email</span>
                    <span>Attempts</span>
                    <span>Actions</span>
                </div>

                {data?.users?.map((u) => (
                    <div className="data-row four" key={u.id}>
                        <span className="strong">{u.name}</span>
                        <span className="muted">{u.email}</span>
                        <span className="success">{u.total_attempts}</span>
                        <span>
                            <Link to={`/admin/users/${u.id}`} className="btn view">
                                View
                            </Link>
                            <button
                                onClick={() => delUser.mutate(u.id)}
                                className="btn delete"
                            >
                                Delete
                            </button>
                        </span>
                    </div>
                ))}

                {!data?.users?.length && (
                    <div className="data-row four muted">
                        No users found
                    </div>
                )}
            </div>
        </div>
    );
}
