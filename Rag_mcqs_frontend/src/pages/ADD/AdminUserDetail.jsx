import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../../api/axios";
import "./AdminDashboardStat.css";

export default function AdminUserDetail() {
    const { id } = useParams();

    const { data } = useQuery({
        queryKey: ["user-detail", id],
        queryFn: async () =>
            (await api.get(`/admin/dashboard/users/${id}`)).data,
    });

    return (
        <div className="admin-wrapper">
            <h2 className="title"> Student Name:{data?.name}</h2>
            <p className="email muted">Email:{data?.email}</p>

            <h3 className="section-title">📄 Quiz Attempts</h3>

            <div className="data-card">
                <div className="data-header five">
                    <span>Subject</span>
                    <span>Score</span>
                    <span>%</span>
                    <span>Grade</span>
                    <span>Date</span>
                </div>

                {data?.results?.map((r, i) => (
                    <div className="data-row five" key={i}>
                        <span className="strong">{r.subject}</span>
                        <span>{r.score}/{r.total}</span>
                        <span className="success">{r.percentage}%</span>
                        <span className="success">{r.grade}</span>
                        <span className="muted">
                            {new Date(r.attempted_on).toLocaleDateString()}
                        </span>
                    </div>
                ))}

                {!data?.results?.length && (
                    <div className="data-row five muted">
                        No attempts found
                    </div>
                )}
            </div>
        </div>
    );
}
