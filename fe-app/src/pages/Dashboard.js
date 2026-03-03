import React, { useEffect, useMemo, useState } from "react";
import api from "../services/api";

export default function Dashboard({ token, setToken }) {
    const [goods, setGoods] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [form, setForm] = useState({
        name: "",
        price: "",
        quantity: "",
    });

    const totalGoods = useMemo(() => goods.length, [goods]);
    const totalQuantity = useMemo(
        () => goods.reduce((sum, item) => sum + Number(item.quantity || 0), 0),
        [goods]
    );

    const fetchGoods = async () => {
        try {
            setLoading(true);

            const res = await api.get("/goods", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = Array.isArray(res.data)
                ? res.data
                : Array.isArray(res.data?.data)
                    ? res.data.data
                    : [];

            setGoods(data);
        } catch (err) {
            console.log(err);
            alert("Không load được danh sách hàng hóa");
            setGoods([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGoods();
    }, [token]);

    const handleChange = (field, value) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const resetForm = () => {
        setForm({
            name: "",
            price: "",
            quantity: "",
        });
    };

    const handleAdd = async () => {
        if (!form.name.trim() || !form.price || !form.quantity) {
            alert("Vui lòng nhập đủ thông tin");
            return;
        }

        if (Number(form.price) < 0 || Number(form.quantity) < 0) {
            alert("Giá và số lượng phải lớn hơn hoặc bằng 0");
            return;
        }

        try {
            setSubmitting(true);

            const res = await api.post(
                "/goods",
                {
                    name: form.name.trim(),
                    price: Number(form.price),
                    quantity: Number(form.quantity),
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const newItem = res.data?.data ?? res.data;
            setGoods((prev) => [newItem, ...prev]);
            resetForm();
        } catch (err) {
            console.log(err);
            alert("Lỗi khi thêm hàng hóa");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn chắc chắn muốn xóa hàng hóa này?")) return;

        try {
            await api.delete(`/goods/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setGoods((prev) => prev.filter((item) => item.id !== id));
        } catch (err) {
            console.log(err);
            alert("Xóa thất bại");
        }
    };
    const handleLogout = async () => {
        if (!window.confirm("Bạn chắc chắn muốn đăng xuất?")) return;

        try {
            await api.post(
                "/logout",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
        } catch (err) {
            console.log(err);
        }

        localStorage.removeItem("token");
        setToken(null);
    };

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <div style={styles.header}>
                    <div>
                        <p style={styles.badge}>Hệ thống quản lý</p>
                        <div style={styles.header}>
                            <h1 style={{ color: "#fff" }}>📦 Quản Lý Hàng Hóa</h1>

                            <button style={styles.logoutBtn} onClick={handleLogout}>
                                🚪 Đăng xuất
                            </button>
                        </div>
                        <p style={styles.subtitle}>
                            Theo dõi danh sách, số lượng và giá hàng hóa một cách
                            trực quan.
                        </p>
                    </div>

                    <div style={styles.summaryWrap}>
                        <div style={styles.summaryCard}>
                            <span style={styles.summaryLabel}>Tổng mặt hàng</span>
                            <strong style={styles.summaryValue}>
                                {totalGoods}
                            </strong>
                        </div>
                        <div style={styles.summaryCard}>
                            <span style={styles.summaryLabel}>Tổng số lượng</span>
                            <strong style={styles.summaryValue}>
                                {totalQuantity}
                            </strong>
                        </div>
                    </div>
                </div>

                <div style={styles.content}>
                    <div style={styles.formCard}>
                        <div style={styles.formHeader}>
                            <h2 style={styles.cardTitle}>Thêm hàng hóa</h2>
                            <p style={styles.cardDesc}>
                                Nhập thông tin để tạo mới hàng hóa trong hệ thống
                            </p>
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Tên hàng hóa</label>
                            <input
                                type="text"
                                placeholder="Ví dụ: Xi măng PCB40"
                                value={form.name}
                                onChange={(e) =>
                                    handleChange("name", e.target.value)
                                }
                                style={styles.input}
                            />
                        </div>

                        <div style={styles.row}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Giá</label>
                                <input
                                    type="number"
                                    placeholder="Nhập giá"
                                    value={form.price}
                                    onChange={(e) =>
                                        handleChange("price", e.target.value)
                                    }
                                    style={styles.input}
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Số lượng</label>
                                <input
                                    type="number"
                                    placeholder="Nhập số lượng"
                                    value={form.quantity}
                                    onChange={(e) =>
                                        handleChange("quantity", e.target.value)
                                    }
                                    style={styles.input}
                                />
                            </div>
                        </div>

                        <div style={styles.formActions}>
                            <button
                                style={styles.primaryButton}
                                onClick={handleAdd}
                                disabled={submitting}
                            >
                                {submitting ? "Đang thêm..." : "Thêm hàng hóa"}
                            </button>

                            <button
                                style={styles.secondaryButton}
                                onClick={resetForm}
                                type="button"
                            >
                                Xóa form
                            </button>
                        </div>
                    </div>

                    <div style={styles.listSection}>
                        <div style={styles.listHeader}>
                            <div>
                                <h2 style={styles.cardTitle}>Danh sách hàng hóa</h2>
                                <p style={styles.cardDesc}>
                                    Hiển thị toàn bộ dữ liệu hiện có
                                </p>
                            </div>

                            <button
                                style={styles.refreshButton}
                                onClick={fetchGoods}
                                disabled={loading}
                            >
                                {loading ? "Đang tải..." : "Tải lại"}
                            </button>
                        </div>

                        {loading ? (
                            <div style={styles.emptyBox}>
                                <p style={styles.emptyText}>Đang tải dữ liệu...</p>
                            </div>
                        ) : goods.length === 0 ? (
                            <div style={styles.emptyBox}>
                                <p style={styles.emptyTitle}>Chưa có hàng hóa</p>
                                <p style={styles.emptyText}>
                                    Thêm hàng hóa mới để bắt đầu quản lý.
                                </p>
                            </div>
                        ) : (
                            <div style={styles.grid}>
                                {goods.map((item) => (
                                    <div key={item.id} style={styles.card}>
                                        <div style={styles.cardTop}>
                                            <div style={styles.iconBox}>📦</div>
                                            <div style={{ flex: 1 }}>
                                                <h3 style={styles.goodsName}>
                                                    {item.name}
                                                </h3>
                                                <p style={styles.goodsId}>
                                                    Mã: #{item.id}
                                                </p>
                                            </div>
                                        </div>

                                        <div style={styles.infoList}>
                                            <div style={styles.infoItem}>
                                                <span style={styles.infoLabel}>
                                                    Giá
                                                </span>
                                                <span style={styles.infoValue}>
                                                    {Number(
                                                        item.price || 0
                                                    ).toLocaleString("vi-VN")}{" "}
                                                    đ
                                                </span>
                                            </div>

                                            <div style={styles.infoItem}>
                                                <span style={styles.infoLabel}>
                                                    Số lượng
                                                </span>
                                                <span style={styles.infoValue}>
                                                    {Number(item.quantity || 0)}
                                                </span>
                                            </div>
                                        </div>

                                        <button
                                            style={styles.deleteButton}
                                            onClick={() =>
                                                handleDelete(item.id)
                                            }
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        background:
            "linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #2563eb 100%)",
        padding: "32px 20px",
        fontFamily: "Segoe UI, sans-serif",
    },
    container: {
        maxWidth: 1200,
        margin: "0 auto",
    },

    badge: {
        display: "inline-block",
        margin: 0,
        marginBottom: 12,
        padding: "6px 12px",
        borderRadius: 999,
        background: "rgba(255,255,255,0.16)",
        color: "#dbeafe",
        fontSize: 13,
        fontWeight: 600,
    },
    title: {
        margin: 0,
        fontSize: 36,
        fontWeight: 700,
        color: "#ffffff",
    },
    subtitle: {
        marginTop: 10,
        marginBottom: 0,
        color: "rgba(255,255,255,0.82)",
        fontSize: 15,
        maxWidth: 620,
        lineHeight: 1.6,
    },
    summaryWrap: {
        display: "flex",
        gap: 14,
        flexWrap: "wrap",
    },
    summaryCard: {
        minWidth: 160,
        background: "rgba(255,255,255,0.14)",
        border: "1px solid rgba(255,255,255,0.18)",
        backdropFilter: "blur(8px)",
        borderRadius: 16,
        padding: "16px 18px",
        color: "#fff",
    },
    summaryLabel: {
        display: "block",
        fontSize: 13,
        color: "rgba(255,255,255,0.75)",
        marginBottom: 8,
    },
    summaryValue: {
        fontSize: 24,
        fontWeight: 700,
    },
    content: {
        display: "grid",
        gridTemplateColumns: "360px 1fr",
        gap: 24,
    },
    formCard: {
        background: "#ffffff",
        borderRadius: 22,
        padding: 24,
        boxShadow: "0 20px 45px rgba(15, 23, 42, 0.18)",
        height: "fit-content",
    },
    formHeader: {
        marginBottom: 20,
    },
    cardTitle: {
        margin: 0,
        fontSize: 22,
        color: "#0f172a",
        fontWeight: 700,
    },
    cardDesc: {
        margin: "8px 0 0",
        fontSize: 14,
        color: "#64748b",
        lineHeight: 1.5,
    },
    formGroup: {
        display: "flex",
        flexDirection: "column",
        marginBottom: 16,
        flex: 1,
    },
    row: {
        display: "flex",
        gap: 14,
    },
    label: {
        marginBottom: 8,
        fontSize: 14,
        fontWeight: 600,
        color: "#334155",
    },
    input: {
        width: "100%",
        boxSizing: "border-box",
        padding: "12px 14px",
        borderRadius: 12,
        border: "1px solid #dbe2ea",
        outline: "none",
        fontSize: 14,
        background: "#f8fafc",
    },
    formActions: {
        display: "flex",
        gap: 12,
        marginTop: 8,
    },
    primaryButton: {
        flex: 1,
        border: "none",
        borderRadius: 12,
        padding: "13px 16px",
        background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
        color: "#fff",
        fontWeight: 700,
        cursor: "pointer",
        fontSize: 14,
    },
    secondaryButton: {
        minWidth: 110,
        border: "1px solid #cbd5e1",
        borderRadius: 12,
        padding: "13px 16px",
        background: "#fff",
        color: "#334155",
        fontWeight: 600,
        cursor: "pointer",
        fontSize: 14,
    },
    listSection: {
        background: "rgba(255,255,255,0.12)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 22,
        padding: 20,
        backdropFilter: "blur(10px)",
    },
    listHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 16,
        marginBottom: 18,
    },
    refreshButton: {
        border: "none",
        borderRadius: 12,
        padding: "12px 16px",
        background: "#ffffff",
        color: "#1d4ed8",
        fontWeight: 700,
        cursor: "pointer",
        fontSize: 14,
        whiteSpace: "nowrap",
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: 18,
    },
    card: {
        background: "#ffffff",
        borderRadius: 18,
        padding: 18,
        boxShadow: "0 14px 30px rgba(15, 23, 42, 0.12)",
        display: "flex",
        flexDirection: "column",
        gap: 16,
    },
    cardTop: {
        display: "flex",
        alignItems: "center",
        gap: 14,
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 14,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 22,
        background: "linear-gradient(135deg, #dbeafe, #bfdbfe)",
    },
    goodsName: {
        margin: 0,
        fontSize: 18,
        color: "#0f172a",
        fontWeight: 700,
        wordBreak: "break-word",
    },
    goodsId: {
        margin: "4px 0 0",
        fontSize: 13,
        color: "#64748b",
    },
    infoList: {
        display: "flex",
        flexDirection: "column",
        gap: 12,
    },
    infoItem: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 14px",
        borderRadius: 12,
        background: "#f8fafc",
    },
    infoLabel: {
        fontSize: 14,
        color: "#64748b",
        fontWeight: 600,
    },
    infoValue: {
        fontSize: 15,
        color: "#0f172a",
        fontWeight: 700,
    },
    deleteButton: {
        marginTop: "auto",
        width: "100%",
        border: "none",
        borderRadius: 12,
        padding: "12px 14px",
        background: "#ef4444",
        color: "#fff",
        fontWeight: 700,
        cursor: "pointer",
        fontSize: 14,
    },
    emptyBox: {
        background: "#ffffff",
        borderRadius: 18,
        padding: "36px 20px",
        textAlign: "center",
        color: "#334155",
    },
    emptyTitle: {
        margin: 0,
        fontSize: 20,
        fontWeight: 700,
        color: "#0f172a",
    },
    emptyText: {
        marginTop: 8,
        fontSize: 14,
        color: "#64748b",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 30,
    },

    logoutBtn: {
        padding: "8px 14px",
        background: "#ff4d4f",
        color: "#fff",
        border: "none",
        borderRadius: 6,
        cursor: "pointer",
        fontWeight: "bold",
        margin: "0px 50px"
    },
};