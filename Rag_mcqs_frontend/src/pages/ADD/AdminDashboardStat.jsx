import { useQuery } from "@tanstack/react-query";
import api from "../../api/axios";
import "./AdminDashboardStat.css";

export default function AdminDashboardStat() {
    const { data: overall } = useQuery({
        queryKey: ["admin-overall"],
        queryFn: async () => (await api.get("/admin/dashboard/stats/overall")).data,
    });

    const { data: top } = useQuery({
        queryKey: ["top-performers"],
        queryFn: async () =>
            (await api.get("/admin/dashboard/stats/top-performers")).data,
    });

    const { data: subjects } = useQuery({
        queryKey: ["subject-analytics"],
        queryFn: async () =>
            (await api.get("/admin/dashboard/stats/subjects")).data,
    });

    return (
        <div className="admin-wrapper">
            <h2 className="title">Admin Dashboard</h2>

            {/* Stats */}
            <div className="stats-grid">
                <div className="stat-card">
                    <h4>Total Attempts</h4>
                    <p>{overall?.total_attempts ?? 0}</p>
                </div>
                <div className="stat-card">
                    <h4>Average %</h4>
                    <p>{overall?.average_percentage ?? 0}%</p>
                </div>
                <div className="stat-card">
                    <h4>Pass Rate</h4>
                    <p>{overall?.pass_rate ?? 0}%</p>
                </div>
            </div>

            {/* Top Performers */}
            <h3 className="section-title">🏆 Top Performers</h3>

            <div className="data-card">
                <div className="data-header">
                    <span>Name</span>
                    <span>Email</span>
                    <span>Avg %</span>
                    <span>Attempts</span>
                </div>

                {top?.top_performers?.map((u, i) => (
                    <div className="data-row" key={i}>
                        <span className="strong">{u.name}</span>
                        <span className="muted">{u.email}</span>
                        <span className="success">{u.average_percentage}%</span>
                        <span className="success">{u.attempts}</span>
                    </div>
                ))}
            </div>

            {/* <h3 className="section-title">🏆 Top Performers</h3>
            <div className="table-wrapper">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Avg %</th>
                            <th>Attempts</th>
                        </tr>
                    </thead>
                    <tbody>
                        {top?.top_performers?.map((u, i) => (
                            <tr key={i}>
                                <td>{u.name}</td>
                                <td>{u.email}</td>
                                <td>{u.average_percentage}%</td>
                                <td>{u.attempts}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div> */}


            {/* Subject Analytics */}
            <h3 className="section-title">📈 Subject Analytics</h3>

            <div className="data-card">
                <div className="data-header three">
                    <span>Subject</span>
                    <span>Total Attempts</span>
                    <span>Avg %</span>
                </div>

                {subjects?.subjects?.map((s, i) => (
                    <div className="data-row three" key={i}>
                        <span className="strong">{s.subject}</span>
                        <span>{s.total_attempts}</span>
                        <span className="success">{s.average_percentage}%</span>
                    </div>
                ))}
            </div>

            {/* <h3 className="section-title">📈 Subject Analytics</h3>
            <div className="table-wrapper">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Subject</th>
                            <th>Total Attempts</th>
                            <th>Avg %</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subjects?.subjects?.map((s, i) => (
                            <tr key={i}>
                                <td>{s.subject}</td>
                                <td>{s.total_attempts}</td>
                                <td>{s.average_percentage}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div> */}
        </div>
    );
}
